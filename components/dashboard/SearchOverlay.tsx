import { Colors, Radius, Shadows, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { BookingEvent } from "@/types/events";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Define the shape of your search result

interface SearchOverlayProps {
  results: BookingEvent[];
}

export default function SearchOverlay({ results }: SearchOverlayProps) {
  const scheme = useColorScheme();
  const theme = Colors[scheme ?? "light"];
  const styles = createStyles(theme);

  if (!results.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.empty}>No results found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {results.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.result}
          // Navigate to the event details
          onPress={() =>
            router.push({
              pathname: "/events/[id]",
              params: { id: item.id },
            })
          }
        >
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.meta}>{item.customerName}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// Helper to avoid repeating the theme object type manually
type ThemeType = typeof Colors.light & typeof Colors.dark;

const createStyles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      position: "absolute",
      top: 70,
      left: 16,
      right: 16,
      backgroundColor: theme.surface,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: theme.border,
      zIndex: 100,
      ...Shadows.card,
    },
    result: {
      padding: Spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    title: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.textMain,
    },
    meta: {
      fontSize: 13,
      color: theme.textSecondary,
    },
    empty: {
      padding: Spacing.lg,
      textAlign: "center",
      color: theme.textSecondary,
    },
  });
