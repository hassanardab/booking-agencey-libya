import { Colors, Radius, Shadows, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  AlertCircle,
  Banknote,
  Calendar as CalendarIcon,
  ChevronRight,
  Clock,
  Filter,
  Search,
  Wallet,
} from "lucide-react-native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  I18nManager,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Dashboard = () => {
  const [activeFilter, setActiveFilter] = useState("Today");
  const [search, setSearch] = useState("");

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const styles = createStyles(theme);
  
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;

  const stats = [
    {
      id: 1,
      label: "Cash Revenue",
      value: "$4,250",
      icon: <Wallet size={20} color={theme.success} />,
      bg: "#ECFDF5",
    },
    {
      id: 2,
      label: "Bank Revenue",
      value: "$12,800",
      icon: <Banknote size={20} color={theme.primary} />,
      bg: "#EEF2FF",
    },
    {
      id: 3,
      label: "Unpaid",
      value: "$1,120",
      icon: <AlertCircle size={20} color={theme.danger} />,
      bg: "#FEF2F2",
    },
    {
      id: 4,
      label: "Events Today",
      value: "8",
      icon: <CalendarIcon size={20} color={theme.warning} />,
      bg: "#FFFBEB",
    },
  ];

  const events = [
    {
      id: "1",
      title: "Corporate Gala",
      time: "14:00",
      status: "Confirmed",
      price: "$2,400",
    },
    {
      id: "2",
      title: "Wedding Photography",
      time: "17:30",
      status: "Pending",
      price: "$1,200",
    },
  ];

  const postponed = [
    {
      id: "3",
      title: "Product Launch",
      originalDate: "Oct 12",
      reason: "Venue Issue",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Search */}
        <View style={styles.searchContainer}>
          <Search
            size={20}
            color={theme.textSecondary}
            style={styles.searchIcon}
          />

          <TextInput
            style={styles.searchInput}
            placeholder="Search events, clients..."
            placeholderTextColor={theme.textSecondary}
            value={search}
            onChangeText={setSearch}
          />

          <TouchableOpacity style={styles.filterBtn}>
            <Filter size={20} color={theme.white} />
          </TouchableOpacity>
        </View>

        {/* Filters */}
        <View style={styles.filterWrapper}>
          {["Today", "Week", "Month", "Custom"].map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => setActiveFilter(item)}
              style={[
                styles.filterPill,
                activeFilter === item && styles.activePill,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === item && styles.activeFilterText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats */}
        <View style={styles.statsGrid}>
          {stats.map((item) => (
            <View key={item.id} style={styles.statCard}>
              <View style={[styles.iconCircle, { backgroundColor: item.bg }]}>
                {item.icon}
              </View>

              <Text style={styles.statLabel}>{item.label}</Text>
              <Text style={styles.statValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        {/* Calendar */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {t("dashboard.title", "Dashboard")}
          </Text>

          <TouchableOpacity>
            <Text style={styles.viewAll}>
              {t("dashboard.view.calendar", "View Calendar")}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.calendarStrip}
        >
          {[14, 15, 16, 17, 18, 19].map((day, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.dateCard, i === 1 && styles.activeDateCard]}
            >
              <Text style={[styles.dateDay, i === 1 && styles.activeDateText]}>
                {day}
              </Text>

              <Text
                style={[styles.dateMonth, i === 1 && styles.activeDateText]}
              >
                Mar
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Events */}
        <Text style={styles.sectionTitle}>
          {t("dashboard.upcoming.events", "Upcoming Events")}
        </Text>

        {events.map((event) => (
          <TouchableOpacity key={event.id} style={styles.eventCard}>
            <View style={styles.eventInfo}>
              <Text style={styles.eventTitle}>{event.title}</Text>

              <View style={styles.eventMeta}>
                <Clock size={14} color={theme.textSecondary} />
                <Text style={styles.eventTime}>
                  {event.time} • {event.status}
                </Text>
              </View>
            </View>

            <View style={styles.eventRight}>
              <Text style={styles.eventPrice}>{event.price}</Text>
              <ChevronRight size={18} color={theme.textSecondary} />
            </View>
          </TouchableOpacity>
        ))}

        {/* Postponed */}
        <View style={styles.postponedHeader}>
          <Text style={styles.sectionTitle}>
            {t("dashboard.postponed.events", "Postponed")}
          </Text>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>{postponed.length}</Text>
          </View>
        </View>

        {postponed.map((item) => (
          <View key={item.id} style={styles.postponedCard}>
            <View>
              <Text style={styles.postponedTitle}>{item.title}</Text>
              <Text style={styles.postponedReason}>
                Was: {item.originalDate} • {item.reason}
              </Text>
            </View>

            <TouchableOpacity style={styles.rescheduleBtn}>
              <Text style={styles.rescheduleText}>Reschedule</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (
  theme:
    | {
        primary: string;
        background: string;
        surface: string;
        textMain: string;
        textSecondary: string;
        border: string;
        divider: string;
        success: string;
        warning: string;
        danger: string;
        timelineLine: string;
        shadow: string;
        icon: string;
        white: string;
      }
    | {
        primary: string;
        background: string;
        surface: string;
        textMain: string;
        textSecondary: string;
        border: string;
        divider: string;
        success: string;
        warning: string;
        danger: string;
        timelineLine: string;
        shadow: string;
        icon: string;
        white: string;
      },
) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },

    scrollContent: {
      padding: Spacing.lg,
    },

    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: Spacing.lg,
    },

    searchIcon: {
      position: "absolute",
      left: 12,
      zIndex: 1,
    },

    searchInput: {
      flex: 1,
      backgroundColor: theme.surface,
      height: 48,
      borderRadius: Radius.md,
      paddingLeft: 44,
      paddingRight: 15,
      fontSize: 16,
      borderWidth: 1,
      borderColor: theme.border,
      color: theme.textMain,
    },

    filterBtn: {
      backgroundColor: theme.primary,
      width: 48,
      height: 48,
      borderRadius: Radius.md,
      marginLeft: Spacing.sm,
      justifyContent: "center",
      alignItems: "center",
    },

    filterWrapper: {
      flexDirection: "row",
      marginBottom: Spacing.xl,
    },

    filterPill: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      marginRight: 8,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
    },

    activePill: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },

    filterText: {
      color: theme.textSecondary,
      fontWeight: "600",
    },

    activeFilterText: {
      color: theme.white,
    },

    statsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      marginBottom: Spacing.xl,
    },

    statCard: {
      width: "48%",
      backgroundColor: theme.surface,
      padding: Spacing.lg,
      borderRadius: Radius.lg,
      marginBottom: Spacing.md,
      borderWidth: 1,
      borderColor: theme.border,
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
      borderColor: theme.border,
    },

    statLabel: {
      color: theme.textSecondary,
      fontSize: 13,
      marginBottom: 4,
    },

    statValue: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.textMain,
    },

    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: Spacing.md,
    },

    sectionTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.textSecondary,
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: Spacing.sm,
    },

    viewAll: {
      color: theme.primary,
      fontWeight: "600",
    },

    calendarStrip: {
      marginBottom: Spacing.xl,
    },

    dateCard: {
      width: 60,
      height: 80,
      backgroundColor: theme.surface,
      borderRadius: Radius.lg,
      justifyContent: "center",
      alignItems: "center",
      marginRight: Spacing.sm,
      borderWidth: 1,
      borderColor: theme.border,
    },

    activeDateCard: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },

    dateDay: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.textMain,
    },

    dateMonth: {
      fontSize: 12,
      color: theme.textSecondary,
    },

    activeDateText: {
      color: theme.white,
    },

    eventCard: {
      backgroundColor: theme.surface,
      padding: Spacing.lg,
      borderRadius: Radius.lg,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: Spacing.sm,
      borderWidth: 1,
      borderColor: theme.border,
      ...Shadows.card,
    },

    eventInfo: {
      flex: 1,
    },

    eventTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.textMain,
      marginBottom: 4,
    },

    eventMeta: {
      flexDirection: "row",
      alignItems: "center",
    },

    eventTime: {
      fontSize: 13,
      color: theme.textSecondary,
      marginLeft: 6,
    },

    eventRight: {
      flexDirection: "row",
      alignItems: "center",
    },

    eventPrice: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.textMain,
      marginRight: 8,
    },

    postponedHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: Spacing.md,
    },

    badge: {
      backgroundColor: theme.danger,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 10,
      marginLeft: 8,
      marginBottom: Spacing.sm,
    },

    badgeText: {
      color: theme.white,
      fontSize: 12,
      fontWeight: "bold",
    },

    postponedCard: {
      backgroundColor: theme.surface,
      padding: Spacing.lg,
      borderRadius: Radius.lg,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: Spacing.sm,
      borderWidth: 1,
      borderStyle: "dashed",
      borderColor: theme.border,
    },

    postponedTitle: {
      fontSize: 15,
      fontWeight: "600",
      color: theme.textMain,
    },

    postponedReason: {
      fontSize: 12,
      color: theme.textSecondary,
      marginTop: 2,
    },

    rescheduleBtn: {
      backgroundColor: theme.surface,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: Radius.sm,
      borderWidth: 1,
      borderColor: theme.border,
    },

    rescheduleText: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.primary,
    },
  });

export default Dashboard;
