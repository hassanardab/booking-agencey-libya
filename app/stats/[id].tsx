import { Colors, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { router, Stack, useLocalSearchParams } from "expo-router";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
  const { id } = useLocalSearchParams(); // This 'id' is your category (e.g., 'cash')
  const scheme = useColorScheme();
  const theme = Colors[scheme ?? "light"];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* 2. Use Stack.Screen to control the header */}
      <Stack.Screen
        options={{
          headerTitle: "", // Hides the text "stats/[id]"
          headerShadowVisible: false, // Optional: makes header blend into background
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.textMain, // Sets back button color
        }}
      />
      <Text style={[styles.header, { color: theme.textMain }]}>
        Category: {id?.toString().toUpperCase()}
      </Text>

      <FlatList
        data={MOCK_EVENTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
            // Navigate to event details
            onPress={() =>
              router.push({
                // Use the literal string of the filename, not a template literal
                pathname: "/events/[id]",
                params: {
                  id: item.id, // Expo Router maps this to the [id] in the path
                  title: item.title,
                  price: item.price,
                  type: item.type,
                  time: item.time,
                },
              })
            }
          >
            <View>
              <Text style={{ color: theme.textMain, fontWeight: "600" }}>
                {item.title}
              </Text>
              <Text style={{ color: theme.textSecondary }}>{item.price}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: Spacing.lg },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  card: {
    padding: Spacing.lg,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
