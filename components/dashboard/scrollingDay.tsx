//components/dashboard/scrollingDay.tsx
import { Radius, Spacing } from "@/constants/theme";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ScrollingDayProps {
  theme: any;
  events: any[];
  onDateSelect: (date: Date) => void;
  selectedDate: Date;
}

const ScrollingDay: React.FC<ScrollingDayProps> = ({
  theme,
  events,
  onDateSelect,
  selectedDate,
}) => {
  const [dates, setDates] = useState<Date[]>([]);
  const styles = createStyles(theme);
  const listRef = useRef<FlatList>(null);

  // Initial load: 2 days before, 10 days ahead
  useEffect(() => {
    const initialDates = [];
    for (let i = -2; i <= 10; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      initialDates.push(d);
    }
    setDates(initialDates);
  }, []);

  useEffect(() => {
    const index = dates.findIndex((d) => isSameDay(d, selectedDate));

    if (index !== -1 && listRef.current) {
      listRef.current.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0.5, // centers the selected day
      });
    }
  }, [selectedDate, dates]);

  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  };

  const hasEvents = (date: Date) => {
    return events.some((event) => isSameDay(new Date(event.startDate), date));
  };

  // Logic to fetch more dates
  const fetchMore = (direction: "ahead" | "before") => {
    setDates((prev) => {
      const newDates = [...prev];
      if (direction === "ahead") {
        const lastDate = new Date(prev[prev.length - 1]);
        for (let i = 1; i <= 10; i++) {
          const next = new Date(lastDate);
          next.setDate(next.getDate() + i);
          newDates.push(next);
        }
      } else {
        const firstDate = new Date(prev[0]);
        for (let i = 1; i <= 10; i++) {
          const prevDate = new Date(firstDate);
          prevDate.setDate(prevDate.getDate() - i);
          newDates.unshift(prevDate);
        }
      }
      return newDates;
    });
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const contentWidth = event.nativeEvent.contentSize.width;
    const layoutWidth = event.nativeEvent.layoutMeasurement.width;

    // Detect Right End (Ahead)
    if (offsetX + layoutWidth >= contentWidth - 20) {
      fetchMore("ahead");
    }
    // Detect Left End (Before)
    if (offsetX <= 20 && dates.length > 0) {
      fetchMore("before");
    }
  };
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const renderItem = ({ item }: { item: Date }) => {
    const active = isSameDay(item, selectedDate);
    const dayName = item.toLocaleDateString("en-US", { weekday: "short" });
    const dayNum = item.getDate();
    const month = item.toLocaleDateString("en-US", { month: "short" });

    return (
      <TouchableOpacity
        onPress={() => onDateSelect(item)}
        style={[styles.dateCard, active && styles.activeDateCard]}
      >
        {hasEvents(item) && <View style={styles.eventBadge} />}
        <Text style={[styles.dateDayName, active && styles.activeDateText]}>
          {dayName}
        </Text>
        <Text style={[styles.dateDay, active && styles.activeDateText]}>
          {dayNum}
        </Text>
        <Text style={[styles.dateMonth, active && styles.activeDateText]}>
          {month}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      ref={listRef}
      horizontal
      data={dates}
      renderItem={renderItem}
      keyExtractor={(item) => item.toISOString()}
      showsHorizontalScrollIndicator={false}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      contentContainerStyle={styles.calendarStrip}
      getItemLayout={(_, index) => ({
        length: 70, // card width (60) + margin (10)
        offset: 70 * index,
        index,
      })}
    />
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    calendarStrip: {
      paddingVertical: Spacing.sm,
    },
    dateCard: {
      width: 65,
      height: 90,
      backgroundColor: theme.surface,
      borderRadius: Radius.lg,
      justifyContent: "center",
      alignItems: "center",
      marginRight: Spacing.sm,
      borderWidth: 1,
      borderColor: theme.border,
      position: "relative",
    },
    activeDateCard: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    eventBadge: {
      position: "absolute",
      top: 8,
      right: 8,
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: theme.warning,
    },
    dateDayName: {
      fontSize: 10,
      textTransform: "uppercase",
      color: theme.textSecondary,
      marginBottom: 2,
    },
    dateDay: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.textMain,
    },
    dateMonth: {
      fontSize: 11,
      color: theme.textSecondary,
    },
    activeDateText: {
      color: theme.white,
    },
    todayCard: {
      backgroundColor: theme.primary + "80", // ~50% opacity
      borderColor: theme.primary,
    },

    todayText: {
      color: theme.primary,
    },
  });

export default ScrollingDay;
