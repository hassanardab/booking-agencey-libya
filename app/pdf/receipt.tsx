//app/pdf/receipt.tsx

import { Ionicons } from "@expo/vector-icons";
import fontkit from "@pdf-lib/fontkit";
import { Buffer } from "buffer"; // needed for base64 conversion
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system"; // new FileSystem API
import * as Print from "expo-print";
import { Stack, useLocalSearchParams } from "expo-router";
import * as Sharing from "expo-sharing";
import { PDFDocument } from "pdf-lib";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Pdf from "react-native-pdf";
import { SafeAreaView } from "react-native-safe-area-context";
import SignatureScreen from "react-native-signature-canvas";

export default function ReceiptPreview() {
  const { pdfUri, entryId } = useLocalSearchParams();
  const { t } = useTranslation();

  const [uri, setUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSignature, setShowSignature] = useState(false);
  const [signing, setSigning] = useState(false);

  const signatureRef = useRef<any>(null);

  useEffect(() => {
    if (pdfUri) {
      setUri(pdfUri as string);
    }
    setLoading(false);
  }, [pdfUri]);

  const sharePdf = async () => {
    if (!uri) return;
    await Sharing.shareAsync(uri, {
      UTI: ".pdf",
      mimeType: "application/pdf",
    });
  };

  const printPdf = async () => {
    try {
      if (!uri) return;
      await Print.printAsync({
        uri,
        orientation: Print.Orientation.landscape,
      });
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Unable to print PDF.");
    }
  };

  const signPdf = () => {
    setShowSignature(true);
  };

  const handleSignature = async (signature: string) => {
    try {
      setShowSignature(false);
      if (!pdfUri) return;

      setSigning(true);

      // 1. Load existing PDF as base64 using new FileSystem API
      const existingFile = new FileSystem.File(pdfUri as string);
      const existingBase64 = await existingFile.base64();

      // 2. Load PDF with pdf-lib
      const pdfDoc = await PDFDocument.load(
        Buffer.from(existingBase64, "base64"),
      );

      // 3. Embed signature image
      const signatureBase64 = signature.replace("data:image/png;base64,", "");
      const pngImage = await pdfDoc.embedPng(signatureBase64);

      // 4. Scale image to fit nicely
      const MAX_SIGNATURE_WIDTH = 140;
      const pngDims = pngImage.scale(1);
      const scale = MAX_SIGNATURE_WIDTH / pngDims.width;

      // register fontkit
      pdfDoc.registerFontkit(fontkit);

      // load font asset
      const fontAsset = Asset.fromModule(
        require("@/assets/fonts/NotoSans-Regular.ttf"),
      );

      await fontAsset.downloadAsync();

      // read font file
      const fontFile = new FileSystem.File(fontAsset.localUri ?? fontAsset.uri);
      const fontBytes = await fontFile.arrayBuffer();

      // embed font
      const notoFont = await pdfDoc.embedFont(fontBytes);

      // 5. Embed standard font (Helvetica)

      // 6. Draw signature on last page
      const pages = pdfDoc.getPages();
      const lastPage = pages[pages.length - 1];

      lastPage.drawImage(pngImage, {
        x: 300,
        y: 5,
        width: pngDims.width * scale,
        height: pngDims.height * scale,
      });

      // 7. Add a small caption

      // lastPage.drawText(t("pdf.receipt.singed"), {
      //   x: 250,
      //   y: 80,
      //   size: 10,
      //   font: notoFont,
      //   color: rgb(0.3, 0.3, 0.3),
      // });

      // 8. Save the modified PDF
      const pdfBytes = await pdfDoc.save();
      const newBase64 = Buffer.from(pdfBytes).toString("base64");

      // 9. Write to cache using new FileSystem API
      const signedFile = new FileSystem.File(
        FileSystem.Paths.cache,
        `receipt_signed_${entryId}.pdf`,
      );
      await signedFile.write(newBase64, { encoding: "base64" });

      // 10. Update URI to show the signed PDF
      setUri(signedFile.uri);
      // Alert.alert("Success", "PDF signed successfully.");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to sign PDF.");
    } finally {
      setSigning(false);
    }
  };

  const clearSignature = () => {
    signatureRef.current?.clearSignature();
  };

  const confirmSignature = () => {
    setSigning(true);
    signatureRef.current?.readSignature();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1e457e" />
        <Text style={{ marginTop: 10 }}>Generating Receipt...</Text>
      </View>
    );
  }

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

        <View style={styles.pdfContainer}>
          {uri ? (
            <Pdf
              trustAllCerts={false}
              source={{ uri }}
              style={styles.pdfViewer}
              onLoadComplete={(numberOfPages) => {
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
              .m-signature-pad--footer { display: none; }
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
    overflow: "hidden",
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
