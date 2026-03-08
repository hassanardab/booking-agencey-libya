//app/(tabs)/dashboard.tsx
import SearchOverlay from "@/components/dashboard/SearchOverlay";
import { Colors, Radius, Shadows, Spacing } from "@/constants/theme";
import { MOCK_EVENTS } from "@/data/mockEvents";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { router } from "expo-router";
import {
  AlertCircle,
  Banknote,
  Calendar as CalendarIcon,
  ChevronRight,
  Clock,
  Search,
  Plus,
  Wallet,
} from "lucide-react-native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  I18nManager,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const Dashboard = () => {
  const [activeFilter, setActiveFilter] = useState("Today");
  const [search, setSearch] = useState("");
  const [searchResultsVisible, setSearchResultsVisible] = useState(false);

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const styles = createStyles(theme);

  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;

  // 1. Updated Stats: Using string IDs that represent the filter category
  const stats = [
    {
      id: "cash", // This will be passed to /stats/[id]
      label: "Cash Revenue",
      value: "$4,250",
      icon: <Wallet size={20} color={theme.success} />,
      bg: "#ECFDF5",
    },
    {
      id: "bank",
      label: "Bank Revenue",
      value: "$12,800",
      icon: <Banknote size={20} color={theme.primary} />,
      bg: "#EEF2FF",
    },
    {
      id: "unpaid",
      label: "Unpaid",
      value: "$1,120",
      icon: <AlertCircle size={20} color={theme.danger} />,
      bg: "#FEF2F2",
    },
    {
      id: "today",
      label: "Events Today",
      value: "8",
      icon: <CalendarIcon size={20} color={theme.warning} />,
      bg: "#FFFBEB",
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

  const searchResults = MOCK_EVENTS.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase()),
  );

  const upcomingEvents = MOCK_EVENTS.filter(
    (e) => e.status === "confirmed" || e.status === "partially_paid",
  );
  const postponedEvents = MOCK_EVENTS.filter((e) => e.status === "postponed");
  // Function to dismiss search when tapping outside
  const dismissSearch = () => {
    Keyboard.dismiss();
    setSearch("");
    setSearchResultsVisible(false);
  };
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* 1. Wrap everything in TouchableWithoutFeedback */}
      <TouchableWithoutFeedback onPress={dismissSearch}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 80 },
          ]}
          // 2. Also dismiss keyboard if they start scrolling
          keyboardShouldPersistTaps="handled"
          onScrollBeginDrag={dismissSearch}
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
              onChangeText={(text) => {
                setSearch(text);
                setSearchResultsVisible(text.length > 0);
              }}
            />
          </View>

          {searchResultsVisible && <SearchOverlay results={searchResults} />}

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

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            {stats.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.statCard}
                onPress={() => router.push(`/stats/${item.id}`)}
              >
                <View style={[styles.iconCircle, { backgroundColor: item.bg }]}>
                  {item.icon}
                </View>
                <Text style={styles.statLabel}>{item.label}</Text>
                <Text style={styles.statValue}>{item.value}</Text>
              </TouchableOpacity>
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
                <Text
                  style={[styles.dateDay, i === 1 && styles.activeDateText]}
                >
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

          {/* Events Section */}
          <Text style={styles.sectionTitle}>
            {t("dashboard.upcoming.events", "Upcoming Events")}
          </Text>
          {upcomingEvents.map((event) => (
            <TouchableOpacity
              key={event.id}
              style={styles.eventCard}
              onPress={() =>
                router.push({
                  pathname: `/events/[id]`,
                  params: {
                    id: event.id,
                    title: event.title,
                    amount: event.amount,
                    status: event.status,
                  },
                })
              }
            >
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <View style={styles.eventMeta}>
                  <Clock size={14} color={theme.textSecondary} />
                  {/* Format the Date object into a readable time */}
                  <Text style={styles.eventTime}>
                    {event.startDate.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    • {event.status}
                  </Text>
                </View>
              </View>
              <View style={styles.eventRight}>
                {/* Mapping the 'amount' property */}
                <Text style={styles.eventPrice}>${event.amount}</Text>
                <ChevronRight size={18} color={theme.textSecondary} />
              </View>
            </TouchableOpacity>
          ))}

          {/* Postponed Section */}
          <View style={styles.postponedHeader}>
            <Text style={styles.sectionTitle}>
              {t("dashboard.postponed.events", "Postponed")}
            </Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{postponedEvents.length}</Text>
            </View>
          </View>

          {postponedEvents.map((item) => (
            <View key={item.id} style={styles.postponedCard}>
              <View>
                <Text style={styles.postponedTitle}>{item.title}</Text>
                <Text style={styles.postponedReason}>
                  Was: {item.startDate.toLocaleDateString()} • {item.notes}
                </Text>
              </View>
              <TouchableOpacity style={styles.rescheduleBtn}>
                <Text style={styles.rescheduleText}>Reschedule</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </TouchableWithoutFeedback>
      <TouchableOpacity 
  style={styles.fab} 
  onPress={() => router.push("/events/create")}
  activeOpacity={0.8}
>
  <Plus size={24} color={theme.white} />
</TouchableOpacity>
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
      paddingLeft: Spacing.lg,
      paddingRight: Spacing.lg,
      paddingTop: Spacing.lg,
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
    searchOverlay: {
      position: "absolute",
      top: 70,
      left: 16,
      right: 16,
      backgroundColor: theme.surface,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: theme.border,
      zIndex: 10,
      ...Shadows.card,
    },

    searchResultCard: {
      padding: Spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    filterSheet: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.surface,
      padding: Spacing.lg,
      borderTopLeftRadius: Radius.lg,
      borderTopRightRadius: Radius.lg,
      borderWidth: 1,
      borderColor: theme.border,
    },

    sheetItem: {
      paddingVertical: Spacing.lg,
    },

    sheetText: {
      fontSize: 16,
      color: theme.textMain,
    },
    fab: {
  position: 'absolute',
  bottom: 24,
  right: 24,
  width: 56,
  height: 56,
  borderRadius: 28,
  backgroundColor: theme.primary,
  justifyContent: 'center',
  alignItems: 'center',
  ...Shadows.card, // Using your design system shadow
  elevation: 5, // Android specific shadow
},
  });

export default Dashboard;
