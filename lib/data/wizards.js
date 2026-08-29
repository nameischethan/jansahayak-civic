// Module 2 — Step-by-Step Guided Interactive Wizards.
// Each wizard is a small decision tree: a linear sequence of questions
// whose answers are collected into `answers`, then mapped to a tailored
// checklist + next-steps outcome via `resolve(answers)`.
export const WIZARDS = [
  {
    id: "aadhaar-update",
    title: "Aadhaar Details Update",
    titleHi: "आधार विवरण अपडेट",
    icon: "id-card",
    questions: [
      {
        id: "field",
        text: "What do you need to update?",
        textHi: "आपको क्या अपडेट करना है?",
        options: ["Name", "Date of Birth", "Address", "Mobile Number", "Photo"],
      },
      {
        id: "mode",
        text: "Do you have your Aadhaar-linked mobile number with you?",
        textHi: "क्या आपके पास आधार से जुड़ा मोबाइल नंबर है?",
        options: ["Yes", "No"],
      },
    ],
    resolve: (a) => {
      const online = ["Address", "Mobile Number"].includes(a.field) && a.mode === "Yes";
      return {
        title: online ? "You can update this online via Aadhaar Self-Service" : "You'll need to visit an Aadhaar Seva Kendra",
        titleHi: online ? "यह ऑनलाइन सेल्फ-सर्विस से हो सकता है" : "आपको आधार सेवा केंद्र जाना होगा",
        checklist: online
          ? ["Visit ssup.uidai.gov.in", "Login with Aadhaar + OTP", "Upload supporting address proof (if updating address)", "Note your Update Request Number (URN)"]
          : ["Book a slot at your nearest Aadhaar Seva Kendra", "Carry original + photocopy of supporting document", `Carry proof for: ${a.field}`, "Biometric verification may be required for name/DOB/photo changes"],
        note: a.field === "Date of Birth" ? "DOB can typically only be corrected once in a lifetime — double check before submitting." : null,
      };
    },
  },
  {
    id: "address-change",
    title: "Address Change (Multi-Document)",
    titleHi: "पता परिवर्तन (कई दस्तावेज़)",
    icon: "map-pin",
    questions: [
      {
        id: "docs",
        text: "Which documents need the new address?",
        textHi: "किन दस्तावेज़ों में नया पता चाहिए?",
        options: ["Aadhaar only", "Aadhaar + Voter ID", "Aadhaar + Voter ID + Driving Licence", "All of the above + Passport"],
      },
      {
        id: "proof",
        text: "Do you have a new address proof (utility bill / rent agreement)?",
        textHi: "क्या आपके पास नए पते का प्रमाण है?",
        options: ["Yes", "No"],
      },
    ],
    resolve: (a) => ({
      title: a.proof === "Yes" ? "You're ready to start — here's your update order" : "Get an address proof first",
      titleHi: a.proof === "Yes" ? "आप तैयार हैं — यह क्रम अपनाएं" : "पहले पते का प्रमाण लें",
      checklist:
        a.proof === "Yes"
          ? [
              "1. Update Aadhaar first (it's used as proof for everything else)",
              a.docs.includes("Voter ID") ? "2. Update Voter ID via voters.eci.gov.in (Form 8)" : null,
              a.docs.includes("Driving Licence") ? "3. Update Driving Licence via Parivahan Sewa portal" : null,
              a.docs.includes("Passport") ? "4. Update Passport via Passport Seva (requires police verification again)" : null,
            ].filter(Boolean)
          : ["Get an electricity/water bill, rent agreement, or bank statement with your new address", "A gazetted officer can also issue an address proof affidavit", "Return here once you have proof to see your personalized update order"],
    }),
  },
  {
    id: "revenue-mutation",
    title: "Revenue Office: Land Mutation Request",
    titleHi: "राजस्व कार्यालय: भूमि नामांतरण अनुरोध",
    icon: "map",
    questions: [
      {
        id: "reason",
        text: "Why does the land record need mutation?",
        textHi: "भूमि रिकॉर्ड में नामांतरण क्यों चाहिए?",
        options: ["Sale/Purchase", "Inheritance", "Gift Deed", "Court Order"],
      },
      {
        id: "hasDeed",
        text: "Do you have the registered deed/order document?",
        textHi: "क्या आपके पास रजिस्टर्ड डीड/आदेश है?",
        options: ["Yes", "No"],
      },
    ],
    resolve: (a) => ({
      title: a.hasDeed === "Yes" ? "File your mutation application at the Tehsil/MRO office" : "Get your deed registered/certified first",
      titleHi: a.hasDeed === "Yes" ? "तहसील/MRO कार्यालय में नामांतरण आवेदन करें" : "पहले डीड रजिस्टर/प्रमाणित कराएं",
      checklist:
        a.hasDeed === "Yes"
          ? [
              "Fill Form for Mutation (Dakhil-Kharij) at Tehsil office or online land records portal",
              `Attach: registered ${a.reason.toLowerCase()} document`,
              "Attach latest land tax receipt (khasra/khatauni)",
              "A field inspector (Patwari) will verify the land physically",
              "Objection period of ~15-30 days before mutation is finalized",
            ]
          : [
              a.reason === "Inheritance" ? "Get a Legal Heir Certificate from the Tehsildar first" : "Get the deed registered at the Sub-Registrar office first",
              "Carry original ID proofs of all parties involved",
              "Once registered, return here to file the mutation application",
            ],
    }),
  },
];
