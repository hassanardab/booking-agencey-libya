// app/journal/create.tsx
import { Colors, Spacing } from "@/constants/theme";
import { ACCOUNTS } from "@/data/mcokAccounts";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  addJournalEntry,
  getJournalById,
  updateJournalEntry,
} from "@/services/accountingService";
import { getEventById } from "@/services/eventService";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function JournalForm() {
  const { id, eventId } = useLocalSearchParams<{
    id?: string; // If this exists, we are EDITING
    eventId: string; // Used to link the payment to the event
  }>();

  const isEditMode = !!id;
  const event = getEventById(eventId);

  const scheme = useColorScheme();
  const theme = Colors[scheme ?? "light"];
  const { t } = useTranslation();

  const [paymentMethod, setPaymentMethod] = useState<
    "cash" | "card" | "transfer"
  >("cash");
  const [amount, setAmount] = useState("");

  // LOAD DATA IF EDITING
  useEffect(() => {
    if (isEditMode && id) {
      const journal = getJournalById(id);
      if (journal) {
        // Find the debit side of the entry to get the amount
        const liquidTx = journal.transactions.find((t) => t.type === "debit");
        if (liquidTx) setAmount(liquidTx.amount.toString());
        setPaymentMethod(journal.metadata?.paymentMethod || "cash");
      }
    }
  }, [id]);

  const handleSubmit = () => {
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0)
      return Alert.alert("Error", "Enter a valid amount");

    const debitAccount =
      paymentMethod === "cash" ? ACCOUNTS.CASH : ACCOUNTS.BANK;

    const transactions = [
      {
        accountId: debitAccount.id,
        accountName: debitAccount.name,
        amount: val,
        type: "debit" as const,
      },
      {
        accountId: ACCOUNTS.AR.id,
        accountName: ACCOUNTS.AR.name,
        amount: val,
        type: "credit" as const,
      },
    ];

    if (isEditMode && id) {
      // LOGIC: UPDATE
      updateJournalEntry(id, {
        transactions,
        metadata: { paymentMethod, recordedBy: "Admin (Edited)" },
      });
      Alert.alert("Success", "Payment updated", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } else {
      // LOGIC: CREATE NEW
      const newEntry = {
        id: `je_${Date.now()}`,
        companyId: "mamo-15",
        date: new Date(),
        description: `Payment for ${event?.title || "Booking"}`,
        receiptNumber: `RCPT-${Date.now()}`,
        source: "booking" as const,
        referenceId: eventId, // CRITICAL: Links the payment to the event
        currency: event?.currency || "USD",
        transactions,
        metadata: { paymentMethod, recordedBy: "Admin" },
        createdAt: new Date(),
      };
      addJournalEntry(newEntry);
      Alert.alert("Success", "Payment recorded", [
        { text: "OK", onPress: () => router.back() },
      ]);
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
      edges={["bottom"]}
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Stack.Screen
          options={{
            title: isEditMode ? "Edit Payment" : "New Payment",
            headerShadowVisible: false,
          }}
        />

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>
            Amount
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.surface,
                color: theme.textMain,
                borderColor: theme.border,
              },
            ]}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="0.00"
            placeholderTextColor={theme.textSecondary}
          />
        </View>

        <Text
          style={[
            styles.label,
            { color: theme.textSecondary, marginBottom: 12 },
          ]}
        >
          Payment Method
        </Text>
        <View style={styles.methodGrid}>
          {(["cash", "card", "transfer"] as const).map((method) => (
            <TouchableOpacity
              key={method}
              style={[
                styles.methodBtn,
                { borderColor: theme.border },
                paymentMethod === method && {
                  backgroundColor: theme.primary,
                  borderColor: theme.primary,
                },
              ]}
              onPress={() => setPaymentMethod(method)}
            >
              <Ionicons
                name={
                  method === "cash"
                    ? "cash-outline"
                    : method === "card"
                      ? "card-outline"
                      : "swap-horizontal-outline"
                }
                size={20}
                color={paymentMethod === method ? "#FFF" : theme.textMain}
              />
              <Text
                style={[
                  styles.methodText,
                  { color: paymentMethod === method ? "#FFF" : theme.textMain },
                ]}
              >
                {method.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: theme.primary }]}
          onPress={handleSubmit}
        >
          <Text style={styles.saveBtnText}>
            {isEditMode ? "Update Payment" : "Save Payment"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: Spacing.md },
  formGroup: { marginBottom: 20 },
  label: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  input: {
    height: 60,
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 24,
    fontWeight: "700",
    borderWidth: 1,
  },
  methodGrid: { flexDirection: "row", gap: 10, marginBottom: 30 },
  methodBtn: {
    flex: 1,
    height: 80,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  methodText: { fontSize: 12, fontWeight: "700" },
  saveBtn: {
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 20,
  },
  saveBtnText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
  safeArea: {
    flex: 1,
  },
});
