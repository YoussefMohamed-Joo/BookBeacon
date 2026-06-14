---
name: Book Beacon
description: Egyptian educational bookstore platform — ثانوية عامة
colors:
  primary: "#0098A4"
  primary-dark: "#007A83"
  accent: "#4EE7F3"
  navy-dark: "#0a1628"
  bg-light: "#F5F7FA"
  text-dark: "#FFFFFF"
  text-secondary-dark: "#a0c4c8"
  muted-dark: "#5a8a8e"
  danger: "#FF6B6B"
  card-bg-dark: "#0f2e30"
  border-dark: "rgba(255,255,255,0.06)"
  text-light: "#1a2a2b"
  text-secondary-light: "#4a6a6d"
  card-bg-light: "#FFFFFF"
  border-light: "#dde5e6"
typography:
  display:
    fontFamily: "Alexandria, system-ui, sans-serif"
    fontWeight: 800
  headline:
    fontFamily: "Alexandria, system-ui, sans-serif"
    fontWeight: 700
    fontSize: "1.5rem"
  title:
    fontFamily: "Alexandria, system-ui, sans-serif"
    fontWeight: 600
    fontSize: "1.125rem"
  body:
    fontFamily: "Alexandria, system-ui, sans-serif"
    fontWeight: 400
    fontSize: "0.9rem"
    lineHeight: 1.6
  label:
    fontFamily: "Alexandria, system-ui, sans-serif"
    fontWeight: 500
    fontSize: "0.75rem"
    letterSpacing: "0.05em"
rounded:
  card: "14px"
  btn: "10px"
  input: "10px"
  badge: "6px"
  modal: "16px"
  nav: "8px"
spacing:
  page-mobile: "0 1.5rem"
  page-desktop: "0 2rem"
  card-padding: "1rem"
  modal-padding: "1.5rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.text-dark}"
    rounded: "{rounded.btn}"
    padding: "0.6rem 1.5rem"
  button-primary-hover:
    backgroundColor: "{colors.primary-dark}"
    rounded: "{rounded.btn}"
    padding: "0.6rem 1.5rem"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.text-dark}"
    rounded: "{rounded.btn}"
    padding: "0.6rem 1.5rem"
  card-default:
    backgroundColor: "{colors.card-bg-dark}"
    rounded: "{rounded.card}"
    padding: "{spacing.card-padding}"
  input-default:
    backgroundColor: "rgba(255,255,255,0.05)"
    rounded: "{rounded.input}"
    padding: "0.7rem 1rem"
---

# Design System: Book Beacon

## 1. Overview

**Creative North Star: "Book Beacon"**

منصة مصرية لبيع الكتب الدراسية — تجمع بين الثقة والسلاسة والوضوح. النظام البصري مبني على تباين هادئ بين Navy العميق والـ Teal النابض، مع Alexandria كخط وحيد يخدم العربية والإنجليزية بانسيابية. الهدف: يشعر المستخدم إنه في مكان آمن وسريع وموثوق، مش إنه يتوه في زينة بصرية.

**Key Characteristics:**
- هوية مصرية واضحة — RTL، عربية، محافظات، جنيه مصري
- داكن بإضاءة — dark mode هو الأساس، light mode مريح بلا مفاجآت
- ناعم وودود — زوايا دائرية (10-14px)، ظلال جريئة، ترانزيشن ناعم
- أمين وسريع — تباين عالي، خط readable، ترتيب معلوماتي مباشر

## 2. Colors

لوحة تميل للبرودة والثقة: Navy يرسي الخلفية، Teal يقود التفاعل، Cyan يضيف لمعة.

### Primary
- **Primary Teal** (#0098A4): لون العلامة التجارية الرئيسي. يستخدم في الأزرار الأساسية، الروابط النشطة، العناصر التفاعلية، حدود التركيز (focus).
- **Primary Dark** (#007A83): حالة hover للـ Primary، أعمق وأكثر جدية.

### Accent
- **Accent Cyan** (#4EE7F3): يستخدم كإضاءة في أزرار CTA، highlight في البطاقات، وhover effects. إضافته محدودة ≤ 10% من الشاشة.

### Neutral
- **Navy Dark** (#0a1628): أساس الوضع الداكن. الخلفية الرئيسية مع تدرج (#0a1628 → #0d2a2d).
- **Bg Light** (#F5F7FA): أساس الوضع الفاتح.
- **Text Dark** (#FFFFFF): النص الأساسي في dark mode.
- **Text Light** (#1a2a2b): النص الأساسي في light mode.
- **Text Secondary Dark** (#a0c4c8): نصوص ثانوية، عناوين فرعية في dark.
- **Text Secondary Light** (#4a6a6d): نصوص ثانوية في light.
- **Muted Dark** (#5a8a8e): نصوص معتمة، placeholders في dark.
- **Card Dark** (#0f2e30): خلفية الكروت في dark mode.
- **Card Light** (#FFFFFF): خلفية الكروت في light mode.
- **Border Dark** (rgba(255,255,255,0.06)): حدود شفافة في dark.
- **Border Light** (#dde5e6): حدود في light mode.

### Semantic
- **Danger** (#FF6B6B): أخطاء، حذف، إلغاء.

### Named Rules
**The One Voice Rule.** اللون الرئيسي (Teal) لا يتجاوز 15% من مساحة الشاشة. ندرته هي قوته. Cyan أقل من 5%.

## 3. Typography

**Font Family:** Alexandria (Google Fonts) أوزان 300–800

**Character:** خط واحد عصري يجمع بين الوضوح العربي واللاتيني في آن. Alexandria يقدم ملامح هندسية ناعمة مع مسافات مفتوحة تناسب القراءة العربية الطويلة.

### Hierarchy
- **Display** (ExtraBold 800, 2.5–4.5rem): شاشة الهيرو والعناوين الكبرى فقط.
- **Headline** (Bold 700, 1.5rem): عناوين الأقسام.
- **Title** (SemiBold 600, 1.125rem): عناوين البطاقات والنماذج.
- **Body** (Regular 400, 0.9rem, line-height 1.6): النصوص الجارية والفقرة. طول السطر 65–75 حرف.
- **Label** (Medium 500, 0.75rem, tracking 0.05em): تسميات الأزرار، الجداول، الأعمدة.

### Named Rules
**The One Font Rule.** Alexandria هو الخط الوحيد. لا تزاوج مع خط آخر. التنوع يكون بالوزن (300–800) والحجم، لا بإضافة خط ثانٍ.

## 4. Elevation

ظلال جريئة وواضحة. العمق البصري وسيلة أساسية للتسلسل الهرمي — كل عنصر عائم يعلو فوق ما تحته بظل صريح.

### Shadow Vocabulary
- **Card** (`0 2px 8px rgba(0,0,0,0.15)`): ظل الكروت في حالة الراحة.
- **Card Hover** (`0 8px 24px rgba(0,152,164,0.15)`): ظل الكرت عند التمرير (hover) مع لمسة من لون العلامة.
- **Teal Glow** (`0 4px 14px rgba(0,152,164,0.3)`): الأزرار الأساسية عند hover.
- **Cyan Glow** (`0 4px 14px rgba(78,231,243,0.3)`): أزرار CTA عند hover.
- **Modal** (`0 16px 48px rgba(0,0,0,0.2)`): النوافذ المنبثقة.
- **Ambient Glow** (`0 0 20px rgba(0,152,164,0.1)`): توهج خلفي ناعم للعناصر المميزة.

## 5. Components

### Buttons

نوعان من الأزرار: طبقة CVA (Shadcn) للاستخدام العام، وطبقة كلاسيكية (CSS) للمهام الخاصة. كلها تشترك في الزوايا الدائرية 10px و transition 0.25s والضغط (scale 0.97) عند النقر.

- **Primary** (Teal #0098A4, نص أبيض، وزن 600): الزر الرئيسي. Hover → Primary Dark (#007A83) + Teal Glow.
- **CTA** (Accent Cyan #4EE7F3, نص Navy #0B1F3A, وزن 700): زر الدعوة للإجراء. Hover → Cyan Glow + رفع 1px.
- **Secondary** (شفاف، حدود بيضاء/شفافة، نص أبيض): زر ثانوي. Hover → حدود + نص بلون Teal + خلفية شفافة من Teal.
- **Danger** (Red #ef4444, نص أبيض, وزن 600): حذف وإلغاء. Hover → #dc2626 + Red Glow.
- **Success** (Green #10b981, نص أبيض): تأكيد وإتمام. Hover → #059669.
- **Info** (Teal #0098A4): معلومات عامة.
- **Ghost** (Shadcn): بدون خلفية، يظهر عند hover.
- **Link** (Shadcn): يشبه الرابط النصي.

### Cards

الكروت هي الحاوية الأساسية. زوايا دائرية (14px)، حد شفاف، وخلفية متباينة مع الـ bg.

- **Card Default**: خلفية (Card Dark/Light)، حد شفاف، زوايا 14px، ظل Card. Hover → رفع 4px + ظل Card Hover.
- **Glass Card**: خلفية شبه شفافة مع backdrop-filter blur(12px). للعناصر فوق الخلفيات المتدرجة.
- **Stat Card**: كرت إحصائي للوحة التحكم، خلفية متدرجة، hover برفع 2px.
- **Detail Card**: للتفاصيل، زوايا 12px، أقل ارتفاعاً من الكرت العادي.
- **Shadcn Card**: استخدام عام مع Card, CardHeader, CardTitle, CardContent, CardFooter.

### Inputs & Fields

حقول إدخال عملية بنمط بسيط.

- **Style**: خلفية (input-bg شفافة/بيضاء)، حد 1.5px (Border)، زوايا 10px، خط Alexandria 0.9rem.
- **Focus**: حد بلون Primary (#0098A4) + glow 3px (rgba 0.15).
- **Error/Disabled**: حسب السياق، danger للخطأ، opacity للـ disabled.

### Badges

علامات صغيرة inline.

- **Style**: padding 0.2rem 0.6rem، زوايا 6px، حجم 0.75rem، وزن 500.
- **Semantic**: danger (أحمر)، warning (أصفر)، success (أخضر)، info (أزرق).
- **Grade Colors**: أولى ثانوي (Emerald), تانية ثانوي (Blue), تالتة ثانوي (Purple).

### Navigation

- **TopBar**: شريط علوي، خلفية شفافة مع border سفلي، لوجو على اليمين، روابط سريعة.
- **Navbar**: روابط على شكل pills (زوايا 8px) بلون ثانوي. Hover → خلفية بيضاء شفافة + نص أبيض.
- **Nav Link Active**: Teal أو أبيض حسب السياق.

### Modals
- **Overlay**: خلفية سوداء نصف شفافة + backdrop-filter blur(4px)، z-index 100.
- **Content**: Card bg + border + زوايا 16px + ظل Modal (0 16px 48px) + max-width 420px.

### Tables
- **Admin Table**: عرض كامل، خلايا بحدود سفلية، hover بتأثير Teal شفاف. Header بأحرف uppercase + tracking 0.05em.

## 6. Do's and Don'ts

### Do:
- **Do** استخدم Teal (#0098A4) كلون رئيسي وحيد للتفاعلات.
- **Do** حافظ على زوايا دائرية 10-14px لكل العناصر.
- **Do** استخدم ظلال جريئة وصريحة — لا تخف من الظل.
- **Do** اعتمد على خط Alexandria وحده — التنوع بالوزن والحجم.
- **Do** اجعل الوضع الداكن هو الأساس والفاتح هو البديل.
- **Do** أضف transitions 0.25s ease لكل العناصر التفاعلية.
- **Do** أضف ضغط (scale 0.97) عند النقر على الأزرار.

### Don't:
- **Don't** تزوج خطاً ثانياً مع Alexandria. خط واحد يكفي.
- **Don't** تستخدم glassmorphism بدون سبب عملي.
- **Don't** تزاحم الشاشة بأكثر من 15% من Teal أو 5% من Cyan.
- **Don't** تهمش reduced motion — كل الحركات لازم يكون لها بديل صامت (media query).
- **Don't** تزحف النصوص — اختبر العناوين على كل الشاشات، صغر الـ clamp إذاoverflow.
- **Don't** تستخدم ألوان رمادية غير مرتبطة بالـ Navy أو Teal في النصوص الثانوية.
- **Don't** تنسى الـ RTL — الهوامش والاتجاهات مبنية على right-to-left.
