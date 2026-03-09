//app/pdf/receipt.tsx
import { getEventById } from "@/services/eventService";
import { Ionicons } from "@expo/vector-icons";
import { Buffer } from "buffer"; // ✅ this is required in React Native
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import { Stack, useLocalSearchParams } from "expo-router";
import * as Sharing from "expo-sharing";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SignatureScreen from "react-native-signature-canvas";

import { getAllJournalsForEvent } from "@/services/accountingService";
import Pdf from "react-native-pdf";

export default function AgreementPreview() {
  const { eventId, entryId } = useLocalSearchParams();
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSignature, setShowSignature] = useState(false);
  const signatureRef = useRef<any>(null);
  const [signing, setSigning] = useState(false);

  useEffect(() => {
    generateAndLoadPdf();
  }, [eventId]);

  const generateAndLoadPdf = async () => {
    try {
      setLoading(true);
      // 1. Fetch Data
      const event = getEventById(eventId as string);
      const journalEntries = getAllJournalsForEvent(event?.id as string);

      // 2. Create PDF Logic
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595, 842]); // Custom size or standard [595, 842] (A4)
      const { width, height } = page.getSize();
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

      // --- Draw Minimalist Header ---
      page.drawText("AGREEMENT", {
        x: 50,
        y: height - 50,
        size: 24,
        font,
        color: rgb(0.12, 0.27, 0.49),
      });
      // page.drawText(`No: ${journalEntry.receiptNumber}`, {
      //   x: width - 180,
      //   y: height - 50,
      //   size: 12,
      //   font: regularFont,
      // });

      // --- Draw Divider ---
      page.drawLine({
        start: { x: 50, y: height - 70 },
        end: { x: width - 50, y: height - 70 },
        thickness: 1,
        color: rgb(0.9, 0.9, 0.9),
      });

      // --- Content Sections ---
      page.drawText("Event Details:", {
        x: 50,
        y: height - 110,
        size: 14,
        font,
      });
      page.drawText(`Event ID: ${eventId}`, {
        x: 50,
        y: height - 135,
        size: 12,
        font: regularFont,
      });
      // page.drawText(`Date: ${journalEntry.date}`, {
      //   x: 50,
      //   y: height - 155,
      //   size: 12,
      //   font: regularFont,
      // });

      // --- Total Amount Box ---
      page.drawRectangle({
        x: 50,
        y: 100,
        width: width - 100,
        height: 50,
        color: rgb(0.96, 0.97, 0.98),
      });
      page.drawText("Total Amount Paid:", { x: 70, y: 120, size: 14, font });
      // page.drawText(`$${journalEntry.amount.toFixed(2)}`, {
      //   x: width - 150,
      //   y: 120,
      //   size: 18,
      //   font,
      //   color: rgb(0.12, 0.27, 0.49),
      // });

      try {
        const pdfBytes = await pdfDoc.save();

        const base64 = Buffer.from(pdfBytes).toString("base64");

        const file = new FileSystem.File(
          FileSystem.Paths.cache,
          `receipt_${entryId}.pdf`,
        );
        await file.write(base64, { encoding: "base64" });

        setPdfUri(file.uri);
      } catch (err) {
        console.error("PDF save error:", err);
        throw err;
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to generate native PDF.");
    } finally {
      setLoading(false);
    }
  };

  const sharePdf = async () => {
    if (pdfUri) {
      await Sharing.shareAsync(pdfUri, {
        UTI: ".pdf",
        mimeType: "application/pdf",
      });
    }
  };

  const printPdf = async () => {
    try {
      if (!pdfUri) return;

      await Print.printAsync({
        uri: pdfUri,
        orientation: Print.Orientation.portrait,
      });
    } catch (error) {
      console.error("Print error:", error);
      Alert.alert("Error", "Unable to print the PDF.");
    }
  };
  const signPdf = async () => {
    setShowSignature(true);
  };
  const handleSignature = async (signature: string) => {
    try {
      setShowSignature(false);

      if (!pdfUri) return;

      const existingFile = new FileSystem.File(pdfUri);
      const existingBase64 = await existingFile.base64();

      const pdfDoc = await PDFDocument.load(
        Buffer.from(existingBase64, "base64"),
      );

      const pages = pdfDoc.getPages();
      const lastPage = pages[pages.length - 1];

      const signatureBase64 = signature.replace("data:image/png;base64,", "");

      const pngImage = await pdfDoc.embedPng(signatureBase64);

      const MAX_SIGNATURE_WIDTH = 140;

      const pngDims = pngImage.scale(1);
      const scale = MAX_SIGNATURE_WIDTH / pngDims.width;

      lastPage.drawImage(pngImage, {
        x: 10,
        y: 5,
        width: pngDims.width * scale,
        height: pngDims.height * scale,
      });

      lastPage.drawText("Signed electronically", {
        x: 50,
        y: 30,
        size: 10,
        font: await pdfDoc.embedFont(StandardFonts.Helvetica),
        color: rgb(0.3, 0.3, 0.3),
      });

      const pdfBytes = await pdfDoc.save();

      const base64 = Buffer.from(pdfBytes).toString("base64");

      const signedFile = new FileSystem.File(
        FileSystem.Paths.cache,
        `receipt_signed_${entryId}.pdf`,
      );

      await signedFile.write(base64, { encoding: "base64" });

      setPdfUri(signedFile.uri);

      // Alert.alert("Success", "PDF signed successfully.");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to sign PDF.");
    } finally {
      setSigning(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1e457e" />
        <Text style={{ marginTop: 10 }}>Generating Receipt...</Text>
      </View>
    );
  }
  const clearSignature = () => {
    signatureRef.current?.clearSignature();
  };

  const confirmSignature = () => {
    setSigning(true);
    signatureRef.current?.readSignature();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: "Receipt Ready",
            headerRight: () => (
              <TouchableOpacity onPress={sharePdf}>
                <Ionicons name="share-outline" size={24} color="#1e457e" />
              </TouchableOpacity>
            ),
          }}
        />

        {/* ✅ This block replaces your static placeholder view */}
        <View style={styles.pdfContainer}>
          {pdfUri ? (
            <Pdf
              trustAllCerts={false}
              source={{ uri: pdfUri }}
              style={styles.pdfViewer}
              onLoadComplete={(numberOfPages: any) => {
                console.log(`PDF rendered: ${numberOfPages} pages`);
              }}
              onError={(error) => {
                console.log("PDF render error:", error);
                Alert.alert("Error", "Could not load PDF preview.");
              }}
            />
          ) : (
            <View style={styles.center}>
              <Text style={styles.subText}>Failed to load PDF preview.</Text>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          {showSignature ? (
            <>
              <TouchableOpacity
                style={[styles.btn, styles.btnOutline]}
                onPress={clearSignature}
              >
                <Ionicons name="refresh-outline" size={20} color="#1e457e" />
                <Text style={styles.btnOutlineText}>Clear</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.btn} onPress={confirmSignature}>
                <Ionicons name="checkmark" size={20} color="#FFF" />
                <Text style={styles.btnText}>Confirm</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={[styles.btn, styles.btnOutline]}
                onPress={signPdf}
              >
                <Ionicons name="create-outline" size={20} color="#1e457e" />
                <Text style={styles.btnOutlineText}>Sign</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.btn} onPress={printPdf}>
                <Ionicons name="print" size={20} color="#FFF" />
                <Text style={styles.btnText}>Print</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
      {showSignature && (
        <View style={{ height: 220 }}>
          <SignatureScreen
            ref={signatureRef}
            onOK={handleSignature}
            onEmpty={() => Alert.alert("Please provide a signature")}
            autoClear={false}
            descriptionText="Sign below"
            webStyle={`
        .m-signature-pad--footer {display:none;}
      `}
          />
        </View>
      )}
      {signing && (
        <View style={styles.signingOverlay}>
          <ActivityIndicator size="large" color="#1e457e" />
          <Text style={styles.signingText}>Applying signature...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F8F9FA" },
  container: { flex: 1, padding: 20, justifyContent: "space-between" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  previewCard: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginVertical: 40,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  successText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e457e",
    marginTop: 20,
  },
  subText: { fontSize: 14, color: "#666", marginTop: 8 },
  footer: { flexDirection: "row", gap: 12 },
  btn: {
    flex: 1,
    flexDirection: "row",
    height: 50,
    backgroundColor: "#1e457e",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  btnOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#1e457e",
  },
  btnText: { color: "#FFF", fontWeight: "600" },
  btnOutlineText: { color: "#1e457e", fontWeight: "600" },
  pdfViewer: {
    flex: 1,
    width: "100%",
  },
  pdfContainer: {
    flex: 1,
    marginVertical: 20,
    borderRadius: 12,
    overflow: "hidden", // Ensures the PDF respects the container's rounded corners
    backgroundColor: "#FFF",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  signingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.85)",
    justifyContent: "center",
    alignItems: "center",
  },

  signingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#1e457e",
    fontWeight: "500",
  },
});
