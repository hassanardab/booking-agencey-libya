// services/pdf/agreementTemplate.ts

interface AgreementData {
  event: {
    customerName: string;
    amount: number;
    currency: string;
    place: string;
    startDate: Date | string; // can be Date object or ISO string
  };
  allPayments: Array<{ amount: number }>;
  currentCompany: {
    name: string;
    businessModel?: string;
    slogan?: string;
    logoUrl?: string;
  };
}

export function buildAgreementHtml(
  event: any,
  allPayments: any,
  logo: string,
): string {
  // Calculate financials
  const totalPaid = 622;

  const remaining = (event.amount || 0) - totalPaid;

  // Format dates
  const formatDate = (date: Date | string): string => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("en-EG"); // e.g. "٢٠/٣/٢٠٢٥"
  };
  const today = new Date().toLocaleDateString("en-EG");
  const eventDate = formatDate(event.startDate);

  return `
<!DOCTYPE html>
<html dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: Arial, sans-serif;
      direction: rtl;
      line-height: 1.6;
      font-size: 14px;
      display: flex;
      justify-content: center;
      padding: 20px;
    }
    .agreement-container {
      color: #000;
      max-width: 800px;
      width: 100%;
      padding: 30px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }
    /* Header - single row */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    .company-text {
      display: flex;
      flex-direction: column;   
      gap: 2px;                  
    }
    .company-text-main {
      font-weight: bold;
      font-size: 14px;
    }
    .company-text-slogn {
      font-weight: bold;
      font-size: 14px;
    }

    .logo {
      width: 100px;
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .logo img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
    /* Separator */
    .separator {
      width: 100%;
      height: 1px;
      background-color: #000;
      margin: 14px 0;
      border-radius: 9999px;
    }
    /* Three‑column row */
    .details-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
    }
    .details-col {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    .detail-item {
      display: flex;
      align-items: baseline;
      gap: 2px;
    }
    .detail-label {
      white-space: nowrap;
    }
    .detail-value {
      font-size: 14px;
      font-weight: 600;
    }
    /* Terms */
    .terms-title {
      font-weight: bold;
      text-decoration: underline;
      margin-bottom: 1px;
      font-size: 14px;
    }
    .terms-intro {
      margin-bottom: 10px;
      font-weight: bold;
    }
    .terms-list {
      list-style-type: none;
      padding: 0;
      margin: 0;
    }
    .terms-list li {
      margin-bottom: 5px;
      text-align: justify;
    }
    /* Print footer */
    .print-footer {
      display: none;
      background-color: #2b2b2b;
      color: #fff;
      text-align: center;
      padding: 5px;
      margin-top: 5px;
      font-weight: bold;
      direction: rtl;
    }
    @media print {
      body {
        background: white;
        padding: 0;
      }
      .agreement-container {
        box-shadow: none;
        padding: 14px;
      }
      .print-footer {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 4px;
        margin-top: 15px;
      }
    }
    /* Signatures */
    .signatures {
      display: flex;
      justify-content: space-between;
      margin-top: 14px;
      font-weight: bold;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="agreement-container">
    <!-- Header row: company text + logo -->
    <div class="header">
      <div class="company-text">
        <span>فرقة نسمة الجنوب</span>
        <span>لإحياء المناسبات الإجتماعية</span>
        <span>بقيادة الأستاذة عويشة</span>
      </div>
      <div class="logo">
        <img src="${logo}" />
      </div>
    </div>

    <!-- Separator line below header -->
    <div class="separator"></div>

    <!-- Main details (three columns) -->
    <div class="details-row">
      <div class="details-col">
        <div class="detail-item">
          <span class="detail-label">الحجز بإسم /</span>
          <span class="detail-value">${event.customerName}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">القيمة الإجمالية /</span>
          <span class="detail-value">${event.currency} ${event.amount.toLocaleString("en-EG")}</span>
        </div>
      </div>

      <div class="details-col">
        <div class="detail-item">
          <span class="detail-label">المبلغ المدفوع وقدره /</span>
          <span class="detail-value">${event.currency} ${totalPaid.toLocaleString("en-EG")}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">المبلغ المتبقي وقدره /</span>
          <span class="detail-value">${event.currency} ${remaining.toLocaleString("en-EG")}</span>
        </div>
      </div>

      <div class="details-col">
        <div class="detail-item">
          <span class="detail-label">مكان المناسبة /</span>
          <span class="detail-value">${event.place}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">تاريخ المناسبة :</span>
          <span class="detail-value">${eventDate}</span>
        </div>
      </div>
    </div>

    <!-- Terms and conditions header + contract date -->
    <div style="display: flex; justify-content: space-between; margin: 1px 0 1px;">
      <div class="terms-title">شروط الحجز:-</div>
      <div class="detail-item">
        <span class="detail-label">تاريخ العقد :</span>
        <span class="detail-value">${today}</span>
      </div>
    </div>

    <div class="terms-intro">
      زبوننا الكريم أهلاً وسهلاً بك، يسرني اختيارك لفرقتنا لمشاركتك في إحياء
      مناسباتك السعيدة ، ولكي تكون مناسبتك على أكمل وجه ومصداقية تامة يسرنا
      ويسعدنا قراءة هذه البنود لكي تكون قاعدة أساسية تحدد حقوق وواجبات بين
      الأطراف المتعاقدة وهي كالآتي:-
    </div>

    <ul class="terms-list">
      <li>1- في حالة إلغاء الحجز لأي ظرف لا يتم إرجاع العربون.</li>
      <li>2- لضرورة الأمر وحفاظاً على الطرفين يفضل استكمال الإجراءات المالية داخل المكتب ورجاءاً التعامل داخل المكتب مع العنصر النسائي فقط لا غير.</li>
      <li>3- يرجى استكمال باقي المبلغ المتفق عليه في غضون 15 يوما قبل موعد المناسبة، وإذا لم يتم ذلك، سيتم إلغاء العقد المبرم لعدم احترام الشروط المتفق عليها ، كما أن المكتب غير مسؤول عن أي تخلف قد يصدر من الزبون .</li>
      <li>4- نرفض تماما مشاركة فرق أخرى يوم المناسبة التزاماً منا على تحديد الوصلات دون ارباك او ما يعيق سير نظام الفرقة ، وفي حال عدم الالتزام وعدم إحترام شروط المكتب ، سيتم إلغاء العقد المبرم وإنهاء الحجز وسقوط كل الحقوق المتفق عليها وعدم استرجاع المبلغ المستلم بالكامل.</li>
      <li>5- في حال إلغاء الحجز من قبل الزبون لأي سبب من الأسباب، لن يتم استرجاع العربون المدفوع . وهذا متفق عليه قانونيا ، وسيبقى الحجز مفتوحا لمدة 6 أشهر من تاريخ التبليغ لإعادة تحديد موعد جديد. وإذا لم يتم تحديد موعد جديد خلال هذه الفترة سيتم الغاء الحجز نهائيا.</li>
      <li>6- عند إلغاء الحجز من طرف الزبون أو طلب تغييره يتوجب عليه دفع غرامة وقدرها 1000 دينار ليبي.</li>
      <li>7- لا يسمح بإلغاء الحجز في نفس الشهر المحدد مسبقاً ، وهذا مما سبب في اضاعة الفرص لبعض الزبائن تحجز هذا اليوم ولن يقبل تراجع الزبون عن موعده والغاء الحجز لأي سبب من الأسباب وأن يسمح باسترجاع المبلغ المدفوع نهائياً.</li>
      <li>8- عند تغير موعد المناسبة يفضل إسترجاع العقد السابق ويفضل الحضور شخصي وأن يعتد بغير ذلك لا عن طريق الهاتف أو عن طريق إرسال وسيط.</li>
      <li>9- يرجى ترك ارقام هواتف مفتوحة للاستفسار والتواصل لأي ظرف طاريء.</li>
      <li>10- بخصوص الحفلات والمناسبات الخارجية مثلا ( السعودية ، مصر ، تونس، فرنسا، تركيا، أو أي بلد اخر ) سوف تكون تكاليف السفر والإقامة على الزبون الكريم، ويحق لنا اختيار مكان الاقامة وذلك تفاديا للإختيار الخاطيء وضمانة جودتها.</li>
      <li>11- في حالة حدوث أي ظروف للفنانة مما يمنع حضورها للحفل سيتم تبليغكم قبل الموعد وذلك حفاظاً على مصداقية المكتب ، ولكم الخيار في استرجاع القيمة لحجز جهه أخرى أو ترك المجال للمكتب للتصرف ودعوة فنانه بديلة.</li>
    </ul>

    <!-- Footer note -->
    <div style="text-align: center; font-weight: bold; margin-top: 5px; font-size: 14px;">
      لكم منا كل الاحترام والتقدير سلفاً
    </div>

    <!-- Signatures -->
    <div class="signatures">
      <div>توقيع الطرف الأول/ المكتب</div>
      <div>توقيع الطرف الثاني/ الزبون</div>
    </div>

  <!-- Print‑only footer with contact info -->
  <div class="print-footer">
    واتس اب 0919395770 - هاتف 0923765263 - فيسبوك عويشة نسمة الجنوب - انستقرام <span dir="ltr">awisha ellibya</span>
  </div>
  </div>

</body>
</html>
  `;
}
