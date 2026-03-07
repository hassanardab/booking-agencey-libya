import { Image } from "expo-image";
import { useState } from "react";
import { StyleSheet, Switch } from "react-native";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol, IconSymbolName } from "@/components/ui/icon-symbol";
import { Fonts } from "@/constants/theme";

// --- Helper component for a settings row with icon, label, and value/input ---
function SettingRow({
  icon,
  label,
  value,
  onPress,
  type = "text", // "text", "toggle", "link"
  toggleValue,
  onToggle,
}: {
  icon: IconSymbolName;
  label: string;
  value?: string;
  onPress?: () => void;
  type?: "text" | "toggle" | "link";
  toggleValue?: boolean;
  onToggle?: (val: boolean) => void;
}) {
  return (
    <ThemedView style={styles.settingRow}>
      <IconSymbol name={icon} size={22} color="#666" style={styles.rowIcon} />
      <ThemedText style={styles.rowLabel}>{label}</ThemedText>
      {type === "toggle" ? (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{ false: "#ddd", true: "#34C759" }}
          ios_backgroundColor="#ddd"
        />
      ) : (
        <ThemedText style={styles.rowValue} onPress={onPress}>
          {value || "Not set"}
        </ThemedText>
      )}
    </ThemedView>
  );
}

// --- Section header component ---
function SectionHeader({ title }: { title: string }) {
  return (
    <ThemedView style={styles.sectionHeader}>
      <ThemedText style={styles.sectionHeaderText}>{title}</ThemedText>
    </ThemedView>
  );
}

export default function SettingsScreen() {
  // Example state for toggles (replace with your actual state management)
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [autoAcceptBookings, setAutoAcceptBookings] = useState(true);
  const [remindersEnabled, setRemindersEnabled] = useState(true);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="gearshape.fill" // more appropriate icon for settings
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={{ fontFamily: Fonts.rounded }}>
          Settings
        </ThemedText>
      </ThemedView>

      {/* Wrap content in a ScrollView (ParallaxScrollView already includes a ScrollView, but we add another to be safe) */}
      <ThemedView style={styles.content}>
        {/* 1. Company Details */}
        <SectionHeader title="Company Details" />
        <ThemedView style={styles.card}>
          {/* Logo row */}
          <ThemedView style={styles.logoRow}>
            <Image
              source={require("@/assets/images/icon.png")} // replace with your logo
              style={styles.logo}
              contentFit="cover"
            />
            <ThemedView style={styles.logoPlaceholder}>
              <ThemedText style={styles.changeLogoText}>Change Logo</ThemedText>
            </ThemedView>
          </ThemedView>
          <SettingRow icon="building.2" label="Name" value="Acme Inc." />
          <SettingRow
            icon="quote.bubble"
            label="Slogan"
            value="Innovate Today"
          />
          <SettingRow
            icon="briefcase"
            label="Business Model"
            value="B2B SaaS"
          />
        </ThemedView>

        {/* 2. Social Media */}
        <SectionHeader title="Social Media" />
        <ThemedView style={styles.card}>
          <SettingRow icon="f.cursive" label="Facebook" value="@acmeofficial" />
          <SettingRow icon="camera" label="Instagram" value="@acme_life" />
          <SettingRow icon="bird" label="X (Twitter)" value="@acme" />
          <SettingRow
            icon="doc.text.fill"
            label="LinkedIn"
            value="company/acme"
          />
          <SettingRow icon="play.rectangle" label="YouTube" value="@acmetv" />
          <SettingRow icon="globe" label="Website" value="www.acme.com" />
          <SettingRow icon="message" label="WhatsApp" value="+1 234 567 890" />
          <SettingRow icon="phone" label="Phone" value="+1 800 123 4567" />
        </ThemedView>

        {/* 3. Team Members */}
        <SectionHeader title="Team Members" />
        <ThemedView style={styles.card}>
          {/* Example team member rows */}
          <ThemedView style={styles.teamRow}>
            <ThemedView style={styles.teamAvatar}>
              <ThemedText style={styles.avatarText}>JD</ThemedText>
            </ThemedView>
            <ThemedView style={styles.teamInfo}>
              <ThemedText style={styles.teamName}>John Doe</ThemedText>
              <ThemedText style={styles.teamRole}>Admin</ThemedText>
            </ThemedView>
            <IconSymbol name="chevron.right" size={18} color="#999" />
          </ThemedView>
          <ThemedView style={styles.teamRow}>
            <ThemedView style={styles.teamAvatar}>
              <ThemedText style={styles.avatarText}>JS</ThemedText>
            </ThemedView>
            <ThemedView style={styles.teamInfo}>
              <ThemedText style={styles.teamName}>Jane Smith</ThemedText>
              <ThemedText style={styles.teamRole}>Editor</ThemedText>
            </ThemedView>
            <IconSymbol name="chevron.right" size={18} color="#999" />
          </ThemedView>
          <ThemedView style={styles.addTeamButton}>
            <IconSymbol name="plus.circle" size={20} color="#007AFF" />
            <ThemedText style={styles.addTeamText}>Add Team Member</ThemedText>
          </ThemedView>
        </ThemedView>

        {/* 4. Notifications */}
        <SectionHeader title="Notifications" />
        <ThemedView style={styles.card}>
          <SettingRow
            icon="envelope"
            label="Email Notifications"
            type="toggle"
            toggleValue={emailNotifications}
            onToggle={setEmailNotifications}
          />
          <SettingRow
            icon="bell"
            label="Push Notifications"
            type="toggle"
            toggleValue={pushNotifications}
            onToggle={setPushNotifications}
          />
          <SettingRow
            icon="message"
            label="SMS Notifications"
            type="toggle"
            toggleValue={smsNotifications}
            onToggle={setSmsNotifications}
          />
        </ThemedView>

        {/* 5. Developer Support */}
        <SectionHeader title="Developer Support" />
        <ThemedView style={styles.card}>
          <SettingRow
            icon="wrench.and.screwdriver"
            label="API Documentation"
            value="docs.acme.com"
            type="link"
          />
          <SettingRow
            icon="ant"
            label="Report a Bug"
            value="Open issue"
            type="link"
          />
          <SettingRow
            icon="envelope"
            label="Contact Support"
            value="support@acme.com"
            type="link"
          />
        </ThemedView>

        {/* 6. Booking Settings */}
        <SectionHeader title="Booking Settings" />
        <ThemedView style={styles.card}>
          <SettingRow
            icon="checkmark.circle"
            label="Auto-accept bookings"
            type="toggle"
            toggleValue={autoAcceptBookings}
            onToggle={setAutoAcceptBookings}
          />
          <SettingRow
            icon="clock"
            label="Send reminders"
            type="toggle"
            toggleValue={remindersEnabled}
            onToggle={setRemindersEnabled}
          />
          <SettingRow
            icon="calendar"
            label="Default duration"
            value="60 minutes"
          />
          <SettingRow
            icon="person.2"
            label="Max guests per booking"
            value="4"
          />
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  content: {
    paddingBottom: 30,
  },
  sectionHeader: {
    paddingVertical: 8,
    paddingHorizontal: 0,
    marginTop: 16,
    backgroundColor: "transparent",
  },
  sectionHeaderText: {
    fontSize: 16,
    fontFamily: Fonts.rounded,
    fontWeight: "600",
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  card: {
    borderRadius: 12,
    backgroundColor: "rgba(150,150,150,0.05)", // subtle background for card
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(150,150,150,0.1)",
  },
  rowIcon: {
    marginRight: 12,
    width: 24,
    textAlign: "center",
  },
  rowLabel: {
    flex: 1,
    fontSize: 16,
  },
  rowValue: {
    fontSize: 16,
    color: "#007AFF",
    maxWidth: "60%",
    textAlign: "right",
  },
  // Logo row
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(150,150,150,0.1)",
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  logoPlaceholder: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#007AFF",
    borderRadius: 6,
  },
  changeLogoText: {
    color: "white",
    fontWeight: "500",
    fontSize: 14,
  },
  // Team member rows
  teamRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(150,150,150,0.1)",
  },
  teamAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: 16,
    fontWeight: "500",
  },
  teamRole: {
    fontSize: 14,
    color: "#888",
    marginTop: 2,
  },
  addTeamButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 8,
  },
  addTeamText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "500",
  },
});
