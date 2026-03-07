import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol, IconSymbolName } from "@/components/ui/icon-symbol";
import { Fonts } from "@/constants/theme";
import { StyleSheet, View } from "react-native";

// --- 1. Dummy Data for the Timeline ---
// In a real app, you would fetch this from your database/API
const ACTIVITY_DATA = [
  {
    id: "1",
    userName: "Ahmed",
    action: "created a new project",
    target: "Mobile App Redesign",
    day: "Monday",
    date: "Oct 28, 2024",
    time: "10:30 AM",
    iconName: "doc.text.fill" as IconSymbolName,
    iconColor: "#3498db", // Blue
  },
  {
    id: "2",
    userName: "Sara",
    action: "completed task",
    target: "Update User Schema",
    day: "Monday",
    date: "Oct 28, 2024",
    time: "02:15 PM",
    iconName: "checkmark.circle.fill" as IconSymbolName,
    iconColor: "#2ecc71", // Green
  },
  {
    id: "3",
    userName: "Omar",
    action: "left a comment on",
    target: "Q3 Financial Report",
    day: "Sunday",
    date: "Oct 27, 2024",
    time: "11:45 AM",
    iconName: "text.bubble.fill" as IconSymbolName,
    iconColor: "#f39c12", // Orange
  },
  {
    id: "4",
    userName: "System",
    action: "ran automated backup",
    target: "Database Server",
    day: "Saturday",
    date: "Oct 26, 2024",
    time: "03:00 AM",
    iconName: "gearshape.fill" as IconSymbolName,
    iconColor: "#95a5a6", // Gray
  },
];

export default function ActivitesScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#E3F2FD", dark: "#102A43" }}
      headerImage={
        <IconSymbol
          size={250}
          color="#808080"
          name="clock.fill" // A clock fits the timeline theme perfectly
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={{ fontFamily: Fonts?.rounded }}>
          Activity Timeline
        </ThemedText>
      </ThemedView>

      {/* --- 2. The Timeline List --- */}
      <View style={styles.timelineContainer}>
        {ACTIVITY_DATA.map((item, index) => {
          const isLast = index === ACTIVITY_DATA.length - 1;

          return (
            <View key={item.id} style={styles.timelineRow}>
              {/* Left Column: Line & Icon */}
              <View style={styles.timelineLeftCol}>
                {/* The vertical line (hidden on the last item) */}
                {!isLast && <View style={styles.timelineLine} />}
                {/* The node icon */}
                <View
                  style={[
                    styles.timelineNode,
                    { backgroundColor: item.iconColor },
                  ]}
                >
                  <IconSymbol size={16} name={item.iconName} color="#fff" />
                </View>
              </View>

              {/* Right Column: Content Card */}
              <ThemedView style={styles.contentCard}>
                {/* Header: Date and Time */}
                <View style={styles.cardHeader}>
                  <ThemedText style={styles.timeText}>{item.time}</ThemedText>
                  <ThemedText style={styles.dateText}>
                    {item.day}, {item.date}
                  </ThemedText>
                </View>

                {/* Body: Who did what */}
                <ThemedText style={styles.actionText}>
                  <ThemedText type="defaultSemiBold">
                    {item.userName}{" "}
                  </ThemedText>
                  {item.action}{" "}
                  <ThemedText
                    type="defaultSemiBold"
                    style={{ color: item.iconColor }}
                  >
                    {item.target}
                  </ThemedText>
                </ThemedText>
              </ThemedView>
            </View>
          );
        })}
      </View>
    </ParallaxScrollView>
  );
}

// --- 3. Styles for the Timeline ---
const styles = StyleSheet.create({
  headerImage: {
    color: "#60A5FA", // A nice soft blue
    bottom: -60,
    left: -20,
    position: "absolute",
    opacity: 0.5,
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  timelineContainer: {
    marginTop: 10,
    paddingHorizontal: 8,
  },
  timelineRow: {
    flexDirection: "row",
    minHeight: 100, // Gives enough space for the vertical line to stretch
  },
  timelineLeftCol: {
    width: 40,
    alignItems: "center",
  },
  timelineLine: {
    position: "absolute",
    top: 35, // Start line below the icon
    bottom: -15, // Extend line into the next item
    width: 2,
    backgroundColor: "#E5E7EB", // Light gray line
    zIndex: -1,
  },
  timelineNode: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4, // Align with the top of the content card
  },
  contentCard: {
    flex: 1,
    marginLeft: 12,
    marginBottom: 24, // Space between cards
    padding: 16,
    borderRadius: 12,
    // Soft shadow for depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2, // Android shadow
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    alignItems: "center",
  },
  timeText: {
    fontSize: 12,
    fontWeight: "bold",
    opacity: 0.7,
  },
  dateText: {
    fontSize: 12,
    opacity: 0.5,
  },
  actionText: {
    fontSize: 15,
    lineHeight: 22,
  },
});
