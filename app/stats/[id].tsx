//app/stats/[id].tsx
import { Colors, Radius, Shadows, Spacing } from "@/constants/theme";
import { ACCOUNTS } from "@/data/mcokAccounts";
import { MOCK_JOURNAL_ENTRIES } from "@/data/mockJournalEntries";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { getEventsByIds } from "@/services/eventService";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function StatsPage() {
  const { id, eventIds } = useLocalSearchParams();
  const scheme = useColorScheme();
  const theme = Colors[scheme ?? "light"];

  // Safely parse the incoming JSON array of IDs
  let parsedIds: string[] = [];
  try {
    if (typeof eventIds === "string") {
      parsedIds = JSON.parse(eventIds);
    }
  } catch (error) {
    console.error("Failed to parse eventIds", error);
  }

  // Fetch the actual events
  const displayEvents = getEventsByIds(parsedIds);

  const titles: Record<string, string> = {
    cash: "Cash Payments",
    bank: "Bank Payments",
    unpaid: "Unpaid Events",
    events: "Events",
  };

  const pageTitle = titles[id as string] ?? "Stats";

  // Helper to choose an icon based on the current stat category
  const getIconName = () => {
    if (id === "cash") return "cash-outline";
    if (id === "bank") return "business-outline";
    if (id === "unpaid") return "alert-circle-outline";
    return "calendar-outline";
  };
  const getEventAmountForStat = (eventId: string) => {
    const relatedEntries = MOCK_JOURNAL_ENTRIES.filter(
      (entry) => entry.referenceId === eventId,
    );

    let total = 0;

    relatedEntries.forEach((entry) => {
      entry.transactions.forEach((tx) => {
        if (id === "cash" && tx.accountId === ACCOUNTS.CASH.id) {
          total += tx.amount;
        }

        if (id === "bank" && tx.accountId === ACCOUNTS.BANK.id) {
          total += tx.amount;
        }

        if (id === "unpaid" && tx.accountId === ACCOUNTS.AR.id) {
          total += tx.amount;
        }
      });
    });

    return total;
  };
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

      <View style={styles.headerContainer}>
        <Text style={[styles.header, { color: theme.textMain }]}>
          {pageTitle}
        </Text>
        <Text style={[styles.subHeader, { color: theme.textSecondary }]}>
          Showing {displayEvents.length} filtered{" "}
          {displayEvents.length === 1 ? "event" : "events"}
        </Text>
      </View>

      <FlatList
        data={displayEvents}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: Spacing.xl }}>
            <Text style={{ color: theme.textSecondary }}>
              No events found for this filter.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
                ...Shadows.card,
              },
            ]}
            activeOpacity={0.7}
            onPress={() =>
              router.push({
                pathname: "/events/[id]",
                params: {
                  id: item.id,
                },
              })
            }
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: theme.background },
              ]}
            >
              <Ionicons
                name={getIconName()}
                size={24}
                color={id === "unpaid" ? theme.danger : theme.primary}
              />
            </View>

            <View style={styles.cardContent}>
              <Text
                style={[styles.cardTitle, { color: theme.textMain }]}
                numberOfLines={1}
              >
                {item.title}
              </Text>
              <View style={styles.timeContainer}>
                <Ionicons name="time-outline" size={14} color={theme.icon} />
                <Text style={[styles.cardTime, { color: theme.textSecondary }]}>
                  {/* Format the raw Date object correctly */}
                  {new Date(item.startDate).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
            </View>

            <View style={styles.rightContent}>
              {id !== "events" && (
                <Text style={[styles.priceText, { color: theme.textMain }]}>
                  ${getEventAmountForStat(item.id).toLocaleString()}
                </Text>
              )}
              <Text
                style={[
                  styles.typeText,
                  {
                    color:
                      item.status === "confirmed"
                        ? theme.success
                        : theme.textSecondary,
                  },
                ]}
              >
                {item.status.replace("_", " ").toUpperCase()}
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.icon}
              style={styles.chevron}
            />
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
    paddingBottom: Spacing.xxl,
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
    fontSize: 10,
    marginTop: 4,
    fontWeight: "700",
  },
  chevron: {
    marginLeft: Spacing.xs,
  },
});
