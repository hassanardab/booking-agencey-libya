//app/events/create.tsx
import { Colors, Radius, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { getEventById } from "@/services/eventService";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { t } from "i18next";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateEvent() {
  const { id } = useLocalSearchParams();
  const event = getEventById(id as string);

  // Helper: format phone number as ###-###-####
  const formatPhone = (text: string) => {
    const cleaned = text.replace(/\D/g, "").slice(0, 10);
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return cleaned;
  };

  // Helper: format amount as currency (USD)
  const formatAmount = (text: string) => {
    const cleaned = text.replace(/[^0-9.]/g, "");
    const parts = cleaned.split(".");
    if (parts.length > 2) return cleaned.slice(0, -1);
    if (parts.length === 2 && parts[1].length > 2) {
      return `${parts[0]}.${parts[1].slice(0, 2)}`;
    }
    if (cleaned === "") return "";
    const number = parseFloat(cleaned) || 0;
    return number.toLocaleString("en-US", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    });
  };

  // Initialise form state with event data if editing
  const [form, setForm] = useState(() => ({
    title: event?.title || "",
    customer: event?.customerName || "",
    phone: event?.customerPhone
      ? formatPhone(event.customerPhone)
      : event?.customerPhones?.[0]
        ? formatPhone(event.customerPhones[0])
        : "",
    amount: event?.amount ? formatAmount(event.amount.toString()) : "",
    date: event?.startDate ? new Date(event.startDate) : new Date(),
    notes: event?.notes || "",
  }));

  // Payment section state
  const [paymentMethod, setPaymentMethod] = useState<
    "cash" | "card" | "transfer"
  >("cash"); // event does not include payment method – default to cash
  const [paidAmount, setPaidAmount] = useState(
    event?.paidAmount ? formatAmount(event.paidAmount.toString()) : "",
  );

  // Picker visibility
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handlePhoneChange = (text: string) => {
    const formatted = formatPhone(text);
    setForm({ ...form, phone: formatted });
  };

  const handleAmountChange = (text: string) => {
    const formatted = formatAmount(text);
    setForm({ ...form, amount: formatted });
  };

  const handlePaidAmountChange = (text: string) => {
    const formatted = formatAmount(text);
    setPaidAmount(formatted);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setForm({ ...form, date: selectedDate });
      setTimeout(() => setShowTimePicker(true), 100);
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const currentDate = form.date;
      const newDate = new Date(currentDate);
      newDate.setHours(selectedTime.getHours(), selectedTime.getMinutes());
      setForm({ ...form, date: newDate });
    }
  };

  const scheme = useColorScheme();
  const theme = Colors[scheme ?? "light"];

  const InputLabel = ({ label }: { label: string }) => (
    <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>
  );

  const formatDisplayDate = (date: Date) => {
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const isEditing = !!id;

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
      edges={["bottom"]}
    >
      <Stack.Screen
        options={{
          headerTitle: isEditing
            ? t("event.form.header.edit")
            : t("event.form.header.new"),
          headerShadowVisible: false,
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.textMain,
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Section: General Info */}
          <View style={styles.section}>
            <InputLabel label={t("event.form.label.details")} />
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.surface,
                  color: theme.textMain,
                  borderColor: theme.border,
                },
              ]}
              placeholder={t("event.form.placeholder.title")}
              placeholderTextColor={theme.textSecondary}
              value={form.title}
              onChangeText={(t) => setForm({ ...form, title: t })}
            />
          </View>

          {/* Section: Customer Info */}
          <View style={styles.section}>
            <InputLabel label={t("event.form.label.customer")} />
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.surface,
                  color: theme.textMain,
                  borderColor: theme.border,
                },
              ]}
              placeholder={t("event.form.placeholder.customer")}
              placeholderTextColor={theme.textSecondary}
              value={form.customer}
              onChangeText={(t) => setForm({ ...form, customer: t })}
            />
            <View style={{ marginTop: Spacing.md }}>
              <InputLabel label={t("event.form.label.phone")} />
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.surface,
                    color: theme.textMain,
                    borderColor: theme.border,
                  },
                ]}
                placeholder="092-123-4567"
                keyboardType="phone-pad"
                placeholderTextColor={theme.textSecondary}
                value={form.phone}
                onChangeText={handlePhoneChange}
                maxLength={12}
              />
            </View>
          </View>

          {/* Section: Pricing & Date */}
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <InputLabel label={t("event.form.label.amount")} />
              <View
                style={[
                  styles.priceInputWrapper,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Text style={{ color: theme.textSecondary, marginRight: 4 }}>
                  $
                </Text>
                <TextInput
                  style={[styles.priceInput, { color: theme.textMain }]}
                  placeholder="0"
                  keyboardType="numeric"
                  placeholderTextColor={theme.textSecondary}
                  value={form.amount}
                  onChangeText={handleAmountChange}
                />
              </View>
            </View>
            <View style={{ flex: 1, marginLeft: Spacing.md }}>
              <InputLabel label={t("event.form.label.date")} />
              <TouchableOpacity
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                    justifyContent: "center",
                  },
                ]}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={{ color: theme.textMain }}>
                  {formatDisplayDate(form.date)}
                </Text>
                <Ionicons
                  name="calendar-outline"
                  size={18}
                  color={theme.primary}
                  style={styles.inputIcon}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Payment Section */}
          <View style={styles.section}>
            <InputLabel label={t("event.form.label.payment")} />
            <View style={styles.paymentMethodRow}>
              {["cash", "card", "transfer"].map((method) => (
                <TouchableOpacity
                  key={method}
                  style={[
                    styles.paymentMethodBtn,
                    {
                      backgroundColor:
                        paymentMethod === method
                          ? theme.primary
                          : theme.surface,
                      borderColor: theme.border,
                    },
                  ]}
                  onPress={() => setPaymentMethod(method as any)}
                >
                  <Text
                    style={[
                      styles.paymentMethodText,
                      {
                        color:
                          paymentMethod === method ? "#FFF" : theme.textMain,
                      },
                    ]}
                  >
                    {t(`event.form.method.${method}`)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={{ marginTop: Spacing.md }}>
              <InputLabel label={t("event.form.label.paid")} />
              <View
                style={[
                  styles.priceInputWrapper,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Text style={{ color: theme.textSecondary, marginRight: 4 }}>
                  $
                </Text>
                <TextInput
                  style={[styles.priceInput, { color: theme.textMain }]}
                  placeholder="0"
                  keyboardType="numeric"
                  placeholderTextColor={theme.textSecondary}
                  value={paidAmount}
                  onChangeText={handlePaidAmountChange}
                />
              </View>
            </View>
          </View>

          {/* Section: Internal Notes */}
          <View style={styles.section}>
            <InputLabel label={t("event.form.label.notes")} />
            <TextInput
              style={[
                styles.textArea,
                {
                  backgroundColor: theme.surface,
                  color: theme.textMain,
                  borderColor: theme.border,
                },
              ]}
              placeholder={t("event.form.placeholder.notes")}
              multiline
              numberOfLines={4}
              placeholderTextColor={theme.textSecondary}
              value={form.notes}
              onChangeText={(t) => setForm({ ...form, notes: t })}
            />
          </View>

          {/* Extra bottom padding to ensure content clears the footer */}
          {/* <View style={{ height: 80 }} /> */}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Date & Time Pickers */}
      {showDatePicker && (
        <DateTimePicker
          value={form.date}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}
      {showTimePicker && (
        <DateTimePicker
          value={form.date}
          mode="time"
          display="default"
          onChange={onTimeChange}
        />
      )}

      {/* Bottom Action Bar */}
      <View
        style={[
          styles.footer,
          { backgroundColor: theme.surface, borderTopColor: theme.border },
        ]}
      >
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => router.back()}
        >
          <Text style={[styles.cancelBtnText, { color: theme.textSecondary }]}>
            {t("event.form.action.cancel")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: theme.primary }]}
          onPress={() => {
            const eventData = {
              ...form,
              payment: { method: paymentMethod, paid: paidAmount },
            };
            console.log(eventData);
            router.back();
          }}
        >
          <Text style={styles.saveBtnText}>
            {isEditing
              ? t("event.form.action.update")
              : t("event.form.action.save")}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: 100,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: Spacing.sm,
    letterSpacing: 0.5,
  },
  input: {
    height: 52,
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    fontSize: 16,
    justifyContent: "center",
  },
  inputIcon: {
    position: "absolute",
    right: 12,
  },
  row: {
    flexDirection: "row",
    marginBottom: Spacing.xl,
  },
  priceInputWrapper: {
    height: 52,
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
  },
  priceInput: {
    flex: 1,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing.md,
    fontSize: 16,
    textAlignVertical: "top",
  },
  footer: {
    flexDirection: "row",
    padding: Spacing.lg,
    paddingBottom: Platform.OS === "ios" ? 34 : Spacing.lg,
    borderTopWidth: 1,
    gap: Spacing.md,
  },
  cancelBtn: {
    flex: 1,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelBtnText: {
    fontWeight: "600",
    fontSize: 16,
  },
  saveBtn: {
    flex: 2,
    height: 52,
    borderRadius: Radius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  saveBtnText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 16,
  },
  paymentMethodRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  paymentMethodBtn: {
    flex: 1,
    height: 44,
    borderRadius: Radius.sm,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  paymentMethodText: {
    fontWeight: "600",
    fontSize: 14,
  },
});
