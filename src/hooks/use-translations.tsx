"use client"

import React, { createContext, useContext, useState, useCallback } from 'react';

const translations = {
  en: {
    registration: {
      title: "Join the Queue",
      description: "Enter your details below to register for a consultation.",
      nameLabel: "Full Name",
      namePlaceholder: "e.g., John Doe",
      phoneLabel: "Phone Number",
      phonePlaceholder: "e.g., (123) 456-7890",
      nationalityLabel: "Nationality",
      nationalityPlaceholder: "Select your nationality",
      submitButton: "Register and See My Place"
    },
    patient: {
        welcome: "Welcome",
        description: "Follow your journey with us below. The status will update automatically.",
        steps: {
            registered: { title: "Registered", description: "You are in the system and waiting for reception." },
            waiting: { title: "Waiting for Doctor", description: "Reception has processed your request. Please wait for a doctor." },
            consultation: { title: "In Consultation", description: "You are now with the doctor." },
            service: { title: "Service Required", description: "Please go to the designated service room with your code." },
            completed: { title: "Completed", description: "Your visit is complete. Thank you!" }
        },
        message: {
            title: "Send a message to the doctor",
            description: "Describe your symptoms or ask a question.",
            placeholder: "Type your message here...",
            sentTitle: "Message Sent",
            sentDescription: "Your message has been sent to the doctor.",
        },
        action: {
            title: "Action Required",
            goToPharmacy: "Please proceed to the Pharmacy.",
            code: "Your Confirmation Code is"
        },
        prescription: {
            title: "Doctor's Prescription",
            description: "Please follow these instructions carefully.",
            translateButton: "Translate",
            translatingButton: "Translating...",
            drugHeader: "Drug / Service",
            dosageHeader: "Dosage",
            notesHeader: "Notes",
        },
        feedback: {
            thankYou: "Thank You!",
            prompt: "We appreciate you visiting. Please provide your feedback to help us improve.",
            button: "Give Feedback"
        }
    }
  },
  fa: {
    registration: {
      title: "به صف بپیوندید",
      description: "برای ثبت نام در مشاوره، اطلاعات خود را در زیر وارد کنید.",
      nameLabel: "نام کامل",
      namePlaceholder: "مثلا جان دو",
      phoneLabel: "شماره تلفن",
      phonePlaceholder: "مثلا (123) 456-7890",
      nationalityLabel: "ملیت",
      nationalityPlaceholder: "ملیت خود را انتخاب کنید",
      submitButton: "ثبت نام کنید و جای من را ببینید"
    },
     patient: {
        welcome: "خوش آمدید",
        description: "سفر خود را با ما در زیر دنبال کنید. وضعیت به طور خودکار به روز می شود.",
        steps: {
            registered: { title: "ثبت نام شد", description: "شما در سیستم هستید و منتظر پذیرش هستید." },
            waiting: { title: "در انتظار دکتر", description: "پذیرش درخواست شما را پردازش کرده است. لطفاً منتظر دکتر باشید." },
            consultation: { title: "در حال مشاوره", description: "شما اکنون با دکتر هستید." },
            service: { title: "خدمات مورد نیاز", description: "لطفاً با کد خود به اتاق خدمات تعیین شده بروید." },
            completed: { title: "تکمیل شد", description: "ویزیت شما کامل شده است. متشکرم!" }
        },
        message: {
            title: "ارسال پیام به دکتر",
            description: "علائم خود را توصیف کنید یا سوالی بپرسید.",
            placeholder: "پیام خود را اینجا تایپ کنید...",
            sentTitle: "پیام ارسال شد",
            sentDescription: "پیام شما برای دکتر ارسال شده است.",
        },
        action: {
            title: "اقدام لازم است",
            goToPharmacy: "لطفاً به داروخانه بروید.",
            code: "کد تأیید شما"
        },
        prescription: {
            title: "نسخه پزشک",
            description: "لطفا این دستورالعمل ها را با دقت دنبال کنید.",
            translateButton: "ترجمه",
            translatingButton: "در حال ترجمه...",
            drugHeader: "دارو / خدمات",
            dosageHeader: "دوز",
            notesHeader: "یادداشت ها",
        },
        feedback: {
            thankYou: "متشکرم!",
            prompt: "از بازدید شما سپاسگزاریم. لطفاً برای کمک به ما در بهبود، بازخورد خود را ارائه دهید.",
            button: "ارائه بازخورد"
        }
    }
  },
  ar: {
    registration: {
      title: "انضم إلى الطابور",
      description: "أدخل بياناتك أدناه للتسجيل في استشارة.",
      nameLabel: "الاسم الكامل",
      namePlaceholder: "مثال: جون دو",
      phoneLabel: "رقم الهاتف",
      phonePlaceholder: "مثال: (123) 456-7890",
      nationalityLabel: "الجنسية",
      nationalityPlaceholder: "اختر جنسيتك",
      submitButton: "سجل وشاهد مكاني"
    },
    patient: {
        welcome: "أهلاً بك",
        description: "تابع رحلتك معنا أدناه. سيتم تحديث الحالة تلقائيًا.",
        steps: {
            registered: { title: "مسجل", description: "أنت في النظام وتنتظر الاستقبال." },
            waiting: { title: "في انتظار الطبيب", description: "لقد قام الاستقبال بمعالجة طلبك. يرجى انتظار الطبيب." },
            consultation: { title: "في استشارة", description: "أنت الآن مع الطبيب." },
            service: { title: "الخدمة المطلوبة", description: "يرجى الذهاب إلى غرفة الخدمة المخصصة مع الرمز الخاص بك." },
            completed: { title: "مكتمل", description: "زيارتك كاملة. شكرًا لك!" }
        },
        message: {
            title: "أرسل رسالة إلى الطبيب",
            description: "صف أعراضك أو اطرح سؤالاً.",
            placeholder: "اكتب رسالتك هنا...",
            sentTitle: "تم إرسال الرسالة",
            sentDescription: "لقد تم إرسال رسالتك إلى الطبيب.",
        },
        action: {
            title: "الإجراء مطلوب",
            goToPharmacy: "يرجى التوجه إلى الصيدلية.",
            code: "رمز التأكيد الخاص بك هو"
        },
        prescription: {
            title: "وصفة الطبيب",
            description: "يرجى اتباع هذه التعليمات بعناية.",
            translateButton: "ترجمة",
            translatingButton: "جار الترجمة...",
            drugHeader: "الدواء / الخدمة",
            dosageHeader: "الجرعة",
            notesHeader: "ملاحظات",
        },
        feedback: {
            thankYou: "شكرًا لك!",
            prompt: "نحن نقدر زيارتك. يرجى تقديم ملاحظاتك لمساعدتنا على التحسين.",
            button: "إعطاء ملاحظات"
        }
    }
  },
  tr: {
    registration: {
      title: "Sıraya Katıl",
      description: "Danışma için kaydolmak üzere aşağıya bilgilerinizi girin.",
      nameLabel: "Tam Ad",
      namePlaceholder: "ör. John Doe",
      phoneLabel: "Telefon Numarası",
      phonePlaceholder: "ör. (123) 456-7890",
      nationalityLabel: "Uyruk",
      nationalityPlaceholder: "Uyruğunuzu seçin",
      submitButton: "Kaydol ve Yerimi Gör"
    },
     patient: {
        welcome: "Hoşgeldiniz",
        description: "Yolculuğunuzu aşağıdan takip edin. Durum otomatik olarak güncellenecektir.",
        steps: {
            registered: { title: "Kayıtlı", description: "Sistemdesiniz ve resepsiyonu bekliyorsunuz." },
            waiting: { title: "Doktor Bekleniyor", description: "Resepsiyon talebinizi işleme aldı. Lütfen doktoru bekleyin." },
            consultation: { title: "Danışmada", description: "Şimdi doktorlasınız." },
            service: { title: "Servis Gerekli", description: "Lütfen kodunuzla belirlenen servis odasına gidin." },
            completed: { title: "Tamamlandı", description: "Ziyaretiniz tamamlandı. Teşekkürler!" }
        },
        message: {
            title: "Doktora mesaj gönder",
            description: "Belirtilerinizi açıklayın veya bir soru sorun.",
            placeholder: "Mesajınızı buraya yazın...",
            sentTitle: "Mesaj Gönderildi",
            sentDescription: "Mesajınız doktora gönderildi.",
        },
        action: {
            title: "Eylem Gerekli",
            goToPharmacy: "Lütfen Eczaneye gidin.",
            code: "Onay Kodunuz"
        },
        prescription: {
            title: "Doktor Reçetesi",
            description: "Lütfen bu talimatları dikkatlice izleyin.",
            translateButton: "Çevir",
            translatingButton: "Çevriliyor...",
            drugHeader: "İlaç / Hizmet",
            dosageHeader: "Dozaj",
            notesHeader: "Notlar",
        },
        feedback: {
            thankYou: "Teşekkürler!",
            prompt: "Ziyaretinizi takdir ediyoruz. Gelişmemize yardımcı olmak için lütfen geri bildiriminizi sağlayın.",
            button: "Geri Bildirim Ver"
        }
    }
  },
  ur: {
    registration: {
      title: "قطار میں شامل ہوں",
      description: "مشاورت کے لیے رجسٹر ہونے کے لیے نیچے اپنی تفصیلات درج کریں۔",
      nameLabel: "پورا نام",
      namePlaceholder: "مثال کے طور پر جان ڈو",
      phoneLabel: "فون نمبر",
      phonePlaceholder: "مثال کے طور پر (123) 456-7890",
      nationalityLabel: "قومیت",
      nationalityPlaceholder: "اپنی قومیت منتخب کریں",
      submitButton: "رجسٹر کریں اور میری جگہ دیکھیں"
    },
     patient: {
        welcome: "خوش آمدید",
        description: "نیچے ہمارے ساتھ اپنے سفر کی پیروی کریں۔ حیثیت خود بخود اپ ڈیٹ ہو جائے گی۔",
        steps: {
            registered: { title: "رجسٹرڈ", description: "آپ سسٹم میں ہیں اور استقبالیہ کا انتظار کر رہے ہیں۔" },
            waiting: { title: "ڈاکٹر کا انتظار ہے", description: "استقبالیہ نے آپ کی درخواست پر کارروائی کی ہے۔ براہ کرم ڈاکٹر کا انتظار کریں۔" },
            consultation: { title: "مشاورت میں", description: "اب آپ ڈاکٹر کے ساتھ ہیں۔" },
            service: { title: "سروس درکار ہے", description: "براہ کرم اپنے کوڈ کے ساتھ مخصوص سروس روم میں جائیں۔" },
            completed: { title: "مکمل", description: "آپ کا دورہ مکمل ہو گیا ہے۔ شکریہ!" }
        },
        message: {
            title: "ڈاکٹر کو پیغام بھیجیں",
            description: "اپنی علامات بیان کریں یا کوئی سوال پوچھیں۔",
            placeholder: "اپنا پیغام یہاں ٹائپ کریں...",
            sentTitle: "پیغام بھیج دیا گیا",
            sentDescription: "آپ کا پیغام ڈاکٹر کو بھیج دیا گیا ہے۔",
        },
        action: {
            title: "کارروائی درکار ہے",
            goToPharmacy: "براہ کرم فارمیسی پر جائیں۔",
            code: "آپ کا تصدیقی کوڈ ہے"
        },
        prescription: {
            title: "ڈاکٹر کا نسخہ",
            description: "براہ کرم ان ہدایات پر احتیاط سے عمل کریں۔",
            translateButton: "ترجمہ کریں",
            translatingButton: "ترجمہ کیا جا رہا ہے...",
            drugHeader: "دوا / سروس",
            dosageHeader: "خوراک",
            notesHeader: "نوٹس",
        },
        feedback: {
            thankYou: "شکریہ!",
            prompt: "ہم آپ کے دورے کی تعریف کرتے ہیں۔ براہ کرم ہمیں بہتر بنانے میں مدد کے لیے اپنی رائے فراہم کریں۔",
            button: "رائے دیں"
        }
    }
  }
};

type Locale = keyof typeof translations;

interface TranslationsContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const TranslationsContext = createContext<TranslationsContextType | undefined>(undefined);

export const TranslationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>('en');

  const t = useCallback((key: string) => {
    const keys = key.split('.');
    let result: any = translations[locale];
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        // Fallback to English if translation is missing
        let fallbackResult: any = translations.en;
        for (const fk of keys) {
            fallbackResult = fallbackResult?.[fk];
        }
        return fallbackResult || key;
      }
    }
    return result || key;
  }, [locale]);

  return (
    <TranslationsContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </TranslationsContext.Provider>
  );
};

export const useTranslations = () => {
  const context = useContext(TranslationsContext);
  if (context === undefined) {
    throw new Error('useTranslations must be used within a TranslationsProvider');
  }
  return context;
};
