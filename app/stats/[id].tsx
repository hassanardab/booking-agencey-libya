//app/stats/[id].tsx
import { Colors, Spacing, Radius, Shadows } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { router, Stack, useLocalSearchParams } from "expo-router";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; 

const MOCK_EVENTS = [
  {
    id: "1",
    title: "Corporate Gala",
    price: "$2400",
    type: "cash",
    time: "14:00",
  },
  {
    id: "2",
    title: "Wedding Photography",
    price: "$1200",
    type: "card",
    time: "17:30",
  },
];

export default function StatsPage() {
  const { id } = useLocalSearchParams(); 
  const scheme = useColorScheme();
  const theme = Colors[scheme ?? "light"];

  // Format the ID nicely (e.g., "cash" -> "Cash Stats")
  const pageTitle = id 
    ? `${id.toString().charAt(0).toUpperCase()}${id.toString().slice(1)} Stats` 
    : "Stats";

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen
        options={{
          headerTitle: "",
          headerShadowVisible: false, 
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.textMain, 
        }}
      />
      
      {/* Improved Page Header */}
      <View style={styles.headerContainer}>
        <Text style={[styles.header, { color: theme.textMain }]}>
          {pageTitle}
        </Text>
        <Text style={[styles.subHeader, { color: theme.textSecondary }]}>
          Review your recent activity
        </Text>
      </View>

      <FlatList
        data={MOCK_EVENTS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              { 
                backgroundColor: theme.surface, 
                borderColor: theme.border,
                ...Shadows.card // Pulled from your theme file
              },
            ]}
            activeOpacity={0.7} // Better touch feedback
            onPress={() =>
              router.push({
                pathname: "/events/[id]",
                params: {
                  id: item.id,
                },
              })
            }
          >
            {/* Left Icon Indicator */}
            <View style={[styles.iconContainer, { backgroundColor: theme.background }]}>
              <Ionicons 
                name={item.type === 'cash' ? 'cash-outline' : 'card-outline'} 
                size={24} 
                color={theme.primary} 
              />
            </View>

            {/* Main Center Content */}
            <View style={styles.cardContent}>
              <Text style={[styles.cardTitle, { color: theme.textMain }]} numberOfLines={1}>
                {item.title}
              </Text>
              <View style={styles.timeContainer}>
                <Ionicons name="time-outline" size={14} color={theme.icon} />
                <Text style={[styles.cardTime, { color: theme.textSecondary }]}>
                  {item.time}
                </Text>
              </View>
            </View>

            {/* Right Side Info (Price & Type) */}
            <View style={styles.rightContent}>
              <Text style={[styles.priceText, { color: theme.textMain }]}>
                {item.price}
              </Text>
              <Text style={[styles.typeText, { color: theme.textSecondary }]}>
                {item.type.toUpperCase()}
              </Text>
            </View>

            {/* Chevron Affordance */}
            <Ionicons name="chevron-forward" size={20} color={theme.icon} style={styles.chevron} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
  },
  headerContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  header: { 
    fontSize: 28, 
    fontWeight: "800", 
    letterSpacing: -0.5,
  },
  subHeader: {
    fontSize: 16,
    marginTop: Spacing.xs,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl, // Extra padding at bottom for safe scrolling
  },
  card: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: Radius.sm,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cardTime: {
    fontSize: 14,
  },
  rightContent: {
    alignItems: "flex-end",
    marginRight: Spacing.sm,
  },
  priceText: {
    fontSize: 16,
    fontWeight: "700",
  },
  typeText: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: "500",
  },
  chevron: {
    marginLeft: Spacing.xs,
  }
});