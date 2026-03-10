import { Radius, Shadows, Spacing } from "@/constants/theme";
import { ACCOUNTS } from "@/data/mcokAccounts";
import { MOCK_EVENTS } from "@/data/mockEvents";
import { MOCK_JOURNAL_ENTRIES } from "@/data/mockJournalEntries";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import {
  AlertCircle,
  Banknote,
  CalendarDays,
  Calendar as CalendarIcon,
  Wallet,
} from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface StatsSectionProps {
  theme: any;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

const StatsSection: React.FC<StatsSectionProps> = ({
  theme,
  activeFilter,
  setActiveFilter,
}) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState<"start" | "end" | null>(null);

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowPicker(null);
    if (selectedDate) {
      if (showPicker === "start") setStartDate(selectedDate);
      if (showPicker === "end") setEndDate(selectedDate);
    }
  };

  const stats = useMemo(() => {
    const now = new Date();

    const isInRange = (date: Date) => {
      const d = new Date(date);
      const dStripped = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const nowStripped = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
      );

      if (activeFilter === "Today") {
        return dStripped.getTime() === nowStripped.getTime();
      }
      if (activeFilter === "Week") {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        return d >= weekAgo && d <= now;
      }
      if (activeFilter === "Month") {
        return (
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      }
      if (activeFilter === "Custom") {
        const start = new Date(startDate.setHours(0, 0, 0, 0));
        const end = new Date(endDate.setHours(23, 59, 59, 999));
        return d >= start && d <= end;
      }
      return true;
    };

    const filteredEntries = MOCK_JOURNAL_ENTRIES.filter((entry) =>
      isInRange(entry.date),
    );
    const filteredEvents = MOCK_EVENTS.filter((event) =>
      isInRange(event.startDate),
    );

    let cashTotal = 0;
    let bankTotal = 0;
    let unpaidTotal = 0;

    // Use Sets to avoid duplicate event IDs
    const cashIds = new Set<string>();
    const bankIds = new Set<string>();
    const unpaidIds = new Set<string>();

    filteredEntries.forEach((entry) => {
      entry.transactions.forEach((tx) => {
        if (tx.accountId === ACCOUNTS.CASH.id) {
          cashTotal += tx.amount;
          if (entry.referenceId) cashIds.add(entry.referenceId);
        }
        if (tx.accountId === ACCOUNTS.BANK.id) {
          bankTotal += tx.amount;
          if (entry.referenceId) bankIds.add(entry.referenceId);
        }
        if (tx.accountId === ACCOUNTS.AR.id) {
          unpaidTotal += tx.amount;
          if (entry.referenceId) unpaidIds.add(entry.referenceId);
        }
      });
    });

    const allFilteredEventIds = filteredEvents.map((e) => e.id);

    return [
      {
        id: "cash",
        label: "Cash Revenue",
        value: `${cashTotal.toLocaleString()} د.ل.`,
        icon: <Wallet size={20} color={theme.success} />,
        bg: "#ECFDF5",
        eventIds: Array.from(cashIds),
      },
      {
        id: "bank",
        label: "Bank Revenue",
        value: `${bankTotal.toLocaleString()} د.ل.`,
        icon: <Banknote size={20} color={theme.primary} />,
        bg: "#EEF2FF",
        eventIds: Array.from(bankIds),
      },
      {
        id: "unpaid",
        label: "Unpaid",
        value: `${unpaidTotal.toLocaleString()} د.ل.`,
        icon: <AlertCircle size={20} color={theme.danger} />,
        bg: "#FEF2F2",
        eventIds: Array.from(unpaidIds),
      },
      {
        id: "events",
        label:
          activeFilter === "Custom" ? "Range Events" : `Events ${activeFilter}`,
        value: filteredEvents.length.toLocaleString(),
        icon: <CalendarIcon size={20} color={theme.warning} />,
        bg: "#FFFBEB",
        eventIds: allFilteredEventIds,
      },
    ];
  }, [activeFilter, theme, startDate, endDate]);

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: Spacing.md }}
      >
        <View style={styles.filterWrapper}>
          {["Today", "Week", "Month", "Custom"].map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => setActiveFilter(item)}
              style={[
                styles.filterPill,
                activeFilter === item && {
                  backgroundColor: theme.primary,
                  borderColor: theme.primary,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === item && { color: theme.white },
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {activeFilter === "Custom" && (
        <View style={styles.customDateContainer}>
          <TouchableOpacity
            style={[
              styles.dateInput,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
            onPress={() => setShowPicker("start")}
          >
            <CalendarDays size={16} color={theme.textSecondary} />
            <Text style={{ color: theme.textMain, marginLeft: 8 }}>
              {startDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>

          <Text style={{ color: theme.textSecondary, marginHorizontal: 8 }}>
            to
          </Text>

          <TouchableOpacity
            style={[
              styles.dateInput,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
            onPress={() => setShowPicker("end")}
          >
            <CalendarDays size={16} color={theme.textSecondary} />
            <Text style={{ color: theme.textMain, marginLeft: 8 }}>
              {endDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {showPicker && (
        <DateTimePicker
          value={showPicker === "start" ? startDate : endDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onDateChange}
        />
      )}

      <View style={styles.statsGrid}>
        {stats.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.statCard,
              { borderColor: theme.border, backgroundColor: theme.surface },
            ]}
            onPress={() =>
              router.push({
                pathname: `./stats/${item.id}`,
                params: { eventIds: JSON.stringify(item.eventIds) },
              })
            }
          >
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: item.bg, borderColor: theme.border },
              ]}
            >
              {item.icon}
            </View>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              {item.label}
            </Text>
            <Text style={[styles.statValue, { color: theme.textMain }]}>
              {item.value}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  filterWrapper: { flexDirection: "row", marginBottom: Spacing.sm },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  filterText: { fontWeight: "600", color: "#666" },
  customDateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.lg,
    justifyContent: "space-between",
  },
  dateInput: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    width: "48%",
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    ...Shadows.card,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 0.5,
  },
  statLabel: { fontSize: 13, marginBottom: 4 },
  statValue: { fontSize: 20, fontWeight: "bold" },
});

export default StatsSection;
