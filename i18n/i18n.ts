import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { I18nManager } from "react-native";
import { resources } from "./resources";
// 1. Define

// 2. Detect language and set RTL
const deviceLanguage = Localization.getLocales()[0].languageCode ?? "en";
const isArabic = deviceLanguage === "ar";

// Force RTL if Arabic
if (I18nManager.isRTL !== isArabic) {
  I18nManager.allowRTL(isArabic);
  I18nManager.forceRTL(isArabic);
}

i18n.use(initReactI18next).init({
  resources,
  lng: deviceLanguage,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
