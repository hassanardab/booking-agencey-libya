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

const COLORS = {
  bg: "#F8FAFC",
  primary: "#6366F1",
  textMain: "#1E293B",
  textSub: "#64748B",
  white: "#FFFFFF",
  cardBorder: "#E2E8F0",
  accent: "#F1F5F9",
};

const SettingsPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
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
          <Icon size={20} color={COLORS.primary} strokeWidth={2} />
        </View>
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      <View style={styles.rowRight}>
        {type === "nav" && <Text style={styles.rowValue}>{value}</Text>}
        {type === "nav" && <ChevronRight size={18} color={COLORS.textSub} />}
        {type === "switch" && (
          <Switch
            value={value}
            onValueChange={onPress}
            trackColor={{ false: "#CBD5E1", true: COLORS.primary }}
          />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. Sticky Header & Search */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Search size={18} color={COLORS.textSub} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search settings..."
            placeholderTextColor={COLORS.textSub}
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollBody}
      >
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
        <Text style={styles.sectionTitle}>App Settings</Text>
        <View style={styles.card}>
          <SettingRow
            icon={Globe}
            label={t("language")} // Use translation key
            value={i18n.language === "en" ? "English" : "العربية"} // Show active lang
            onPress={toggleLanguage}
          />
          <SettingRow icon={Type} label="Font Size" value="Default" />
          <SettingRow
            icon={Bell}
            label="Notifications"
            type="switch"
            value={notifications}
            onPress={() => setNotifications(!notifications)}
          />
          <SettingRow
            icon={Moon}
            label="Dark Mode"
            type="switch"
            value={isDarkMode}
            onPress={() => setIsDarkMode(!isDarkMode)}
            isLast
          />
        </View>

        {/* 4. Company Details Card (Branded) */}
        <Text style={styles.sectionTitle}>Organization</Text>
        <View style={[styles.card, styles.companyCard]}>
          <View style={styles.companyHeader}>
            <View style={styles.logoContainer}>
              <Building2 size={32} color={COLORS.white} />
            </View>
            <View>
              <Text style={styles.companyName}>Nexus Creative Ltd.</Text>
              <Text style={styles.companySlogan}>
                Innovating the future of events
              </Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.companyDetailRow}>
            <Text style={styles.detailLabel}>Business Model</Text>
            <Text style={styles.detailValue}>B2B Enterprise</Text>
          </View>
          <View style={styles.companyDetailRow}>
            <Text style={styles.detailLabel}>Registration</Text>
            <Text style={styles.detailValue}>#9920-X12</Text>
          </View>
        </View>

        {/* 5. Booking Settings */}
        <Text style={styles.sectionTitle}>Booking Logic</Text>
        <View style={styles.card}>
          <SettingRow icon={DollarSign} label="Currency" value="USD ($)" />
          <SettingRow
            icon={CalendarDays}
            label="Start of Week"
            value="Monday"
          />
          <SettingRow icon={Hash} label="Max Bookings/Day" value="12" />
          <SettingRow
            icon={Clock}
            label="Unpaid Reminder"
            value="24 Hours Before"
            isLast
          />
        </View>

        {/* 6. Developer & Support */}
        <Text style={styles.sectionTitle}>Support</Text>
        <View style={styles.card}>
          <SettingRow icon={Laptop} label="Developer Mode" value="v2.4.0-pro" />
          <TouchableOpacity style={styles.botButton}>
            <MessageSquareCode size={20} color={COLORS.white} />
            <Text style={styles.botButtonText}>Contact Support Bot</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footerVersion}>
          Built with ❤️ by DevTeam • 2026
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: COLORS.white,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { height: 44, flex: 1, fontSize: 15, color: COLORS.textMain },

  scrollBody: { padding: 20 },

  // Profile
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 24,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  avatar: { width: 70, height: 70, borderRadius: 35, marginRight: 15 },
  userName: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  fullName: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.textMain,
    marginVertical: 2,
  },
  roleBadge: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  roleText: { fontSize: 12, color: COLORS.textSub, fontWeight: "600" },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textSub,
    textTransform: "uppercase",
    marginLeft: 5,
    marginBottom: 10,
    letterSpacing: 1,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingHorizontal: 16,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },

  // Setting Rows
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
  },
  rowLeft: { flexDirection: "row", alignItems: "center" },
  iconSquare: {
    width: 36,
    height: 36,
    backgroundColor: "#EEF2FF",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  rowLabel: { fontSize: 16, fontWeight: "500", color: COLORS.textMain },
  rowRight: { flexDirection: "row", alignItems: "center" },
  rowValue: { fontSize: 14, color: COLORS.textSub, marginRight: 8 },

  // Company Card
  companyCard: { padding: 20, backgroundColor: COLORS.textMain }, // Dark theme card
  companyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  logoContainer: {
    width: 50,
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  companyName: { fontSize: 18, fontWeight: "bold", color: COLORS.white },
  companySlogan: { fontSize: 12, color: "#94A3B8" },
  divider: { height: 1, backgroundColor: "#334155", marginVertical: 15 },
  companyDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  detailLabel: { color: "#94A3B8", fontSize: 13 },
  detailValue: { color: COLORS.white, fontSize: 13, fontWeight: "600" },

  // Bot Button
  botButton: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    marginVertical: 16,
    padding: 16,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  profileInfo: {
    flex: 1, // This allows the text to take up the rest of the card space
    justifyContent: "center",
  },
  botButtonText: { color: COLORS.white, fontWeight: "bold", marginLeft: 10 },
  footerVersion: {
    textAlign: "center",
    color: COLORS.textSub,
    fontSize: 12,
    marginBottom: 30,
  },
});

export default SettingsPage;
