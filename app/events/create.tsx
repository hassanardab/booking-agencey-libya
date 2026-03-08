import React, { useState } from "react";
import { 
  StyleSheet, Text, View, ScrollView, TextInput, 
  TouchableOpacity, KeyboardAvoidingView, Platform 
} from "react-native";
import { Stack, router } from "expo-router";
import { Colors, Spacing, Radius } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import {
  SafeAreaView,
} from "react-native-safe-area-context";

export default function CreateEvent() {
  const scheme = useColorScheme();
  const theme = Colors[scheme ?? "light"];
  const [form, setForm] = useState({
    title: "",
    customer: "",
    phone: "",
    amount: "",
    date: new Date().toLocaleDateString(),
    notes: ""
  });

  const InputLabel = ({ label }: { label: string }) => (
    <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>
  );

  return (
    // <SafeAreaView style={styles.container edges{["top", "bottom"]}} >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen options={{ 
        headerTitle: "New Booking",
        headerShadowVisible: false,
        headerStyle: { backgroundColor: theme.background },
        headerTintColor: theme.textMain 
      }} />

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Section: General Info */}
          <View style={styles.section}>
            <InputLabel label="Event Details" />
            <TextInput
              style={[styles.input, { backgroundColor: theme.surface, color: theme.textMain, borderColor: theme.border }]}
              placeholder="e.g. Wedding Photography"
              placeholderTextColor={theme.textSecondary}
              value={form.title}
              onChangeText={(t) => setForm({...form, title: t})}
            />
          </View>

          {/* Section: Customer Info */}
          <View style={styles.section}>
            <InputLabel label="Customer Name" />
            <TextInput
              style={[styles.input, { backgroundColor: theme.surface, color: theme.textMain, borderColor: theme.border }]}
              placeholder="Full Name"
              placeholderTextColor={theme.textSecondary}
              value={form.customer}
              onChangeText={(t) => setForm({...form, customer: t})}
            />
            
            <View style={{ marginTop: Spacing.md }}>
              <InputLabel label="Phone Number" />
              <TextInput
                style={[styles.input, { backgroundColor: theme.surface, color: theme.textMain, borderColor: theme.border }]}
                placeholder="+1 (555) 000-0000"
                keyboardType="phone-pad"
                placeholderTextColor={theme.textSecondary}
                value={form.phone}
                onChangeText={(t) => setForm({...form, phone: t})}
              />
            </View>
          </View>

          {/* Section: Pricing & Date */}
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <InputLabel label="Total Amount" />
              <View style={[styles.priceInputWrapper, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Text style={{ color: theme.textSecondary, marginRight: 4 }}>$</Text>
                <TextInput
                  style={[styles.priceInput, { color: theme.textMain }]}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  placeholderTextColor={theme.textSecondary}
                  value={form.amount}
                  onChangeText={(t) => setForm({...form, amount: t})}
                />
              </View>
            </View>

            <View style={{ flex: 1, marginLeft: Spacing.md }}>
              <InputLabel label="Event Date" />
              <TouchableOpacity style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, justifyContent: 'center' }]}>
                <Text style={{ color: theme.textMain }}>{form.date}</Text>
                <Ionicons name="calendar-outline" size={18} color={theme.primary} style={styles.inputIcon} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <InputLabel label="Internal Notes" />
            <TextInput
              style={[styles.textArea, { backgroundColor: theme.surface, color: theme.textMain, borderColor: theme.border }]}
              placeholder="Any specific requirements..."
              multiline
              numberOfLines={4}
              placeholderTextColor={theme.textSecondary}
              value={form.notes}
              onChangeText={(t) => setForm({...form, notes: t})}
            />
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Action Bar */}
      <View style={[styles.footer, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
        <TouchableOpacity 
          style={styles.cancelBtn} 
          onPress={() => router.back()}
        >
          <Text style={[styles.cancelBtnText, { color: theme.textSecondary }]}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.saveBtn, { backgroundColor: theme.primary }]}
          onPress={() => {
            // Add save logic here
            router.back();
          }}
        >
          <Text style={styles.saveBtnText}>Create Booking</Text>
        </TouchableOpacity>
      </View>
    </View>
    // </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: Spacing.lg, paddingBottom: 100 },
  section: { marginBottom: Spacing.xl },
  label: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', marginBottom: Spacing.sm, letterSpacing: 0.5 },
  input: {
    height: 52,
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    fontSize: 16,
  },
  inputIcon: { position: 'absolute', right: 12 },
  row: { flexDirection: 'row', marginBottom: Spacing.xl },
  priceInputWrapper: {
    height: 52,
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceInput: { flex: 1, fontSize: 16 },
  textArea: {
    minHeight: 100,
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing.md,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  footer: {
    flexDirection: 'row',
    padding: Spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 34 : Spacing.lg,
    borderTopWidth: 1,
    marginBottom:Spacing.lg,
    gap: Spacing.md,
  },
  cancelBtn: { flex: 1, height: 52, justifyContent: 'center', alignItems: 'center' },
  cancelBtnText: { fontWeight: '600', fontSize: 16 },
  saveBtn: { flex: 2, height: 52, borderRadius: Radius.md, justifyContent: 'center', alignItems: 'center' },
  saveBtnText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
});