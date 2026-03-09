import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { I18nManager } from "react-native";

// 1. Define your translations
const resources = {
  en: {
    translation: {
      welcome: "Welcome back",

      //dashborad
      "dashboard.title": "Dashboard",
      "dashboard.view.calendar": "View Calendar",
      "dashboard.upcoming.events": "Upcoming Events",
      "dashboard.postponed.events": "Postponed Events",
      settings: "Settings",
      langName: "English",
      bookingLogic: "Booking Logic",

      "pdf.receipt.singed": "Signed electronically",
    },
  },
  ar: {
    translation: {
      welcome: "مرحباً بك مجدداً",

      //dashborad
      "dashboard.title": "لوحة التحكم",
      "dashboard.view.calendar": "فتح التقويم",
      "dashboard.upcoming.events": "الحجوزات القادمة",
      "dashboard.postponed.events": "الحجوزات المؤجلة",

      settings: "الإعدادات",
      langName: "العربية",
      bookingLogic: "منطق الحجز",

      "pdf.receipt.singed": "توقيع إلكتروني",
    },
  },
};

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
