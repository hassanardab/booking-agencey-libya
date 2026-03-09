//app/index.tsx
import { Colors, Radius, Shadows, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { router } from "expo-router";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Home,
} from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  Dimensions,
  I18nManager,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const CALENDAR_PADDING = Spacing.lg * 2;
const CELL_SIZE = (width - CALENDAR_PADDING) / 7;

// Mock data to make the component runnable immediately
const MOCK_EVENTS = [
  {
    id: "1",
    title: "Wedding Photo",
    date: new Date(),
    type: "confirmed",
    status: "confirmed",
    time: "14:00",
  },
  {
    id: "2",
    title: "Corporate Event",
    date: new Date(),
    type: "confirmed",
    status: "partially_paid",
    time: "18:00",
  },
];

export default function CalendarScreen() {
  const scheme = useColorScheme();
  const theme = Colors[scheme ?? "light"];
  const styles = createStyles(theme);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const isRTL = I18nManager.isRTL;

  // --- Date Math Helpers ---
  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  // --- Mock Event Logic (Replace with your actual data mapping) ---
  const getEventTypesForDate = (date: Date) => {
    // Faking data based on whether the date is even/odd for demonstration
    const isToday = isSameDay(date, new Date());
    return {
      hasConfirmed: isToday || date.getDate() % 5 === 0,
      hasPartiallyPaid: isToday || date.getDate() % 8 === 0,
      hasEvents:
        isToday || date.getDate() % 5 === 0 || date.getDate() % 8 === 0,
    };
  };

  const selectedDateEvents = MOCK_EVENTS; // Mocking events for the selected list

  // --- Calendar Grid Generator ---
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // 0 = Sunday, 6 = Saturday
    const startingDay = firstDayOfMonth.getDay();
    const days = [];

    // Previous month padding
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }

    // Next month padding (keep grid to exactly 42 slots = 6 weeks)
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      });
    }

    return days;
  }, [currentDate]);

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <CalendarIcon size={20} color={theme.primary} />
            <Text style={styles.headerTitle}>Calendar View</Text>
          </View>
          <Text style={styles.headerSubtitle}>
            Long press on a day to add a new event
          </Text>
        </View>

        {/* Controls */}
        <View style={styles.controlsRow}>
          <View style={styles.monthNav}>
            <TouchableOpacity
              style={styles.navBtn}
              onPress={() => navigateMonth("prev")}
            >
              {isRTL ? (
                <ChevronRight size={20} color={theme.textMain} />
              ) : (
                <ChevronLeft size={20} color={theme.textMain} />
              )}
            </TouchableOpacity>

            <Text style={styles.monthText}>
              {currentDate.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </Text>

            <TouchableOpacity
              style={styles.navBtn}
              onPress={() => navigateMonth("next")}
            >
              {isRTL ? (
                <ChevronLeft size={20} color={theme.textMain} />
              ) : (
                <ChevronRight size={20} color={theme.textMain} />
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.todayBtn} onPress={goToToday}>
            <Home size={14} color={theme.textMain} style={{ marginRight: 6 }} />
            <Text style={styles.todayBtnText}>Today</Text>
          </TouchableOpacity>
        </View>

        {/* Calendar Card */}
        <View style={styles.calendarCard}>
          {/* Weekdays */}
          <View style={styles.weekdaysRow}>
            {weekdays.map((day, idx) => (
              <Text key={idx} style={styles.weekdayText}>
                {day}
              </Text>
            ))}
          </View>

          {/* Grid */}
          <View style={styles.grid}>
            {calendarDays.map((item, index) => {
              const isSelected = isSameDay(item.date, selectedDate);
              const isToday = isSameDay(item.date, new Date());
              const { hasConfirmed, hasPartiallyPaid, hasEvents } =
                getEventTypesForDate(item.date);

              return (
                <TouchableOpacity
                  key={index}
                  style={styles.cell}
                  onPress={() => setSelectedDate(item.date)}
                  onLongPress={() => {
                    setSelectedDate(item.date);
                    // Navigate to create event, optionally passing the date
                    router.push("/events/create");
                  }}
                  activeOpacity={0.6}
                >
                  <View
                    style={[
                      styles.dateCircle,
                      isSelected && { backgroundColor: theme.primary },
                      !isSelected &&
                        isToday && {
                          backgroundColor: theme.surface,
                          borderColor: theme.primary,
                          borderWidth: 1,
                        },
                    ]}
                  >
                    <Text
                      style={[
                        styles.dateText,
                        !item.isCurrentMonth && {
                          color: theme.textSecondary,
                          opacity: 0.4,
                        },
                        isToday &&
                          !isSelected && {
                            color: theme.primary,
                            fontWeight: "700",
                          },
                        isSelected && { color: theme.white, fontWeight: "700" },
                      ]}
                    >
                      {item.date.getDate()}
                    </Text>
                  </View>

                  {/* Event Indicators */}
                  <View style={styles.indicatorRow}>
                    {hasConfirmed && (
                      <View
                        style={[styles.dot, { backgroundColor: theme.success }]}
                      />
                    )}
                    {hasPartiallyPaid && (
                      <View
                        style={[styles.dot, { backgroundColor: theme.danger }]}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Legend */}
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendDot, { backgroundColor: theme.success }]}
            />
            <Text style={styles.legendText}>Confirmed</Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendDot, { backgroundColor: theme.danger }]}
            />
            <Text style={styles.legendText}>Unconfirmed / Unpaid</Text>
          </View>
        </View>

        {/* Selected Date Events */}
        <View style={styles.eventsSection}>
          <Text style={styles.eventsSectionTitle}>
            Events for {selectedDate.toDateString()}
          </Text>

          {selectedDateEvents.length > 0 ? (
            selectedDateEvents.map((event) => (
              <TouchableOpacity key={event.id} style={styles.eventCard}>
                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventTime}>{event.time}</Text>
                </View>
                <View
                  style={[
                    styles.eventBadge,
                    event.status === "confirmed"
                      ? { backgroundColor: theme.success + "20" }
                      : { backgroundColor: theme.danger + "20" },
                  ]}
                >
                  <Text
                    style={[
                      styles.eventBadgeText,
                      event.status === "confirmed"
                        ? { color: theme.success }
                        : { color: theme.danger },
                    ]}
                  >
                    {event.status === "confirmed"
                      ? "Confirmed"
                      : "Partially Paid"}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noEventsText}>
              No events scheduled for this day.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContent: {
      padding: Spacing.lg,
      paddingBottom: 100,
    },
    header: {
      marginBottom: Spacing.md,
    },
    headerTitleRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 4,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: theme.textMain,
    },
    headerSubtitle: {
      fontSize: 13,
      color: theme.textSecondary,
    },
    controlsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: Spacing.lg,
    },
    monthNav: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.surface,
      borderRadius: Radius.md,
      borderWidth: 1,
      borderColor: theme.border,
    },
    navBtn: {
      padding: 10,
    },
    monthText: {
      fontSize: 15,
      fontWeight: "600",
      color: theme.textMain,
      minWidth: 120,
      textAlign: "center",
    },
    todayBtn: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 8,
      backgroundColor: theme.surface,
      borderRadius: Radius.md,
      borderWidth: 1,
      borderColor: theme.border,
    },
    todayBtnText: {
      fontSize: 13,
      fontWeight: "600",
      color: theme.textMain,
    },
    calendarCard: {
      backgroundColor: theme.surface,
      borderRadius: Radius.lg,
      padding: Spacing.sm,
      borderWidth: 1,
      borderColor: theme.border,
      ...Shadows.card,
    },
    weekdaysRow: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      paddingBottom: Spacing.sm,
      marginBottom: Spacing.xs,
    },
    weekdayText: {
      width: CELL_SIZE,
      textAlign: "center",
      fontSize: 12,
      fontWeight: "600",
      color: theme.textSecondary,
      textTransform: "uppercase",
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    cell: {
      width: CELL_SIZE,
      height: CELL_SIZE + 10, // slightly taller to fit dots
      justifyContent: "center",
      alignItems: "center",
    },
    dateCircle: {
      width: 32,
      height: 32,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 16,
    },
    dateText: {
      fontSize: 15,
      color: theme.textMain,
      fontWeight: "500",
    },
    indicatorRow: {
      flexDirection: "row",
      marginTop: 4,
      gap: 3,
      height: 6, // fixed height so dates don't jump around
    },
    dot: {
      width: 5,
      height: 5,
      borderRadius: 2.5,
    },
    legendRow: {
      flexDirection: "row",
      justifyContent: "center",
      gap: Spacing.lg,
      marginTop: Spacing.lg,
    },
    legendItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    legendDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    legendText: {
      fontSize: 12,
      color: theme.textSecondary,
    },
    eventsSection: {
      marginTop: Spacing.xl,
    },
    eventsSectionTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.textMain,
      marginBottom: Spacing.md,
    },
    eventCard: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: theme.surface,
      padding: Spacing.md,
      borderRadius: Radius.md,
      borderWidth: 1,
      borderColor: theme.border,
      marginBottom: Spacing.sm,
    },
    eventInfo: {
      flex: 1,
    },
    eventTitle: {
      fontSize: 15,
      fontWeight: "600",
      color: theme.textMain,
      marginBottom: 2,
    },
    eventTime: {
      fontSize: 13,
      color: theme.textSecondary,
    },
    eventBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: Radius.sm,
    },
    eventBadgeText: {
      fontSize: 11,
      fontWeight: "700",
      textTransform: "uppercase",
    },
    noEventsText: {
      textAlign: "center",
      color: theme.textSecondary,
      fontSize: 14,
      marginTop: Spacing.md,
      fontStyle: "italic",
    },
  });
