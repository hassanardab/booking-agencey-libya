//app/events/[id].tsx
import React from "react";
import { 
  StyleSheet, Text, View, ScrollView, TouchableOpacity, 
  Linking, Dimensions 
} from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { Colors, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { getEventById } from "@/services/eventService";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function EventDetails() {
  const { id } = useLocalSearchParams();
  const scheme = useColorScheme();
  const theme = Colors[scheme ?? "light"];
  const styles = createStyles(theme);

  const event = getEventById(id as string);

  if (!event) return <View style={styles.container}><Text>Event not found</Text></View>;

  const openWhatsApp = () => {
    const phone = event.customerPhone || event.customerPhones?.[0] || "";
    const msg = `Hello ${event.customerName}, regarding your event on ${new Date(event.startDate).toLocaleDateString()}...`;
    Linking.openURL(`whatsapp://send?phone=${phone}&text=${encodeURIComponent(msg)}`);
  };

  // --- INTERNAL SUB-COMPONENTS (Now they have access to 'styles') ---
  
  const StatCard = ({ label, amount, color, isBold }: any) => (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statAmount, { color: color, fontWeight: isBold ? '800' : '600' }]}>
        {event.currency || '$'}{amount}
      </Text>
    </View>
  );

  const ActionButton = ({ icon, label, color, outline }: any) => (
    <TouchableOpacity 
      style={[styles.actionBtn, outline ? { borderColor: color, borderWidth: 1.5 } : { backgroundColor: color }]}
    >
      <Ionicons name={icon} size={20} color={outline ? color : "#FFF"} />
      <Text style={[styles.actionBtnText, { color: outline ? color : "#FFF" }]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: event.title, // Hides the text "stats/[id]"
          headerShadowVisible: false, // Optional: makes header blend into background
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.textMain, // Sets back button color
        }}
      />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* 1. Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.rowBetween}>
            <View style={{ flex: 1 }}>
              <Text style={styles.customerName} numberOfLines={1}>{event.customerName}</Text>
              <Text style={styles.customerPhone}>{event.customerPhone || event.customerPhones?.join(', ')}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: theme.success + '20' }]}>
              <Text style={[styles.statusText, { color: theme.success }]}>{event.status?.toUpperCase()}</Text>
            </View>
          </View>

          <View style={styles.dateTimeContainer}>
            <View style={styles.dateItem}>
              <Ionicons name="calendar-outline" size={16} color={theme.textSecondary} />
              <Text style={styles.dateText}>{new Date(event.startDate).toDateString()}</Text>
            </View>
            <View style={styles.dateItem}>
              <Ionicons name="time-outline" size={16} color={theme.textSecondary} />
              <Text style={styles.dateText}>10:00 AM</Text> 
            </View>
          </View>

          <TouchableOpacity style={styles.whatsappBtn} onPress={openWhatsApp}>
            <FontAwesome5 name="whatsapp" size={20} color={theme.white} />
            <Text style={styles.whatsappBtnText}>Send WhatsApp</Text>
          </TouchableOpacity>
        </View>

        {/* 2. Financial Stats Grid */}
        <Text style={styles.sectionTitle}>Financial Overview</Text>
        <View style={styles.statsGrid}>
          <StatCard label="Total" amount={event.amount} color={theme.textMain} />
          <StatCard label="Paid" amount={event.paidAmount || 0} color={theme.success} />
          <StatCard label="Remaining" amount={(event.amount - (event.paidAmount || 0))} color={theme.danger} isBold />
        </View>

        {/* 3. Timeline */}
        <Text style={styles.sectionTitle}>Payment Timeline</Text>
        <View style={styles.timelineContainer}>
          <View style={styles.timelineItem}>
            <View style={styles.timelineLineContainer}>
              <View style={styles.timelineDot} />
              <View style={styles.timelineLine} />
            </View>
            <View style={styles.timelineContent}>
              <View style={styles.rowBetween}>
                <Text style={styles.paymentType}>Deposit - Cash</Text>
                <TouchableOpacity style={styles.receiptBtn}>
                  <Ionicons name="print-outline" size={14} color={theme.primary} />
                  <Text style={styles.receiptBtnText}>A5 Receipt</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.paymentMeta}>24 Oct 2023 • 02:30 PM</Text>
              <Text style={styles.recordedBy}>Recorded by: Admin</Text>
            </View>
          </View>
        </View>

        {/* 4. Action Grid */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <ActionButton icon="document-text-outline" label="Contract" color={theme.primary} />
          <ActionButton icon="pause-circle-outline" label="Postpone" color={theme.warning} />
          <ActionButton icon="create-outline" label="Edit Event" color={theme.textSecondary} />
          <ActionButton icon="trash-outline" label="Delete" color={theme.danger} outline />
        </View>

      </ScrollView>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background, paddingHorizontal: Spacing.md },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  
  headerCard: {
    backgroundColor: theme.surface,
    borderRadius: 24,
    padding: Spacing.lg,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: theme.border,
  },
  customerName: { fontSize: 22, fontWeight: '800', color: theme.textMain },
  customerPhone: { fontSize: 14, color: theme.textSecondary, marginTop: 4 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: '800' },
  dateTimeContainer: { flexDirection: 'row', marginTop: 16, gap: 16 },
  dateItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dateText: { fontSize: 13, color: theme.textSecondary, fontWeight: '500' },
  whatsappBtn: { 
    backgroundColor: '#25D366', 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 14, 
    borderRadius: 16, 
    marginTop: 20,
    gap: 8 
  },
  whatsappBtnText: { color: '#FFF', fontWeight: '700', fontSize: 16 },

  sectionTitle: { fontSize: 16, fontWeight: '800', color: theme.textMain, marginTop: 28, marginBottom: 12, letterSpacing: 0.5 },
  
  // STATS GRID STYLES
  statsGrid: { flexDirection: 'row', gap: 10 },
  statCard: { 
    flex: 1, 
    backgroundColor: theme.surface, 
    paddingVertical: 15,
    borderRadius: 18, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.border 
  },
  statLabel: { 
    fontSize: 11, 
    color: theme.textSecondary, 
    marginBottom: 4, 
    textTransform: 'uppercase', 
    fontWeight: '600' 
  },
  statAmount: { 
    fontSize: 15,
    fontWeight: '700'
  },

  timelineContainer: { paddingLeft: 8 },
  timelineItem: { flexDirection: 'row' },
  timelineLineContainer: { alignItems: 'center', width: 20 },
  timelineDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: theme.primary, marginTop: 5 },
  timelineLine: { flex: 1, width: 2, backgroundColor: theme.border, marginVertical: 4 },
  timelineContent: { flex: 1, paddingLeft: 16, paddingBottom: 24 },
  paymentType: { fontSize: 15, fontWeight: '700', color: theme.textMain },
  paymentMeta: { fontSize: 12, color: theme.textSecondary, marginTop: 2 },
  recordedBy: { fontSize: 11, color: theme.textSecondary, marginTop: 2, fontStyle: 'italic' },
  receiptBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: theme.primary + '15', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  receiptBtnText: { color: theme.primary, fontSize: 11, fontWeight: '700' },

  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  actionBtn: { 
    width: (width - (Spacing.md * 2) - 12) / 2, 
    padding: 14, 
    borderRadius: 16, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 8 
  },
  statLabel: {
  fontSize: 12,
  color: theme.textSecondary,
  marginBottom: Spacing.xs,        // use Spacing.xs (4) instead of 5 for consistency
  textTransform: 'uppercase',      // optional: makes labels more scannable
  letterSpacing: 0.5,              // optional: modern touch
},

statAmount: {
  fontSize: 18,                    // increased from 16 for better readability
  fontWeight: '600',
  color: theme.textMain,           // base color (overridden per card in the component)
  includeFontPadding: false,       // Android: prevent extra vertical padding
  textAlign: 'center',
},
  actionBtnText: { fontWeight: '700', fontSize: 14 },
});