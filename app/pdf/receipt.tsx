//app/events/receipt.tsx

import { Ionicons } from "@expo/vector-icons";
import * as Print from "expo-print";
import { Stack, useLocalSearchParams } from "expo-router";
import * as Sharing from "expo-sharing";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";

// Dummy services - replace with your actual data fetching logic
import { getEventById } from "@/services/eventService";
import { SafeAreaView } from "react-native-safe-area-context";
// import { getJournalEntryById } from "@/services/accountingService";

export default function ReceiptPreview() {
  const { eventId, entryId } = useLocalSearchParams();
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch your data here
    const event = getEventById(eventId as string);
    // const journalEntry = getJournalEntryById(entryId as string);

    // Mocking JournalEntry for demonstration
    const journalEntry = {
      id: entryId,
      receiptNumber: "REC-99812",
      date: new Date(),
      amount: event?.amount || 0, // In a real scenario, calculate from transactions
    };

    if (event && journalEntry) {
      const generatedHtml = generateReceiptHTML(event, journalEntry);
      setHtmlContent(generatedHtml);
      setLoading(false);
    }
  }, [eventId, entryId]);

  // --- ACTIONS ---
  const printReceipt = async () => {
    try {
      await Print.printAsync({
        html: htmlContent,
      });
    } catch (error) {
      Alert.alert("Error", "Failed to print receipt.");
    }
  };

  const savePdf = async () => {
    try {
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
      });
      await Sharing.shareAsync(uri, {
        UTI: ".pdf",
        mimeType: "application/pdf",
      });
    } catch (error) {
      Alert.alert("Error", "Failed to save/share PDF.");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1e457e" />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea]} edges={["bottom"]}>
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: "Receipt Preview",
            headerRight: () => (
              <View style={{ flexDirection: "row", gap: 15 }}>
                <TouchableOpacity onPress={savePdf}>
                  <Ionicons name="share-outline" size={24} color="#1e457e" />
                </TouchableOpacity>
                <TouchableOpacity onPress={printReceipt}>
                  <Ionicons name="print-outline" size={24} color="#1e457e" />
                </TouchableOpacity>
              </View>
            ),
          }}
        />

        {/* WebView acts as our perfect visual preview rendering the exact HTML/Tailwind */}
        <WebView
          originWhitelist={["*"]}
          source={{ html: htmlContent }}
          style={styles.webview}
          scalesPageToFit={true}
        />

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.btn, styles.btnOutline]}
            onPress={savePdf}
          >
            <Ionicons name="download-outline" size={20} color="#1e457e" />
            <Text style={styles.btnOutlineText}>Save PDF</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btn} onPress={printReceipt}>
            <Ionicons name="print" size={20} color="#FFF" />
            <Text style={styles.btnText}>Print & Sign</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

// --- HTML GENERATOR ---
// This injects your data into the exact Tailwind layout from Next.js
function generateReceiptHTML(event: any, entry: any) {
  const formatDateArabic = (date: Date) => {
    return new Date(date).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Replace this with your actual remaining balance calculation logic
  const remainingAfter = 0;

  return `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        @page { size: A5 landscape; margin: 10mm; }
        body { margin: 0; padding: 0; background: white; font-family: sans-serif; -webkit-print-color-adjust: exact; }
      </style>
    </head>
    <body class="bg-white p-4 text-[#1e457e]">
      
      <div class="flex justify-between items-start border-b-2 border-blue-100 pb-4 mb-6">
        <div class="flex flex-col items-start">
          <h1 class="text-3xl font-black mb-1 tracking-tight text-blue-900">فرقة نسمة الجنوب</h1>
          <h2 class="text-lg font-bold text-blue-700 opacity-80">لإحياء المناسبات الإجتماعية</h2>
          <div class="mt-2 px-3 py-1 bg-blue-50 rounded-full border border-blue-100">
            <span class="text-sm font-bold text-blue-800">سند قبض</span>
          </div>
        </div>

        <div class="flex flex-col items-center">
          <span class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">رقم السند</span>
          <span class="text-red-500 font-black text-3xl tracking-wider font-mono bg-red-50 px-4 py-1 rounded-lg border border-red-100">
            ${entry.receiptNumber}
          </span>
        </div>

        <div class="relative w-32 h-32 flex items-center justify-center bg-blue-50 rounded-full border-2 border-blue-100">
           <span class="text-blue-200 font-bold">LOGO</span>
        </div>
      </div>

      <div class="flex gap-8">
        <div class="w-3/4">
          <div class="grid grid-cols-6 border-t-2 border-r-2 border-[#1e457e] w-full bg-[#fcfcfc]">
            
            <div class="col-span-4 border-b-2 border-l-2 border-[#1e457e] p-4 min-h-[80px]">
              <span class="text-xs font-bold text-gray-400 block mb-1">وصلنا من السيد / السادة:</span>
              <span class="text-xl font-black text-[#1e457e]">${event.customerName}</span>
            </div>
            <div class="col-span-2 border-b-2 border-l-2 border-[#1e457e] p-4 min-h-[80px]">
              <span class="text-xs font-bold text-gray-400 block mb-1">بتاريخ:</span>
              <span class="text-xl font-black text-[#1e457e]">${formatDateArabic(entry.date)}</span>
            </div>

            <div class="col-span-2 border-b-2 border-l-2 border-[#1e457e] p-4 min-h-[80px] bg-blue-50/30">
              <span class="text-xs font-bold text-gray-400 block mb-1">مبلغ وقدره:</span>
              <div class="flex items-baseline gap-1">
                <span class="text-2xl font-black text-blue-800">${Number(entry.amount).toLocaleString("en-EG")}</span>
                <span class="text-sm font-bold text-blue-600">${event.currency || "USD"}</span>
              </div>
            </div>
            <div class="col-span-4 border-b-2 border-l-2 border-[#1e457e] p-4 min-h-[80px]">
              <span class="text-xs font-bold text-gray-400 block mb-1">وذلك عن (مكان المناسبة):</span>
              <span class="text-xl font-black text-[#1e457e]">${event.place || "غير محدد"}</span>
            </div>

            <div class="col-span-2 border-b-2 border-l-2 border-[#1e457e] p-4 min-h-[80px]">
              <span class="text-xs font-bold text-gray-400 block mb-1">إجمالي قيمة الحجز:</span>
              <div class="flex items-baseline gap-1">
                <span class="text-xl font-black text-gray-700">${Number(event.amount).toLocaleString("en-EG")}</span>
                <span class="text-sm font-bold text-gray-500">${event.currency || "USD"}</span>
              </div>
            </div>
            <div class="col-span-4 border-b-2 border-l-2 border-[#1e457e] p-4 min-h-[80px]">
              <span class="text-xs font-bold text-gray-400 block mb-1">تاريخ المناسبة:</span>
              <span class="text-xl font-black text-[#1e457e]">${formatDateArabic(event.startDate)}</span>
            </div>

            <div class="col-span-2 border-b-2 border-l-2 border-[#1e457e] p-4 min-h-[80px] bg-red-50/20">
              <span class="text-xs font-bold text-gray-400 block mb-1">المتبقي:</span>
              <div class="flex items-baseline gap-1">
                <span class="text-2xl font-black text-red-600">${remainingAfter.toLocaleString("en-EG")}</span>
                <span class="text-sm font-bold text-red-400">${event.currency || "USD"}</span>
              </div>
            </div>
            <div class="col-span-4 border-b-2 border-l-2 border-[#1e457e] p-4 min-h-[80px] flex items-end">
               <div class="w-full flex justify-between items-center">
                  <div class="flex flex-col">
                    <span class="text-xs font-bold text-gray-400 mb-6">توقيع المستلم:</span>
                    <div class="border-b border-gray-300 w-32"></div>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-xs font-bold text-gray-400 mb-6">توقيع الزبون:</span>
                    <div class="border-b border-gray-300 w-32"></div>
                  </div>
                </div>
            </div>

          </div>
        </div>

        <div class="w-1/4 flex flex-col justify-between">
           <div class="border-2 border-dashed border-blue-200 h-40 flex flex-col items-center justify-center mb-6 bg-blue-50/10 rounded-xl relative">
              <span class="font-bold text-gray-300 text-sm transform -rotate-12">ختم الشركة</span>
            </div>
            <div class="flex flex-col gap-3 font-bold text-sm bg-gray-50 p-4 rounded-xl border border-gray-100">
              <span class="text-[10px] text-gray-400 mb-1 block">للتواصل:</span>
              </div>
        </div>
      </div>
      
      <div class="mt-4 text-center text-[10px] text-gray-400 border-t border-gray-100 pt-2 italic">
        * يعتبر هذا السند تأكيداً لعملية الدفع المذكورة أعلاه. يرجى الاحتفاظ به لضمان حقوقكم.
      </div>
    </body>
    </html>
  `;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f4f5" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  webview: {
    flex: 1,
    backgroundColor: "transparent",
    margin: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  footer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#e4e4e7",
    gap: 12,
  },
  btn: {
    flex: 1,
    backgroundColor: "#1e457e",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 12,
    gap: 8,
  },
  btnOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#1e457e",
  },
  safeArea: {
    flex: 1,
  },
  btnText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
  btnOutlineText: { color: "#1e457e", fontWeight: "bold", fontSize: 16 },
});
