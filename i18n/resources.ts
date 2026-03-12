// i18n/resources.ts
export const resources = {
  en: {
    translation: {
      welcome: "Welcome back",

      //App bar
      "dashboard.title": "Dashboard",
      "settings.title": "Settings",
      "activites.title": "Activites",

      //dashborad
      "dashboard.view.calendar": "View Calendar",
      "dashboard.upcoming.events": "Upcoming Events",
      "dashboard.postponed.events": "Postponed Events",

      "dashboard.search.hint": "Search events, clients...",
      "dashboard.filter.today": "Today",
      "dashboard.filter.week": "Week",
      "dashboard.filter.month": "Month",
      "dashboard.filter.custom": "Custom",
      "dashboard.stats.cash": "Cash Revenue",
      "dashboard.stats.bank": "Bank Revenue",
      "dashboard.stats.unpaid": "Unpaid",
      "dashboard.stats.events": "Events",
      "dashboard.filter.range": "Range Events",

      //Stats list
      "stats.title.cash": "Cash Payments",
      "stats.title.bank": "Bank Payments",
      "stats.title.unpaid": "Unpaid Payments",
      "stats.title.events": "Events",
      "stats.discription.showing": "Showing",

      "stats.status.confirmed": "Confirmed",
      "stats.status.postponed": "Postponed",
      "stats.status.partially_paid": "Partially Paid",

      langName: "English",
      bookingLogic: "Booking Logic",
      //pdf receipt
      "pdf.receipt.singed": "Signed electronically",

      // Create/Edit Event Form
      "event.form.header.new": "New Booking",
      "event.form.header.edit": "Edit Booking",
      "event.form.label.details": "Event Details",
      "event.form.label.customer": "Customer Name",
      "event.form.label.phone": "Phone Number",
      "event.form.label.amount": "Total Amount",
      "event.form.label.date": "Date & Time",
      "event.form.label.payment": "Payment",
      "event.form.label.paid": "Paid Amount",
      "event.form.label.notes": "Internal Notes",

      "event.form.placeholder.title": "e.g. Wedding Photography",
      "event.form.placeholder.customer": "Full Name",
      "event.form.placeholder.notes": "Any specific requirements...",

      "event.form.method.cash": "Cash",
      "event.form.method.card": "Card",
      "event.form.method.transfer": "Transfer",

      "event.form.action.cancel": "Cancel",
      "event.form.action.save": "Create Booking",
      "event.form.action.update": "Update Booking",

      // Event Details Page
      "event.details.not_found": "Event not found",
      "event.details.whatsapp.btn": "Send WhatsApp",
      "event.details.whatsapp.msg":
        "Hello {{name}}, regarding your booking on {{date}}...",

      "event.details.section.financial": "Financial Overview",
      "event.details.label.total": "Total",
      "event.details.label.paid": "Paid",
      "event.details.label.remaining": "Remaining",

      "event.details.section.timeline": "Payment Timeline",
      "event.details.timeline.empty": "No payments recorded",
      "event.details.timeline.receipt": "A5 Receipt",
      "event.details.timeline.recorded_by": "Recorded by: {{user}}",

      "event.details.section.actions": "Quick Actions",
      "event.details.action.contract": "Contract",
      "event.details.action.postpone": "Postpone",
      "event.details.action.edit": "Edit Event",
      "event.details.action.delete": "Delete",

      //Agreement print
      "event.contract.sign.button": "Sign",
      "event.contract.print.page": "Agreement Ready",
      "event.contract.agreement.button": "Print",
      "event.contract.agreement.generating": "Generating Agreemnet...",
      "event.contract.signature.apply": "Applying signature...",
      "event.contract.load.failed": "Failed to load PDF preview.",
      "event.contract.clear.button": "Clear",
      "event.contract.confirm.button": "Confirm",

      //Receipt print
      "event.receipt.sign.button": "Sign",
      "event.receipt.print.page": "Receipt Ready",
      "event.receipt.agreement.button": "Print",
      "event.receipt.agreement.generating": "Generating receipt...",
      "event.receipt.signature.apply": "Applying signature...",
      "event.receipt.load.failed": "Failed to load PDF preview.",
      "event.receipt.clear.button": "Clear",
      "event.receipt.confirm.button": "Confirm",

      // Add payment form
      "event.add.options.title": "Payment Options",
      "event.add.options.dis": "Choose an action for this transaction",
      "event.add.options.receipt": "View Receipt",
      "event.add.options.edit": "Edit",
      "event.add.options.delete": " Delete",
      "event.add.options.delete_msg": " Transaction removed",
      "event.add.options.cancel": " Cancel",
      "event.add.journal.dis": "New payment",
      "event.add.journal.success": "Success",
      "event.add.journal.success_msg": "Payment added successfully",

      "event.edit.no.payments": "No payments recorded",

      "loading.indicatior": "Loading...",

      // Alerts & States
      "event.details.alert.delete.title": "Delete Event",
      "event.details.alert.delete.msg":
        "Are you sure you want to delete this event?",
      "event.details.alert.delete.confirm": "Delete",

      "event.details.alert.postpone.title": "Postponed Event",
      "event.details.alert.postpone.msg":
        "Are you sure you want to postpone this event?",

      "event.details.alert.cancel": "Cancel",
      "event.details.alert.success.postpone": "Event postponed",
      "event.details.loading": "Loading...",
      "event.details.error.pdf": "Could not generate document",

      // ===== Settings Page =====
      "settings.section.app_settings": "App Settings",
      "settings.section.language": "Language",
      "settings.font_size": "Font Size",
      "settings.default": "Default",
      "settings.notifications": "Notifications",
      "settings.dark_mode": "Dark Mode",

      "settings.section.organization": "Organization",
      "settings.company.name": "Nexus Creative Ltd.",
      "settings.company.slogan": "Innovating the future of events",
      "settings.company.business_model": "Business Model",
      "settings.company.business_model_value": "B2B Enterprise",
      "settings.company.registration": "Registration",
      "settings.company.registration_value": "#9920-X12",

      "settings.currency": "Currency",
      "settings.start_of_week": "Start of Week",

      // Days (used for start of week)
      "days.monday": "Monday",

      "settings.max_bookings_per_day": "Max Bookings/Day",
      "settings.unpaid_reminder": "Unpaid Reminder",
      "settings.unpaid_reminder.24h_before": "24 Hours Before",

      "settings.section.support": "Support",
      "settings.developer_mode": "version",
      "settings.contact_support_bot": "Contact Support Bot",

      "settings.footer": "Built with ❤️ by DevTeam • 2026",
    },
  },
  ar: {
    translation: {
      welcome: "مرحباً بك مجدداً",

      //App bar
      "dashboard.title": "الرئيسية",
      "settings.title": "الإعدادات",
      "activites.title": "السجل",

      //dashborad
      "dashboard.view.calendar": "فتح التقويم",
      "dashboard.upcoming.events": "الحجوزات القادمة",
      "dashboard.postponed.events": "الحجوزات المؤجلة",

      "dashboard.search.hint": "ابحث عن الأحداث، العملاء...",
      "dashboard.filter.today": "اليوم",
      "dashboard.filter.week": "الأسبوع",
      "dashboard.filter.month": "الشهر",
      "dashboard.filter.custom": "مخصص",
      "dashboard.stats.cash": "الإيرادات النقدية",
      "dashboard.stats.bank": "إيرادات البنك",
      "dashboard.stats.unpaid": "غير مدفوع",
      "dashboard.stats.events": "أحداث",
      "dashboard.filter.range": "الأحداث خلال الفترة",

      //Stats list
      "stats.title.cash": "الدفع النقدي",
      "stats.title.bank": "التحويلات المصرفية",
      "stats.title.unpaid": "مبالغ غير مسددة",
      "stats.title.events": "الحجوزات",
      "stats.discription.showing": "إجمالي الحجوزات",

      "stats.status.confirmed": "مؤكد",
      "stats.status.postponed": "مؤجل",
      "stats.status.partially_paid": "مدفوع جزئياً",

      langName: "العربية",
      bookingLogic: "إعدادات الحجوزات",

      //pdf receipt
      "pdf.receipt.singed": "توقيع إلكتروني",

      // Create/Edit Event Form
      "event.form.header.new": "حجز جديد",
      "event.form.header.edit": "تعديل الحجز",
      "event.form.label.details": "تفاصيل الحجز",
      "event.form.label.customer": "اسم الزبون",
      "event.form.label.phone": "رقم الهاتف",
      "event.form.label.amount": "القيمة الإجمالية",
      "event.form.label.date": "التاريخ والوقت",
      "event.form.label.payment": "طريقة الدفع",
      "event.form.label.paid": "المبلغ المدفوع",
      "event.form.label.notes": "ملاحظات داخلية",

      "event.form.placeholder.title": "مثلاً: تصوير حفل زفاف",
      "event.form.placeholder.customer": "الاسم الثلاثي",
      "event.form.placeholder.notes": "أي متطلبات أو شروط خاصة...",

      "event.form.method.cash": "نقدي",
      "event.form.method.card": "بطاقة",
      "event.form.method.transfer": "تحويل مصرفي",

      "event.form.action.cancel": "إلغاء",
      "event.form.action.save": "إضافة الحجز",
      "event.form.action.update": "تعديل الحجز",

      // Event Details Page
      "event.details.not_found": "لم يتم العثور على الحجز",
      "event.details.whatsapp.btn": "إرسال واتساب",
      "event.details.whatsapp.msg":
        "مرحباً {{name}}، بخصوص حجزك بتاريخ {{date}}...",

      "event.details.section.financial": "الملخص المالي",
      "event.details.label.total": "الإجمالي",
      "event.details.label.paid": "المدفوع",
      "event.details.label.remaining": "المتبقي",

      "event.details.section.timeline": "سجل المدفوعات",
      "event.details.timeline.empty": "لا توجد دفعات مسجلة",
      "event.details.timeline.receipt": "الإيصال",
      "event.details.timeline.recorded_by": "سُجل بواسطة: {{user}}",

      "event.details.section.actions": "إجراءات سريعة",
      "event.details.action.contract": "العقد",
      "event.details.action.postpone": "تأجيل",
      "event.details.action.edit": "تعديل",
      "event.details.action.delete": "حذف",

      //Agreement print
      "event.contract.sign.button": "توقيع",
      "event.contract.print.page": "العقد جاهز",
      "event.contract.agreement.button": "طباعة",
      "event.contract.agreement.generating": "جاري إنشاء العقد...",
      "event.contract.signature.apply": "جاري إضافة التوقيع...",
      "event.contract.load.failed": "فشل تحميل معاينة ملف PDF.",
      "event.contract.clear.button": "مسح",
      "event.contract.confirm.button": "تأكيد",

      //Agreement print
      "event.receipt.sign.button": "توقيع",
      "event.receipt.print.page": "الإيصال جاهز",
      "event.receipt.agreement.button": "طباعة",
      "event.receipt.agreement.generating": "جاري إنشاء الإيصال...",
      "event.receipt.signature.apply": "جاري إضافة التوقيع...",
      "event.receipt.load.failed": "فشل تحميل معاينة ملف PDF.",
      "event.receipt.clear.button": "مسح",
      "event.receipt.confirm.button": "تأكيد",

      // Add payment form
      "event.add.options.title": "خيارات الدفع",
      "event.add.options.dis": "اختر إجراءً لهذه المعاملة",
      "event.add.options.receipt": "عرض الإيصال",
      "event.add.options.edit": "تعديل",
      "event.add.options.delete": "حذف",
      "event.add.options.delete_msg": "تم حذف المعاملة",
      "event.add.options.cancel": "إلغاء",
      "event.add.journal.dis": "دفعة جديدة",
      "event.add.journal.success": "نجاح",
      "event.add.journal.success_msg": "تمت إضافة الدفعة بنجاح",

      "event.edit.no.payments": "لا توجد عمليات دفع مسجلة",

      "loading.indicatior": "لحظات...",

      // Alerts & States
      "event.details.alert.delete.title": "حذف الحجز",
      "event.details.alert.delete.msg": "هل أنت متأكد من حذف هذا الحجز؟",

      "event.details.alert.postpone.title": "تأجيل الحجز",
      "event.details.alert.postpone.msg":
        "هل أنت متأكد أنك تريد تأجيل هذا الحدث؟",

      "event.details.alert.delete.confirm": "حذف",
      "event.details.alert.cancel": "إلغاء",
      "event.details.alert.success.postpone": "تم تأجيل الحجز بنجاح",
      "event.details.loading": "جاري التحميل...",
      "event.details.error.pdf": "تعذر استخراج المستند",

      // ===== Settings Page =====
      "settings.section.app_settings": "إعدادات التطبيق",
      "settings.section.language": "اللغة",
      "settings.font_size": "حجم الخط",
      "settings.default": "افتراضي",
      "settings.notifications": "الإشعارات",
      "settings.dark_mode": "الوضع الداكن",

      "settings.section.organization": "المنظمة",
      "settings.company.name": "نيكسوس كرييتيف المحدودة",
      "settings.company.slogan": "نبتكر مستقبل الفعاليات",
      "settings.company.business_model": "نموذج العمل",
      "settings.company.business_model_value": "شركات B2B",
      "settings.company.registration": "رقم التسجيل",
      "settings.company.registration_value": "#٩٩٢٠-إكس١٢",

      "settings.currency": "العملة",
      "settings.start_of_week": "بداية الأسبوع",

      "days.monday": "الاثنين",

      "settings.max_bookings_per_day": "الحد الأقصى للحجوزات/يوم",
      "settings.unpaid_reminder": "تذكير الدفعات غير المدفوعة",
      "settings.unpaid_reminder.24h_before": "قبل ٢٤ ساعة",

      "settings.section.support": "الدعم",
      "settings.developer_mode": "النسخة",
      "settings.contact_support_bot": "تواصل مع بوت الدعم",

      "settings.footer": "بُني بـ ❤️ بواسطة فريق التطوير • ٢٠٢٦",
    },
  },
};
