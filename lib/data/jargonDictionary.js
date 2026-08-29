// Offline dictionary for module 14 (Jargon & Status Code Translator).
// Used as the deterministic fallback / demo-safe path; can be extended
// with an LLM-backed route the same way analyze-doc.js is.
export const JARGON_DICTIONARY = [
  {
    term: "Mutation of Property",
    plain: "Updating land/property ownership records after a sale, inheritance, or gift, so the new owner's name appears in government records.",
    plainHi: "जमीन या संपत्ति खरीदने, विरासत में मिलने, या उपहार में मिलने के बाद सरकारी रिकॉर्ड में नए मालिक का नाम दर्ज करना।",
    category: "Land Records",
  },
  {
    term: "Encumbrance Certificate",
    plain: "A document proving a property has no pending loans or legal dues against it — required before buying/selling land.",
    plainHi: "यह दस्तावेज़ साबित करता है कि संपत्ति पर कोई बकाया लोन या कानूनी विवाद नहीं है — जमीन खरीदने-बेचने से पहले जरूरी है।",
    category: "Land Records",
  },
  {
    term: "Rejected under Section 14-B Clause 4",
    plain: "Your PF claim was returned because your employer's contribution records don't match your claim — usually the employer's accountant needs to fix their filing first, not something you did wrong.",
    plainHi: "आपका PF दावा वापस भेजा गया क्योंकि कंपनी के PF रिकॉर्ड और आपके दावे में अंतर है — यह गलती आमतौर पर कंपनी की तरफ से होती है।",
    category: "EPFO / Provident Fund",
  },
  {
    term: "Pending Verification at Field Level",
    plain: "A government officer needs to physically verify your address, identity, or documents before your application can move forward.",
    plainHi: "आपकी अर्जी आगे बढ़ने से पहले किसी सरकारी अधिकारी को आपका पता, पहचान, या दस्तावेज़ खुद जाकर जांचना है।",
    category: "General Application Status",
  },
  {
    term: "Non-Bailable Warrant (NBW)",
    plain: "A court order allowing police to arrest a person immediately without needing a separate court permission — usually issued when someone repeatedly ignores court summons.",
    plainHi: "यह कोर्ट का आदेश है जिसमें पुलिस बिना अलग अनुमति के किसी व्यक्ति को तुरंत गिरफ्तार कर सकती है — आमतौर पर बार-बार कोर्ट न आने पर जारी होता है।",
    category: "Legal / Judiciary",
  },
  {
    term: "Domicile Certificate",
    plain: "Proof that you permanently reside in a particular state — needed for state quota admissions and state government jobs.",
    plainHi: "यह प्रमाणित करता है कि आप किसी राज्य के स्थायी निवासी हैं — राज्य कोटे में दाखिले और नौकरी के लिए जरूरी है।",
    category: "Certificates",
  },
  {
    term: "Application Under Scrutiny",
    plain: "An officer is currently reviewing your application details and documents — no action is needed from you right now unless you're contacted.",
    plainHi: "एक अधिकारी अभी आपकी अर्जी और दस्तावेज़ों की जांच कर रहा है — जब तक आपसे संपर्क न किया जाए, आपको कुछ करने की जरूरत नहीं है।",
    category: "General Application Status",
  },
  {
    term: "Form 15G Rejected — PAN Not Linked",
    plain: "Your no-tax-deduction declaration was rejected because your PAN card is not linked to your Aadhaar or bank account.",
    plainHi: "आपकी टैक्स-कटौती-रहित घोषणा (Form 15G) अस्वीकृत हुई क्योंकि आपका PAN कार्ड आधार या बैंक खाते से जुड़ा नहीं है।",
    category: "Income Tax / EPFO",
  },
  {
    term: "Passport Police Verification Adverse",
    plain: "Police found a discrepancy during your address/background check — you may need to submit additional proof or clarify the issue at the local police station.",
    plainHi: "पुलिस जांच में आपके पते या पृष्ठभूमि में कोई गड़बड़ी मिली — आपको अतिरिक्त प्रमाण देना पड़ सकता है या नजदीकी थाने में स्पष्टीकरण देना होगा।",
    category: "Passport Seva",
  },
  {
    term: "RC Transfer Pending — NOC Required",
    plain: "Your vehicle registration transfer is on hold because a No Objection Certificate from the original RTO/financier hasn't been submitted yet.",
    plainHi: "आपकी गाड़ी की RC ट्रांसफर रुकी हुई है क्योंकि पुराने RTO या फाइनेंसर से NOC अभी जमा नहीं हुआ है।",
    category: "Parivahan / RTO",
  },
];
