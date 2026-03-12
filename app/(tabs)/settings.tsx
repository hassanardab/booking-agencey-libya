//app/(tabs)/settings.tsx
import { Colors, Radius, Shadows, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import * as Updates from "expo-updates"; // Needs: npx expo install expo-updates
import {
  Bell,
  Building2,
  CalendarDays,
  ChevronRight,
  Clock,
  DollarSign,
  Globe,
  Hash,
  Laptop,
  MessageSquareCode,
  Moon,
  Search,
  Type,
} from "lucide-react-native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  I18nManager,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SettingsPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [search, setSearch] = useState("");

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const styles = createStyles(theme);

  const { t, i18n } = useTranslation();

  const toggleLanguage = async () => {
    try {
      const isArabic = i18n.language === "ar";
      const nextLang = isArabic ? "en" : "ar";
      const shouldBeRTL = nextLang === "ar";

      // Update i18n locale (this changes translations immediately)
      await i18n.changeLanguage(nextLang);

      // Only reload if RTL setting actually changes
      if (I18nManager.isRTL !== shouldBeRTL) {
        I18nManager.allowRTL(shouldBeRTL);
        I18nManager.forceRTL(shouldBeRTL);

        // Small delay to allow state to settle
        setTimeout(async () => {
          try {
            // Check if reloadAsync is available and call it
            if (Updates.reloadAsync) {
              await Updates.reloadAsync();
            } else {
              // Fallback for environments where expo-updates is not available
              Alert.alert(
                "Language Changed",
                "Please restart the app to apply RTL layout changes.",
                [{ text: "OK" }],
              );
            }
          } catch (reloadError) {
            console.warn(
              "Reload failed, prompting manual restart",
              reloadError,
            );
            Alert.alert(
              "Restart Required",
              "Please close and reopen the app for the new layout to take effect.",
              [{ text: "OK" }],
            );
          }
        }, 200);
      }
    } catch (error) {
      console.error("Failed to switch language:", error);
      Alert.alert("Error", "Could not change language. Please try again.");
    }
  };

  // Reusable Setting Row Component
  const SettingRow = ({
    icon: Icon,
    label,
    value,
    onPress,
    isLast,
    type = "nav",
  }: any) => (
    <TouchableOpacity
      style={[styles.row, isLast && { borderBottomWidth: 0 }]}
      onPress={onPress}
      disabled={type === "switch"}
    >
      <View style={styles.rowLeft}>
        <View style={styles.iconSquare}>
          <Icon
            size={20}
            color={Colors[colorScheme ?? "light"].primary}
            strokeWidth={2}
          />
        </View>
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      <View style={styles.rowRight}>
        {type === "nav" && <Text style={styles.rowValue}>{value}</Text>}
        {type === "nav" && (
          <ChevronRight
            size={18}
            color={Colors[colorScheme ?? "light"].textSecondary}
          />
        )}
        {type === "switch" && (
          <Switch
            value={value}
            onValueChange={onPress}
            trackColor={{
              false: "#CBD5E1",
              true: Colors[colorScheme ?? "light"].primary,
            }}
          />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
      edges={["bottom"]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollBody}
      >
        {/* 1. Search */}
        <View style={styles.searchContainer}>
          <Search
            size={20}
            color={theme.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder={t("dashboard.search.hint")}
            placeholderTextColor={theme.textSecondary}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* 2. User Profile Section */}
        <View style={styles.profileCard}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
            }}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>@johndoe</Text>
            <Text style={styles.fullName}>John Harrison Doe</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>
                Senior Project Manager • Admin
              </Text>
            </View>
          </View>
        </View>

        {/* 3. App Settings */}
        <Text style={styles.sectionTitle}>
          {t("settings.section.app_settings")}
        </Text>
        <View style={styles.card}>
          <SettingRow
            icon={Globe}
            label={t("settings.section.language")} // Use translation key
            value={i18n.language === "en" ? "English" : "العربية"} // Show active lang
            onPress={toggleLanguage}
          />
          <SettingRow
            icon={Type}
            label={t("settings.font_size")}
            value="Default"
          />
          <SettingRow
            icon={Bell}
            label={t("settings.notifications")}
            type="switch"
            value={notifications}
            onPress={() => setNotifications(!notifications)}
          />
          <SettingRow
            icon={Moon}
            label={t("settings.dark_mode")}
            type="switch"
            value={isDarkMode}
            onPress={() => setIsDarkMode(!isDarkMode)}
            isLast
          />
        </View>

        {/* 4. Company Details Card (Branded) */}
        <Text style={styles.sectionTitle}>
          {t("settings.section.organization")}
        </Text>
        <View style={[styles.card, styles.companyCard]}>
          <View style={styles.companyHeader}>
            <View style={styles.logoContainer}>
              <Building2
                size={32}
                color={Colors[colorScheme ?? "light"].white}
              />
            </View>
            <View>
              <Text style={styles.companyName}>
                {t("settings.company.name")}
              </Text>
              <Text style={styles.companySlogan}>
                {t("settings.company.slogan")}
              </Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.companyDetailRow}>
            <Text style={styles.detailLabel}>
              {t("settings.company.business_model")}
            </Text>
            <Text style={styles.detailValue}>
              {t("settings.company.business_model_value")}
            </Text>
          </View>
          <View style={styles.companyDetailRow}>
            <Text style={styles.detailLabel}>
              {t("settings.company.registration")}
            </Text>
            <Text style={styles.detailValue}>
              {t("settings.company.registration_value")}
            </Text>
          </View>
        </View>

        {/* 5. Booking Settings */}
        <Text style={styles.sectionTitle}>{t("bookingLogic")}</Text>
        <View style={styles.card}>
          <SettingRow
            icon={DollarSign}
            label={t("settings.currency")}
            value="USD ($)"
          />
          <SettingRow
            icon={CalendarDays}
            label={t("settings.start_of_week")}
            value="Monday"
          />
          <SettingRow
            icon={Hash}
            label={t("settings.max_bookings_per_day")}
            value="12"
          />
          <SettingRow
            icon={Clock}
            label={t("settings.unpaid_reminder")}
            value="24 Hours Before"
            isLast
          />
        </View>

        {/* 6. Developer & Support */}
        <Text style={styles.sectionTitle}>{t("settings.section.support")}</Text>
        <View style={styles.card}>
          <SettingRow
            icon={Laptop}
            label={t("settings.developer_mode")}
            value="v2.4.0-pro"
          />
          <TouchableOpacity style={styles.botButton}>
            <MessageSquareCode
              size={20}
              color={Colors[colorScheme ?? "light"].white}
            />
            <Text style={styles.botButtonText}>
              {t("settings.contact_support_bot")}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footerVersion}>{t("settings.footer")}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

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
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },

    header: {
      paddingHorizontal: Spacing.lg,
      paddingTop: Spacing.sm,
      paddingBottom: Spacing.md,
      backgroundColor: theme.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },

    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.divider,
      marginBottom: Spacing.xl,
      borderRadius: Radius.md,
      paddingHorizontal: Spacing.md,
    },

    searchIcon: {
      marginRight: Spacing.sm,
    },

    searchInput: {
      height: 44,
      flex: 1,
      fontSize: 15,
      color: theme.textMain,
    },

    scrollBody: {
      padding: Spacing.lg,
    },

    /* Profile */

    profileCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.surface,
      padding: Spacing.lg,
      borderRadius: Radius.xl,
      marginBottom: Spacing.xl,
      borderWidth: 1,
      borderColor: theme.border,
      ...Shadows.card,
    },

    avatar: {
      width: 70,
      height: 70,
      borderRadius: 35,
      marginRight: Spacing.md,
    },

    profileInfo: {
      flex: 1,
      justifyContent: "center",
    },

    userName: {
      fontSize: 14,
      color: theme.primary,
      fontWeight: "700",
      textTransform: "uppercase",
    },

    fullName: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.textMain,
      marginVertical: 2,
    },

    roleBadge: {
      backgroundColor: theme.divider,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: Radius.sm,
      alignSelf: "flex-start",
    },

    roleText: {
      fontSize: 12,
      color: theme.textSecondary,
      fontWeight: "600",
    },

    sectionTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.textSecondary,
      textTransform: "uppercase",
      marginLeft: 5,
      marginBottom: Spacing.sm,
      letterSpacing: 1,
    },

    card: {
      backgroundColor: theme.surface,
      borderRadius: Radius.lg,
      paddingHorizontal: Spacing.lg,
      marginBottom: Spacing.xl,
      borderWidth: 1,
      borderColor: theme.border,
      ...Shadows.card,
    },

    /* Setting rows */

    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: Spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },

    rowLeft: {
      flexDirection: "row",
      alignItems: "center",
    },

    iconSquare: {
      width: 36,
      height: 36,
      backgroundColor: theme.divider,
      borderRadius: Radius.sm,
      justifyContent: "center",
      alignItems: "center",
      marginRight: Spacing.md,
    },

    rowLabel: {
      fontSize: 16,
      fontWeight: "500",
      color: theme.textMain,
    },

    rowRight: {
      flexDirection: "row",
      alignItems: "center",
    },

    rowValue: {
      fontSize: 14,
      color: theme.textSecondary,
      marginRight: Spacing.sm,
    },

    /* Company Card */

    companyCard: {
      padding: Spacing.lg,
      backgroundColor: theme.textMain,
      borderRadius: Radius.lg,
    },

    companyHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: Spacing.md,
    },

    logoContainer: {
      width: 50,
      height: 50,
      backgroundColor: theme.primary,
      borderRadius: Radius.md,
      justifyContent: "center",
      alignItems: "center",
      marginRight: Spacing.md,
    },

    companyName: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.primary,
    },

    companySlogan: {
      fontSize: 12,
      color: "#94A3B8",
    },

    divider: {
      height: 1,
      backgroundColor: "#334155",
      marginVertical: Spacing.md,
    },

    companyDetailRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: Spacing.sm,
    },

    detailLabel: {
      color: "#94A3B8",
      fontSize: 13,
    },

    detailValue: {
      color: theme.white,
      fontSize: 13,
      fontWeight: "600",
    },

    /* Bot button */

    botButton: {
      flexDirection: "row",
      backgroundColor: theme.primary,
      marginVertical: Spacing.lg,
      padding: Spacing.lg,
      borderRadius: Radius.md,
      justifyContent: "center",
      alignItems: "center",
    },

    botButtonText: {
      color: theme.white,
      fontWeight: "bold",
      marginLeft: Spacing.sm,
    },

    footerVersion: {
      textAlign: "center",
      color: theme.textSecondary,
      fontSize: 12,
      marginBottom: Spacing.xl,
    },
    safeArea: {
      flex: 1,
    },
  });

export default SettingsPage;
