//app/events/[id].tsx
import PaymentForm from "@/components/PaymentForm";
import { Colors, Spacing } from "@/constants/theme";
import { ACCOUNTS } from "@/data/mcokAccounts";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  addJournalEntry,
  deleteJournalEntry,
  getAllJournalsForEvent,
} from "@/services/accountingService";
import { generateAgreementPdf } from "@/services/agreement/pdfAgreementService";
import { changeToPostponedEvent, getEventById } from "@/services/eventService";
import { generateReceiptPdf } from "@/services/pdf/pdfReceiptService";
import { JournalEntry } from "@/types/accounting";
import { BookingEvent } from "@/types/events";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function EventDetails() {
  const scheme = useColorScheme();
  const theme = Colors[scheme ?? "light"];
  const styles = createStyles(theme);
  const [loading, setLoading] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [newPaymentMethod, setNewPaymentMethod] = useState<
    "cash" | "card" | "transfer"
  >("cash");
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<JournalEntry | null>(
    null,
  );

  const { t } = useTranslation();

  const { id } = useLocalSearchParams<{ id: string }>();
  if (!id) return null;
  const event = getEventById(id);

  const payments = getAllJournalsForEvent(event?.id as string);
  if (!event)
    return (
      <View style={styles.container}>
        <Text>{t("event.details.not_found")}</Text>
      </View>
    );

  const openWhatsApp = () => {
    setLoading(true);

    const phone = event.customerPhone || event.customerPhones?.[0] || "";
    const msg = t("event.details.whatsapp.msg", {
      name: event.customerName,
      date: new Date(event.startDate).toLocaleDateString(),
    });
    Linking.openURL(
      `whatsapp://send?phone=${phone}&text=${encodeURIComponent(msg)}`,
    );
    setLoading(false);
  };
  // Receipt button handler (placeholder)
  const handleReceiptPress = async (entry: JournalEntry) => {
    setLoading(true);

    try {
      const uri = await generateReceiptPdf(event.id, entry.id);
      router.push({
        pathname: "/pdf/receipt",
        params: { pdfUri: uri },
      });
    } catch (error: any) {
      console.log("PDF ERROR:", error);
      Alert.alert("Error", error?.message || "Could not generate receipt");
    } finally {
      setLoading(false);
    }
  };

  // Agreement button handler (placeholder)
  const handleAgreementPress = async (event: BookingEvent) => {
    setLoading(true);
    try {
      const uri = await generateAgreementPdf(event.id);
      router.push({
        pathname: "/pdf/agreement",
        params: { pdfUri: uri },
      });
    } catch (error: any) {
      console.log("PDF ERROR:", error);
      Alert.alert(
        "Error",
        t("event.details.error.pdf") || "Could not generate agreemnet",
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePostpone = (event: BookingEvent) => {
    Alert.alert(
      t("event.details.alert.postpone.title"),
      t("event.details.alert.postpone.msg"),
      [
        { text: t("event.details.alert.cancel"), style: "cancel" },
        {
          text: t("event.details.alert.delete.confirm"),
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              changeToPostponedEvent(event);
              Alert.alert("Success", t("event.details.alert.success.postpone"));
            } catch (error: any) {
              setLoading(false);

              console.log("loading error:", error);
              Alert.alert("loading error:", error?.message);
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  const handleDelete = () => {
    Alert.alert(
      t("event.details.alert.delete.title"),
      t("event.details.alert.delete.msg"),
      [
        { text: t("event.details.alert.cancel"), style: "cancel" },
        {
          text: t("event.details.alert.delete.confirm"),
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              /* logic */
            } catch (error) {
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  const StatCard = ({ label, amount, color, isBold }: any) => (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text
        style={[
          styles.statAmount,
          { color: color, fontWeight: isBold ? "800" : "600" },
        ]}
      >
        {event.currency || "$"}
        {amount}
      </Text>
    </View>
  );

  const ActionButton = ({ icon, label, color, outline, onPress }: any) => (
    <TouchableOpacity
      style={[
        styles.actionBtn,
        outline
          ? { borderColor: color, borderWidth: 1.5 }
          : { backgroundColor: color },
      ]}
      onPress={onPress} // <-- add this line
    >
      <Ionicons name={icon} size={20} color={outline ? color : "#FFF"} />
      <Text style={[styles.actionBtnText, { color: outline ? color : "#FFF" }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  // Helper to format date as "dd MMM yyyy • hh:mm a"
  const formatJournalDate = (date: Date): string => {
    const d = new Date(date);
    const day = d.getDate();
    const month = d.toLocaleString("default", { month: "short" });
    const year = d.getFullYear();
    const time = d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${day} ${month} ${year} • ${time}`;
  };

  // Helper to get total amount from a journal entry (sum of debits)
  const getJournalAmount = (entry: JournalEntry): number => {
    return entry.transactions.reduce(
      (sum, t) => (t.type === "debit" ? sum + t.amount : sum),
      0,
    );
  };

  const [newPaidAmount, setNewPaidAmount] = useState("");

  // Handler for opening the options menu for a payment
  // Handler for opening the options menu for a payment
  const handlePaymentOptions = (entry: JournalEntry) => {
    setSelectedPayment(entry);
    setIsMenuVisible(true);
  };

  const closeMenu = () => {
    setIsMenuVisible(false);
    setSelectedPayment(null);
  };

  const handleSaveNewPayment = () => {
    // 1. Validate and parse the input amount
    const amount = parseFloat(newPaidAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid payment amount.");
      return;
    }

    // 2. Determine the Debit side (Asset) based on payment method
    // Cash goes to Cash account; Card and Transfer go to Bank
    const debitAccount =
      newPaymentMethod === "cash" ? ACCOUNTS.CASH : ACCOUNTS.BANK;

    // 3. Construct the balancing transactions (Double Entry)
    const transactions = [
      {
        accountId: debitAccount.id,
        accountName: debitAccount.name,
        amount: amount,
        type: "debit" as const, // Increasing Asset
      },
      {
        accountId: ACCOUNTS.EVENT_REVENUE.id,
        accountName: ACCOUNTS.EVENT_REVENUE.name,
        amount: amount,
        type: "credit" as const, // Increasing Revenue
      },
    ];

    // 4. Build the complete Journal Entry
    const newEntry: JournalEntry = {
      id: `je_${Date.now()}`,
      companyId: "mamo-15",
      date: new Date(),
      description: t("event.add.journal.dis") || `Payment for ${event.title}`,
      receiptNumber: `RCPT-${Date.now()}`,
      source: "booking",
      referenceId: event.id,
      currency: event.currency || "USD",
      transactions: transactions, // Now contains balancing entries
      metadata: {
        paymentMethod: newPaymentMethod,
        recordedBy: "Admin", // Ideally the logged-in user's name
      },
      createdAt: new Date(),
    };

    // 5. Save and Reset
    addJournalEntry(newEntry);
    setShowAddPayment(false);
    setNewPaidAmount("");

    Alert.alert(
      t("event.add.journal.success"),
      t("event.add.journal.success_msg"),
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return theme.success;
      case "postponed":
        return theme.primary;
      default:
        return theme.danger; // for cancelled, pending, etc.
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
      edges={["bottom"]}
    >
      <Stack.Screen
        options={{
          headerTitle: event.title, // Hides the text "stats/[id]"
          headerShadowVisible: false, // Optional: makes header blend into background
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.textMain, // Sets back button color
        }}
      />
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* 1. Header Card */}
          <View style={styles.headerCard}>
            <View style={styles.rowBetween}>
              <View style={{ flex: 1 }}>
                <Text style={styles.customerName} numberOfLines={1}>
                  {event.customerName}
                </Text>
                <Text style={styles.customerPhone}>
                  {event.customerPhone || event.customerPhones?.join(", ")}
                </Text>
              </View>
            </View>

            <View style={styles.dateTimeContainer}>
              <View style={styles.dateItem}>
                <Ionicons
                  name="calendar-outline"
                  size={16}
                  color={theme.textSecondary}
                />
                <Text style={styles.dateText}>
                  {new Date(event.startDate).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.dateItem}>
                <Ionicons
                  name="time-outline"
                  size={16}
                  color={theme.textSecondary}
                />
                <Text style={styles.dateText}>
                  {new Date(event.startDate).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(event.status) + "20" }, // 20% opacity
                ]}
              >
                <Text style={[styles.statusText, { color: theme.success }]}>
                  {t(`stats.status.${event.status}`)}{" "}
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.whatsappBtn} onPress={openWhatsApp}>
              <FontAwesome5 name="whatsapp" size={20} color={theme.white} />
              <Text style={styles.whatsappBtnText}>WhatsApp</Text>
            </TouchableOpacity>
          </View>

          {/* 2. Financial Stats Grid */}
          <Text style={styles.sectionTitle}>
            {t("event.details.section.financial")}
          </Text>
          <View style={styles.statsGrid}>
            <StatCard
              label={t("event.details.label.total")}
              amount={event.amount}
              color={theme.textMain}
            />
            <StatCard
              label={t("event.details.label.paid")}
              amount={event.paidAmount || 0}
              color={theme.success}
            />
            <StatCard
              label={t("event.details.label.remaining")}
              amount={event.amount - (event.paidAmount || 0)}
              color={theme.danger}
              isBold
            />
          </View>

          {/* 3. Timeline – Dynamic from Journal Entries */}
          <View
            style={[styles.rowBetween, { marginTop: 28, marginBottom: 12 }]}
          >
            <Text
              style={[styles.sectionTitle, { marginTop: 0, marginBottom: 0 }]}
            >
              {t("event.details.section.timeline")}
            </Text>
            <TouchableOpacity
              onPress={() => setShowAddPayment(!showAddPayment)}
            >
              <Ionicons
                name={
                  showAddPayment ? "close-circle-outline" : "add-circle-outline"
                }
                size={24}
                color={theme.primary}
              />
            </TouchableOpacity>
          </View>

          {/* Inline Add Payment Form */}
          {showAddPayment && (
            <View
              style={{
                backgroundColor: theme.surface,
                padding: 16,
                borderRadius: 16,
                marginBottom: 16,
              }}
            >
              <PaymentForm
                theme={theme}
                paymentMethod={newPaymentMethod}
                paidAmount={newPaidAmount}
                onMethodChange={setNewPaymentMethod}
                onAmountChange={setNewPaidAmount}
              />
              <TouchableOpacity
                style={[
                  styles.actionBtn,
                  { backgroundColor: theme.primary, width: "100%" },
                ]}
                onPress={handleSaveNewPayment}
              >
                <Text style={[styles.actionBtnText, { color: "#FFF" }]}>
                  Save Payment
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.timelineContainer}>
            {payments.length === 0 ? (
              <Text style={styles.emptyTimeline}>
                {t("event.edit.no.payments")}
              </Text>
            ) : (
              payments.map((entry, index) => {
                const amount = getJournalAmount(entry);
                const paymentMethod = entry.metadata?.paymentMethod || "other";
                const isLast = index === payments.length - 1;

                return (
                  <View key={entry.id} style={styles.timelineItem}>
                    <View style={styles.timelineLineContainer}>
                      <View style={styles.timelineDot} />
                      {!isLast && <View style={styles.timelineLine} />}
                    </View>
                    <View style={styles.timelineContent}>
                      <View style={styles.rowBetween}>
                        <Text style={styles.paymentType}>
                          {entry.currency || "USD"} {amount.toFixed(2)}
                        </Text>

                        {/* Replaced fixed receipt button with dynamic options button */}
                        <TouchableOpacity
                          style={styles.receiptBtn}
                          onPress={() => handlePaymentOptions(entry)}
                        >
                          <Ionicons
                            name="ellipsis-horizontal"
                            size={16}
                            color={theme.primary}
                          />
                        </TouchableOpacity>
                      </View>

                      <View style={styles.rowBetween}>
                        <View>
                          <Text style={styles.paymentMeta}>
                            {formatJournalDate(entry.date)} •{" "}
                            {paymentMethod.replace("_", " ").toUpperCase()}
                          </Text>
                          <Text style={styles.recordedBy}>
                            {t("event.details.timeline.recorded_by", {
                              user: entry.metadata?.recordedBy || "System",
                            })}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })
            )}
          </View>

          {/* 4. Action Grid */}
          <Text style={styles.sectionTitle}>
            {t("event.details.section.actions")}
          </Text>
          <View style={styles.actionGrid}>
            <ActionButton
              icon="document-text-outline"
              label={t("event.details.action.contract")}
              color={theme.primary}
              onPress={() => handleAgreementPress(event)}
            />
            <ActionButton
              icon="pause-circle-outline"
              label={t("event.details.action.postpone")}
              color={theme.warning}
              onPress={() => handlePostpone(event)}
            />
            <ActionButton
              icon="create-outline"
              label={t("event.details.action.edit")}
              color={theme.textSecondary}
              onPress={() =>
                router.push({
                  pathname: "/events/create",
                  params: {
                    id: event.id,
                  },
                })
              }
            />
            <ActionButton
              icon="trash-outline"
              label={t("event.details.action.delete")}
              color={theme.danger}
              outline
              onPress={() => handleDelete()}
            />
          </View>
        </ScrollView>
      </View>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={styles.loadingText}>{t("loading.indicatior")}</Text>
        </View>
      )}
      {/* Payment Options Menu Modal */}
      <Modal
        visible={isMenuVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeMenu}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeMenu}
        >
          <View style={styles.menuContainer}>
            <Text style={styles.menuTitle}>{t("event.add.options.title")}</Text>
            {/* Optional Subtitle */}
            {/* <Text style={styles.menuSubtitle}>{t("event.add.options.dis")}</Text> */}

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                if (selectedPayment) handleReceiptPress(selectedPayment);
                closeMenu();
              }}
            >
              <Ionicons
                name="receipt-outline"
                size={20}
                color={theme.primary}
              />
              <Text style={styles.menuItemText}>
                {t("event.add.options.receipt")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                if (selectedPayment)
                  console.log("Edit pressed", selectedPayment.id);
                closeMenu();
              }}
            >
              <Ionicons
                name="create-outline"
                size={20}
                color={theme.textMain}
              />
              <Text style={styles.menuItemText}>
                {t("event.add.options.edit")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                Alert.alert(
                  t("event.details.alert.delete.title"),
                  t("event.details.alert.delete.msg"),
                  [
                    { text: t("event.details.alert.cancel"), style: "cancel" },
                    {
                      text: t("event.details.alert.delete.confirm"),
                      style: "destructive",
                      onPress: async () => {
                        setLoading(true);
                        try {
                          if (selectedPayment) {
                            deleteJournalEntry(selectedPayment.id);
                            Alert.alert(
                              t("event.add.options.delete"),
                              t("event.add.options.delete_msg"),
                            );
                          }
                          closeMenu();
                        } catch (error) {
                        } finally {
                          setLoading(false);
                        }
                      },
                    },
                  ],
                );
              }}
            >
              <Ionicons name="trash-outline" size={20} color={theme.danger} />
              <Text style={[styles.menuItemText, { color: theme.danger }]}>
                {t("event.add.options.delete")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.menuItem,
                {
                  borderBottomWidth: 0,
                  justifyContent: "center",
                  marginTop: Spacing.sm,
                },
              ]}
              onPress={closeMenu}
            >
              <Text style={styles.menuCancelText}>
                {t("event.details.alert.cancel")}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingHorizontal: Spacing.md,
    },
    rowBetween: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    headerCard: {
      backgroundColor: theme.surface,
      borderRadius: 24,
      padding: Spacing.lg,
      marginTop: Spacing.md,
      borderWidth: 1,
      borderColor: theme.border,
    },
    customerName: { fontSize: 22, fontWeight: "800", color: theme.textMain },
    customerPhone: { fontSize: 14, color: theme.textSecondary, marginTop: 4 },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    statusText: { fontSize: 11, fontWeight: "800" },
    dateTimeContainer: { flexDirection: "row", marginTop: Spacing.sm, gap: 16 },
    dateItem: { flexDirection: "row", alignItems: "center", gap: 6 },
    dateText: { fontSize: 13, color: theme.textSecondary, fontWeight: "500" },
    whatsappBtn: {
      backgroundColor: "#25D366",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      padding: 14,
      borderRadius: 16,
      marginTop: 20,
      gap: 8,
    },
    whatsappBtnText: { color: "#FFF", fontWeight: "700", fontSize: 16 },

    sectionTitle: {
      fontSize: 16,
      fontWeight: "800",
      color: theme.textMain,
      marginTop: 28,
      marginBottom: 12,
      letterSpacing: 0.5,
    },

    // STATS GRID STYLES
    statsGrid: { flexDirection: "row", gap: 10 },
    statCard: {
      flex: 1,
      backgroundColor: theme.surface,
      paddingVertical: 15,
      borderRadius: 18,
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.border,
    },
    statLabel: {
      fontSize: 11,
      color: theme.textSecondary,
      marginBottom: 4,
      textTransform: "uppercase",
      fontWeight: "600",
    },
    statAmount: {
      fontSize: 15,
      fontWeight: "700",
    },

    timelineContainer: { paddingLeft: 8 },
    timelineItem: { flexDirection: "row" },
    timelineLineContainer: { alignItems: "center", width: 20 },
    timelineDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: theme.primary,
      marginTop: 5,
    },
    timelineLine: {
      flex: 1,
      width: 2,
      backgroundColor: theme.border,
      marginVertical: 4,
    },
    timelineContent: { flex: 1, paddingLeft: 16, paddingBottom: 24 },
    paymentType: { fontSize: 15, fontWeight: "700", color: theme.textMain },
    paymentMeta: { fontSize: 12, color: theme.textSecondary, marginTop: 2 },
    recordedBy: {
      fontSize: 11,
      color: theme.textSecondary,
      marginTop: 2,
      fontStyle: "italic",
    },
    receiptBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      backgroundColor: theme.primary + "15",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
    receiptBtnText: { color: theme.primary, fontSize: 11, fontWeight: "700" },
    actionGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
    actionBtn: {
      width: (width - Spacing.md * 2 - 12) / 2,
      padding: 14,
      borderRadius: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },
    safeArea: {
      flex: 1,
    },
    actionBtnText: { fontWeight: "700", fontSize: 14 },
    emptyTimeline: {
      textAlign: "center",
      color: theme.textSecondary,
      fontStyle: "italic",
      marginTop: 20,
    },
    loadingOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(255,255,255,0.85)",
      justifyContent: "center",
      alignItems: "center",
    },
    loadingText: {
      marginTop: 10,
      fontSize: 14,
      color: "#1e457e",
      fontWeight: "500",
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      justifyContent: "flex-end", // Pushes the menu to the bottom
    },
    menuContainer: {
      backgroundColor: theme.background,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: Spacing.lg,
      paddingBottom: 40, // Extra padding for safe area at the bottom
    },
    menuTitle: {
      fontSize: 16,
      fontWeight: "800",
      color: theme.textSecondary,
      textAlign: "center",
      marginBottom: Spacing.md,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      gap: 12,
    },
    menuItemText: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.textMain,
    },
    menuCancelText: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.textSecondary,
    },
  });
