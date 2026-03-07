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
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const COLORS = {
  bg: "#F8FAFC",
  primary: "#6366F1", // Modern Indigo
  success: "#10B981",
  danger: "#EF4444",
  warning: "#F59E0B",
  textMain: "#1E293B",
  textSub: "#64748B",
  white: "#FFFFFF",
  cardBorder: "#E2E8F0",
};

const Dashboard = () => {
  const [activeFilter, setActiveFilter] = useState("Today");
  const [search, setSearch] = useState("");

  // Mock Data
  const stats = [
    {
      id: 1,
      label: "Cash Revenue",
      value: "$4,250",
      icon: <Wallet size={20} color={COLORS.success} />,
      bg: "#ECFDF5",
    },
    {
      id: 2,
      label: "Bank Revenue",
      value: "$12,800",
      icon: <Banknote size={20} color={COLORS.primary} />,
      bg: "#EEF2FF",
    },
    {
      id: 3,
      label: "Unpaid",
      value: "$1,120",
      icon: <AlertCircle size={20} color={COLORS.danger} />,
      bg: "#FEF2F2",
    },
    {
      id: 4,
      label: "Events Today",
      value: "8",
      icon: <CalendarIcon size={20} color={COLORS.warning} />,
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
        {/* 1. Modern Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={20} color={COLORS.textSub} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search events, clients..."
            placeholderTextColor={COLORS.textSub}
            value={search}
            onChangeText={setSearch}
          />
          <TouchableOpacity style={styles.filterBtn}>
            <Filter size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* 2. Date Range Selector (Pills) */}
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

        {/* 3. Stats Cards Grid */}
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

        {/* 4. Calendar Strip (Quick View) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Schedule</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>View Calendar</Text>
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

        {/* 5. Active Event List */}
        <Text style={styles.sectionTitle}>Upcoming Events</Text>
        {events.map((event) => (
          <TouchableOpacity key={event.id} style={styles.eventCard}>
            <View style={styles.eventInfo}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <View style={styles.eventMeta}>
                <Clock size={14} color={COLORS.textSub} />
                <Text style={styles.eventTime}>
                  {event.time} • {event.status}
                </Text>
              </View>
            </View>
            <View style={styles.eventRight}>
              <Text style={styles.eventPrice}>{event.price}</Text>
              <ChevronRight size={18} color={COLORS.textSub} />
            </View>
          </TouchableOpacity>
        ))}

        {/* 6. Postponed Events */}
        <View style={styles.postponedHeader}>
          <Text style={styles.sectionTitle}>Postponed</Text>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scrollContent: { padding: 20 },

  // Search
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  searchIcon: { position: "absolute", left: 12, zIndex: 1 },
  searchInput: {
    flex: 1,
    backgroundColor: COLORS.white,
    height: 48,
    borderRadius: 12,
    paddingLeft: 44,
    paddingRight: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  filterBtn: {
    backgroundColor: COLORS.primary,
    width: 48,
    height: 48,
    borderRadius: 12,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  // Filters
  filterWrapper: { flexDirection: "row", marginBottom: 25 },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  activePill: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterText: { color: COLORS.textSub, fontWeight: "600" },
  activeFilterText: { color: COLORS.white },

  // Stats Grid
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  statCard: {
    width: "48%",
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statLabel: { color: COLORS.textSub, fontSize: 13, marginBottom: 4 },
  statValue: { fontSize: 20, fontWeight: "bold", color: COLORS.textMain },

  // Calendar Strip
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textMain,
    marginBottom: 15,
  },
  viewAll: { color: COLORS.primary, fontWeight: "600" },
  calendarStrip: { marginBottom: 25 },
  dateCard: {
    width: 60,
    height: 80,
    backgroundColor: COLORS.white,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  activeDateCard: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  dateDay: { fontSize: 18, fontWeight: "bold", color: COLORS.textMain },
  dateMonth: { fontSize: 12, color: COLORS.textSub },
  activeDateText: { color: COLORS.white },

  // Event Cards
  eventCard: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textMain,
    marginBottom: 4,
  },
  eventMeta: { flexDirection: "row", alignItems: "center" },
  eventTime: { fontSize: 13, color: COLORS.textSub, marginLeft: 6 },
  eventRight: {
    alignItems: "flex-end",
    flexDirection: "row",
  },
  eventPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textMain,
    marginRight: 8,
  },

  // Postponed
  postponedHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  badge: {
    backgroundColor: COLORS.danger,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
    marginBottom: 12,
  },
  badgeText: { color: COLORS.white, fontSize: 12, fontWeight: "bold" },
  postponedCard: {
    backgroundColor: "#F1F5F9",
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: COLORS.textSub,
  },
  postponedTitle: { fontSize: 15, fontWeight: "600", color: COLORS.textSub },
  postponedReason: { fontSize: 12, color: COLORS.textSub, marginTop: 2 },
  rescheduleBtn: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  // Add this specific block
  eventInfo: {
    flex: 1,
    justifyContent: "center",
  },

  rescheduleText: { fontSize: 12, fontWeight: "600", color: COLORS.primary },
});

export default Dashboard;
