//components/PaymentForm.tsx
import { Radius, Spacing } from "@/constants/theme";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface PaymentFormProps {
  theme: any;
  paymentMethod: "cash" | "card" | "transfer";
  paidAmount: string;
  onMethodChange: (method: "cash" | "card" | "transfer") => void;
  onAmountChange: (amount: string) => void;
}

export default function PaymentForm({
  theme,
  paymentMethod,
  paidAmount,
  onMethodChange,
  onAmountChange,
}: PaymentFormProps) {
  const { t } = useTranslation();

  const InputLabel = ({ label }: { label: string }) => (
    <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>
  );

  return (
    <View style={styles.section}>
      <InputLabel label={t("event.form.label.payment") || "PAYMENT METHOD"} />
      <View style={styles.paymentMethodRow}>
        {["cash", "card", "transfer"].map((method) => (
          <TouchableOpacity
            key={method}
            style={[
              styles.paymentMethodBtn,
              {
                backgroundColor:
                  paymentMethod === method ? theme.primary : theme.surface,
                borderColor: theme.border,
              },
            ]}
            onPress={() => onMethodChange(method as any)}
          >
            <Text
              style={[
                styles.paymentMethodText,
                { color: paymentMethod === method ? "#FFF" : theme.textMain },
              ]}
            >
              {t(`event.form.method.${method}`) || method.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ marginTop: Spacing.md }}>
        <InputLabel label={t("event.form.label.paid") || "AMOUNT PAID"} />
        <View
          style={[
            styles.priceInputWrapper,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          <Text style={{ color: theme.textSecondary, marginRight: 4 }}>$</Text>
          <TextInput
            style={[styles.priceInput, { color: theme.textMain }]}
            placeholder="0"
            keyboardType="numeric"
            placeholderTextColor={theme.textSecondary}
            value={paidAmount}
            onChangeText={onAmountChange}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: Spacing.xl },
  label: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: Spacing.sm,
    letterSpacing: 0.5,
  },
  paymentMethodRow: { flexDirection: "row", gap: Spacing.sm },
  paymentMethodBtn: {
    flex: 1,
    height: 44,
    borderRadius: Radius.sm,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  paymentMethodText: { fontWeight: "600", fontSize: 14 },
  priceInputWrapper: {
    height: 52,
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
  },
  priceInput: { flex: 1, fontSize: 16 },
});
