//services/pdf/receiptTemplate.ts
export async function buildReceiptHtml(event: any, entry: any, logo: string) {
  const staticEvent = {
    customerName: "السيد / أحمد محمد",
    venue: "قاعة الأندلس",
    amount: 1500,
    currency: "LYD",
    startDate: "20 مارس 2025",
  };
  const staticEntry = {
    receiptNumber: "REC-123456",
    date: "15 مارس 2025",
    amount: 500,
  };
  const remaining = staticEvent.amount - staticEntry.amount;
  // Helper for Arabic date (if needed)
  const formatDateArabic = (dateStr: string) => dateStr; // already Arabic

  return `
  <html dir="rtl">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      * {
        margin: 0;
        padding: 3;
        box-sizing: border-box;
      }
      body {
        font-family: Arial, sans-serif;
        background: white;
        color: #1e457e;
        padding: 5px;
      }
      .container {
        max-width: 100%;
        margin: 0 auto;
      }
      /* Header */
      .header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        border-bottom: 2px solid #dbeafe;
        padding-bottom: 1px;
        margin-bottom: 1px;
      }
      .company-info {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }
      .company-name {
        font-size: 20px;
        font-weight: 900;
        letter-spacing: -0.5px;
        color: #1e3a8a;
      }
      .slogan {
        font-size: 14px;
        font-weight: 700;
        color: #1e457e;
        opacity: 0.8;
      }
      .badge {
        margin-top: 8px;
        margin-bottom: 8px;
        background-color: #eff6ff;
        border-radius: 9999px;
        border: 1px solid #dbeafe;
        padding: 4px 12px;
        font-size: 14px;
        font-weight: 700;
        color: #1e457e;
      }
      .receipt-number {
        text-align: center;
      }
      .receipt-label {
        font-size: 12px;
        font-weight: 700;
        color: #9ca3af;
        letter-spacing: 1px;
        margin-bottom: 4px;
      }
      .receipt-value {
        color: #ef4444;
        font-weight: 900;
        font-size: 28px;
        font-family: monospace;
        background-color: #fef2f2;
        padding: 4px 16px;
        border-radius: 8px;
        border: 1px solid #fee2e2;
      }
      .logo {
        width: 120px;
        height: 120px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .logo img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }
      .logo-placeholder {
        width: 100%;
        height: 100%;
        background-color: #eff6ff;
        border-radius: 9999px;
        border: 2px solid #dbeafe;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #bfdbfe;
        font-weight: 700;
      }

      /* Two‑column layout */
      .main-layout {
        display: flex;
        gap: 3px;
      }
      .table-section {
        width: 75%;
      }
      .contact-section {
        width: 25%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      /* Grid table */
      .grid-table {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        border-top: 2px solid #1e457e;
        border-right: 2px solid #1e457e;
        background-color: #fcfcfc;
      }
      .grid-cell {
        border-bottom: 2px solid #1e457e;
        border-left: 2px solid #1e457e;
        padding: 0px;
        min-height: 80px;
      }
      .grid-cell .label {
        font-size: 12px;
        font-weight: 700;
        color: #9ca3af;
        display: block;
        margin-bottom: 4px;
      }
      .grid-cell .value {
        font-size: 18px;
        font-weight: 900;
        color: #1e457e;
      }
      .grid-cell .value small {
        font-size: 12px;
        font-weight: 700;
        color: #6b7280;
        margin-right: 4px;
      }
      .amount-highlight {
        background-color: rgba(239, 246, 255, 0.3);
      }
      .remaining-cell {
        background-color: rgba(254, 226, 226, 0.2);
      }
      .remaining-value {
        color: #dc2626;
        font-size: 24px;
      }
      .signature-row {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        width: 100%;
      }
      .signature-field {
        display: flex;
        flex-direction: column;
      }
      .signature-field .label {
        margin-bottom: 24px;
      }
      .signature-line {
        border-bottom: 1px solid #d1d5db;
        width: 128px;
      }

      /* Contact panel */
      .stamp-area {
        border: 2px dashed #bfdbfe;
        height: 160px;
        border-radius: 12px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-bottom: 24px;
        background-color: rgba(239, 246, 255, 0.1);
        position: relative;
      }
      .stamp-text {
        font-weight: 700;
        color: #d1d5db;
        font-size: 22px;
        transform: rotate(-12deg);
      }
      .stamp-border {
        position: absolute;
        inset: 8px;
        border: 2px solid #dbeafe;
        border-radius: 8px;
        pointer-events: none;
      }
      .contact-list {
        background-color: #f9fafb;
        padding: 0px;
        border-radius: 12px;
        border: 1px solid #f3f4f6;
        display: flex;
        flex-direction: column;
        gap: 0px;
      }
      .contact-header {
        font-size: 10px;
        color: #9ca3af;
        display: block;
        margin-bottom: 2px;
      }
      .contact-item {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 8px;
        color: #1e457e;
        font-weight: 700;
      }
      .contact-item span {
        font-size: 12px;
        direction: ltr;
      }
      .contact-icon {
        width: 16px;
        height: 16px;
        background-color: #3b82f6;
        border-radius: 4px;
      }
      /* Footer */
      .footer {
        margin-top: 8px;
        text-align: center;
        font-size: 10px;
        color: #9ca3af;
        border-top: 1px solid #f3f4f6;
        padding-top: 4px;
        font-style: italic;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <!-- Header -->
      <div class="header">
        <div class="company-info">
          <div class="company-name">فرقة نسمة الجنوب</div>
          <div class="slogan">لإحياء المناسبات الإجتماعية</div>
          <div class="slogan">بقيادة الأستاذة عويشة</div>
        </div>
        <div class="receipt-number">
          <div class="badge">سند قبض</div>
          <div class="receipt-value">${staticEntry.receiptNumber}</div>
        </div>
        <div class="logo">
          <img src="${logo}" />
        </div>
      </div>

      <!-- Main two‑column layout -->
      <div class="main-layout">
        <!-- Grid table (right side) -->
        <div class="table-section">
          <div class="grid-table">
            <!-- Row 1: Received from + Date -->
            <div class="grid-cell" style="grid-column: span 4;">
              <span class="label">وصلنا من السيد / السادة:</span>
              <span class="value">${staticEvent.customerName}</span>
            </div>
            <div class="grid-cell" style="grid-column: span 2;">
              <span class="label">بتاريخ:</span>
              <span class="value">${staticEntry.date}</span>
            </div>

            <!-- Row 2: Amount + Event place -->
            <div class="grid-cell amount-highlight" style="grid-column: span 2;">
              <span class="label">مبلغ وقدره:</span>
              <div class="value">
                ${staticEntry.amount.toLocaleString("en-EG")}
                <small>${staticEvent.currency}</small>
              </div>
            </div>
            <div class="grid-cell" style="grid-column: span 4;">
              <span class="label">وذلك عن (مكان المناسبة):</span>
              <span class="value">${staticEvent.venue}</span>
            </div>

            <!-- Row 3: Total booking + Event date -->
            <div class="grid-cell" style="grid-column: span 2;">
              <span class="label">إجمالي قيمة الحجز:</span>
              <div class="value">
                ${staticEvent.amount.toLocaleString("en-EG")}
                <small>${staticEvent.currency}</small>
              </div>
            </div>
            <div class="grid-cell" style="grid-column: span 4;">
              <span class="label">تاريخ المناسبة:</span>
              <span class="value">${staticEvent.startDate}</span>
            </div>

            <!-- Row 4: Remaining + Signatures -->
            <div class="grid-cell remaining-cell" style="grid-column: span 2;">
              <span class="label">المتبقي:</span>
              <div class="value remaining-value">
                ${remaining.toLocaleString("en-EG")}
                <small>${staticEvent.currency}</small>
              </div>
            </div>
            <div class="grid-cell" style="grid-column: span 4;">
              <div class="signature-row">
                <div class="signature-field">
                  <span class="label">توقيع المستلم:</span>
                  <div class="signature-line"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact & Stamp Panel (left side) -->
        <div class="contact-section">
          <div class="stamp-area">
            <div class="stamp-text">ختم الشركة</div>
            <div class="stamp-border"></div>
          </div>
          <div class="contact-list">
            <span class="contact-header">للتــواصل:</span>
            <div class="contact-item">
              <span>@nashwan_aljanoub</span>
              <div class="contact-icon" style="background: #1877f2;"></div>
            </div>
            <div class="contact-item">
              <span>@nashwan_aljanoub</span>
              <div class="contact-icon" style="background: #e4405f;"></div>
            </div>
            <div class="contact-item">
              <span>+218 91 234 5678</span>
              <div class="contact-icon" style="background: #25d366;"></div>
            </div>
            <div class="contact-item">
              <span>nashwan.ly</span>
              <div class="contact-icon" style="background: #000;"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        * يعتبر هذا السند تأكيداً لعملية الدفع المذكورة أعلاه. يرجى الاحتفاظ به لضمان حقوقكم.
      </div>
    </div>
  </body>
  </html>
  `;
}
function loadLogo() {
  throw new Error("Function not implemented.");
}
