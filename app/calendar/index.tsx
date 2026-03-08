import { Colors, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { StyleSheet, Text, View } from "react-native";

export default function CalendarPage() {
  const scheme = useColorScheme();
  const theme = Colors[scheme ?? "light"];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.textMain }]}>
        Calendar Page
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});