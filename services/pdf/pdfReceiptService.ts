import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system/legacy";
import * as Print from "expo-print";

import { getEventById } from "../eventService";
import { buildReceiptHtml } from "./receiptTemplate";

const cache = new Map<string, string>();

async function loadLogoBase64() {
  const asset = Asset.fromModule(require("@/assets/images/icon.png"));
  await asset.downloadAsync();

  const uri = asset.localUri ?? asset.uri;

  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: "base64",
  });

  return `data:image/png;base64,${base64}`;
}
export async function generateReceiptPdf(eventId: string, entryId: string) {
  const key = `${eventId}_${entryId}`;
  if (cache.has(key)) return cache.get(key)!;

  const event = getEventById(eventId);

  const entry = {
    id: entryId,
    receiptNumber: "REC-99812",
    date: new Date().toLocaleDateString(),
    amount: event?.amount || 0,
  };

  const logo = await loadLogoBase64();

  const html = await buildReceiptHtml(event, entry, logo);

  const { uri } = await Print.printToFileAsync({
    html,
    base64: false,
    width: 595,
    height: 420,
  });

  cache.set(key, uri);
  return uri;
}
