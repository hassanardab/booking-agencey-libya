import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol, IconSymbolName } from "@/components/ui/icon-symbol";

import { Colors, Fonts, Radius, Shadows, Spacing } from "@/constants/theme";

import { StyleSheet, View, useColorScheme } from "react-native";

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
    iconColor: "#3B82F6",
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
    iconColor: "#10B981",
  },
  {
    id: "3",
    userName: "عويشة",
    action: "left a comment on",
    target: "Q3 Financial Report",
    day: "Sunday",
    date: "Oct 27, 2024",
    time: "11:45 AM",
    iconName: "text.bubble.fill" as IconSymbolName,
    iconColor: "#F59E0B",
  },
  {
    id: "4",
    userName: "ريم",
    action: "ran automated backup",
    target: "Database Server",
    day: "Saturday",
    date: "Oct 26, 2024",
    time: "03:00 AM",
    iconName: "gearshape.fill" as IconSymbolName,
    iconColor: "#64748B",
  },
];

export default function ActivitesScreen() {
  const scheme = useColorScheme();
  const theme = Colors[scheme ?? "light"];

  const styles = createStyles(theme);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{
        light: theme.background,
        dark: theme.background,
      }}
      headerImage={
        <IconSymbol
          size={240}
          color={theme.textMain}
          name="clock.fill"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={{ fontFamily: Fonts?.rounded }}>
          Activity Timeline
        </ThemedText>
      </ThemedView>

      <View style={styles.timelineContainer}>
        {ACTIVITY_DATA.map((item, index) => {
          const isLast = index === ACTIVITY_DATA.length - 1;

          return (
            <View key={item.id} style={styles.timelineRow}>
              <View style={styles.timelineLeftCol}>
                {!isLast && <View style={styles.timelineLine} />}

                <View
                  style={[
                    styles.timelineNode,
                    { backgroundColor: item.iconColor },
                  ]}
                >
                  <IconSymbol size={16} name={item.iconName} color="#fff" />
                </View>
              </View>

              <ThemedView style={styles.contentCard}>
                <View style={styles.cardHeader}>
                  <ThemedText style={styles.timeText}>{item.time}</ThemedText>

                  <ThemedText style={styles.dateText}>
                    {item.day}, {item.date}
                  </ThemedText>
                </View>

                <ThemedText style={styles.actionText}>
                  <ThemedText type="defaultSemiBold">
                    {item.userName}
                  </ThemedText>
                  {item.action}
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
    headerImage: {
      bottom: -60,
      left: -20,
      position: "absolute",
      opacity: 0.25,
    },

    titleContainer: {
      flexDirection: "row",
      marginBottom: Spacing.lg,
    },

    timelineContainer: {
      marginTop: Spacing.sm,
      paddingHorizontal: Spacing.sm,
    },

    timelineRow: {
      flexDirection: "row",
      minHeight: 100,
    },

    timelineLeftCol: {
      width: 40,
      alignItems: "center",
    },

    timelineLine: {
      position: "absolute",
      top: 35,
      bottom: -15,
      width: 2,
      backgroundColor: theme.timelineLine,
      zIndex: -1,
    },

    timelineNode: {
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 4,
    },

    contentCard: {
      flex: 1,
      marginLeft: Spacing.md,
      marginBottom: Spacing.xl,
      padding: Spacing.lg,
      borderRadius: Radius.md,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
      ...Shadows.card,
    },

    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: Spacing.sm,
      alignItems: "center",
    },

    timeText: {
      fontSize: 12,
      fontWeight: "600",
      opacity: 0.7,
      color: theme.textSecondary,
    },

    dateText: {
      fontSize: 12,
      opacity: 0.6,
      color: theme.textSecondary,
    },

    actionText: {
      fontSize: 15,
      lineHeight: 22,
      color: theme.textMain,
    },
  });
