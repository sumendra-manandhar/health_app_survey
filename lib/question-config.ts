export interface Question {
  id: string
  label: string
  labelEn?: string
  type: "text" | "number" | "date" | "select" | "radio" | "checkbox" | "textarea"
  required: boolean
  placeholder?: string
  options?: Array<{ value: string; label: string; labelEn?: string }>
  validation?: {
    min?: number
    max?: number
    pattern?: string
    message?: string
  }
  conditional?: {
    dependsOn: string
    value: any
    operator?: "equals" | "not_equals" | "greater_than" | "less_than"
  }
}

export interface FormStep {
  id: string
  title: { nepali: string; english: string }
  description: { nepali: string; english: string }
  questions: Question[]
}

export const questionConfig: FormStep[] = [
  {
    id: "step1",
    title: { nepali: "बालकको जानकारी", english: "Child Information" },
    description: { nepali: "बाल/बालिकाको आधारभूत जानकारी", english: "Basic child information" },
    questions: [
      {
        id: "child_name",
        label: "बाल/बालिकाको नाम",
        labelEn: "Child's Name",
        type: "text",
        required: true,
        placeholder: "पूरा नाम लेख्नुहोस्",
        validation: {
          min: 2,
          max: 100,
          message: "नाम कम्तिमा २ अक्षरको हुनुपर्छ",
        },
      },
      {
        id: "birth_date",
        label: "जन्म मिति",
        labelEn: "Date of Birth",
        type: "date",
        required: true,
        validation: {
          message: "मान्य जन्म मिति चाहिन्छ",
        },
      },
      {
        id: "gender",
        label: "लिङ्ग",
        labelEn: "Gender",
        type: "radio",
        required: true,
        options: [
          { value: "male", label: "पुरुष", labelEn: "Male" },
          { value: "female", label: "महिला", labelEn: "Female" },
        ],
      },
      {
        id: "guardian_name",
        label: "अभिभावकको नाम",
        labelEn: "Guardian's Name",
        type: "text",
        required: true,
        placeholder: "बुबा/आमाको नाम",
        validation: {
          min: 2,
          max: 100,
        },
      },
      {
        id: "guardian_address",
        label: "अभिभावको ठेगाना",
        labelEn: "Guardian's Address",
        type: "text",
        required: true,
        placeholder: "पूरा ठेगाना",
        validation: {
          min: 5,
          max: 200,
        },
      },
      {
        id: "guardian_occupation_father",
        label: "बाबुको पेशा",
        labelEn: "Father's Occupation",
        type: "text",
        required: false,
        placeholder: "पेशा उल्लेख गर्नुहोस्",
      },
      {
        id: "guardian_occupation_mother",
        label: "आमाको पेशा",
        labelEn: "Mother's Occupation",
        type: "text",
        required: false,
        placeholder: "पेशा उल्लेख गर्नुहोस्",
      },
      {
        id: "contact_number",
        label: "सम्पर्क नम्बर",
        labelEn: "Contact Number",
        type: "text",
        required: true,
        placeholder: "98XXXXXXXX",
        validation: {
          pattern: "^[0-9]{10}$",
          message: "१० अंकको मोबाइल नम्बर चाहिन्छ",
        },
      },
    ],
  },
  {
    id: "step2",
    title: { nepali: "स्वास्थ्य पृष्ठभूमि", english: "Health Background" },
    description: { nepali: "स्वास्थ्य सम्बन्धी विवरण", english: "Health related details" },
    questions: [
      {
        id: "drug_allergies",
        label: "कुनै औषधि, खाना वा अन्यको एलर्जीहरू भएः",
        labelEn: "Any drug, food or other allergies:",
        type: "textarea",
        required: false,
        placeholder: "एलर्जी छ भने विस्तारमा लेख्नुहोस्...",
        validation: {
          max: 300,
        },
      },
      {
        id: "health_history",
        label: "स्वास्थ्य इतिवृत्त:",
        labelEn: "Health History:",
        type: "textarea",
        required: false,
        placeholder: "विगतका स्वास्थ्य समस्याहरू...",
        validation: {
          max: 300,
        },
      },
      {
        id: "current_medication",
        label: "हाल कुनै औषधि वा उपचार लिएको भए:",
        labelEn: "Currently taking any medicine or treatment:",
        type: "textarea",
        required: false,
        placeholder: "हाल चलिरहेको औषधि वा उपचार...",
        validation: {
          max: 200,
        },
      },
      {
        id: "vaccination_status",
        label: "खोप स्थिति",
        labelEn: "Vaccination Status",
        type: "select",
        required: true,
        options: [
          { value: "complete", label: "पूर्ण", labelEn: "Complete" },
          { value: "partial", label: "आंशिक", labelEn: "Partial" },
          { value: "none", label: "छैन", labelEn: "None" },
          { value: "unknown", label: "थाहा छैन", labelEn: "Unknown" },
        ],
      },
    ],
  },
  {
    id: "step3",
    title: { nepali: "बच्चाको शारीरिक जाँच", english: "Physical Examination" },
    description: { nepali: "बच्चाको शारीरिक मापदण्डहरू", english: "Child's physical measurements" },
    questions: [
      {
        id: "weight",
        label: "तौल/वजन (कि.ग्रा.)",
        labelEn: "Weight (Kg)",
        type: "number",
        required: true,
        placeholder: "किलोग्राममा तौल",
        validation: {
          min: 0.5,
          max: 50,
          message: "मान्य तौल प्रविष्ट गर्नुहोस्",
        },
      },
      {
        id: "height",
        label: "उचाई (सेन्टिमिटर)",
        labelEn: "Height (cm)",
        type: "number",
        required: false,
        placeholder: "सेन्टिमिटरमा उचाई (वैकल्पिक)",
        validation: {
          min: 30,
          max: 150,
        },
      },
      {
        id: "muac",
        label: "MUAC - बच्चाको पाखुराको बोलाई नाप (से.मि.)",
        labelEn: "MUAC - Mid Upper Arm Circumference (cm)",
        type: "number",
        required: false,
        placeholder: "सेन्टिमिटरमा MUAC (वैकल्पिक)",
        validation: {
          min: 5,
          max: 30,
        },
      },
      {
        id: "head_circumference",
        label: "टाउकोको परिधी/बोलाई (से.मि.)",
        labelEn: "Head Circumference (cm)",
        type: "number",
        required: false,
        placeholder: "सेन्टिमिटरमा टाउकोको परिधि (वैकल्पिक)",
        validation: {
          min: 30,
          max: 60,
        },
      },
      {
        id: "chest_circumference",
        label: "छातीको परिधी/बोलाई (से.मि.)",
        labelEn: "Chest Circumference (cm)",
        type: "number",
        required: false,
        placeholder: "सेन्टिमिटरमा छातीको परिधि (वैकल्पिक)",
        validation: {
          min: 30,
          max: 80,
        },
      },
    ],
  },
  {
    id: "step4",
    title: { nepali: "स्वर्णप्राशन मात्रा लग", english: "Swarnabindu Dose Log" },
    description: { nepali: "स्वर्णप्राशन सेवनको विवरण", english: "Swarnabindu consumption details" },
    questions: [
      {
        id: "dose_amount",
        label: "सेवन मात्रा (थोपा)",
        labelEn: "Dose Amount (drops)",
        type: "select",
        required: true,
        options: [
          { value: "1", label: "1 थोपा (6 महिना - 1 वर्ष)", labelEn: "1 drop (6 months - 1 year)" },
          { value: "2", label: "2 थोपा (1-2 वर्ष)", labelEn: "2 drops (1-2 years)" },
          { value: "4", label: "4 थोपा (2-5 वर्ष)", labelEn: "4 drops (2-5 years)" },
        ],
      },
      {
        id: "dose_time",
        label: "सेवन समय",
        labelEn: "Dose Time",
        type: "text",
        required: true,
        placeholder: "विहान सूर्योदयदेखि पुष्य नक्षत्र",
      },
      {
        id: "administered_by",
        label: "सेवन गराउने व्यक्ति",
        labelEn: "Administered By",
        type: "text",
        required: true,
        placeholder: "आयुर्वेद चिकित्सक/स्वास्थ्यकर्मी",
        validation: {
          min: 2,
          max: 100,
        },
      },
      {
        id: "child_reaction",
        label: "बालकको प्रतिक्रिया",
        labelEn: "Child's Reaction",
        type: "radio",
        required: true,
        options: [
          { value: "normal", label: "सामान्य", labelEn: "Normal" },
          { value: "adverse", label: "कुनै प्रतिक्रिया", labelEn: "Any Reaction" },
        ],
      },
      {
        id: "adverse_reaction_details",
        label: "प्रतिक्रिया विवरण",
        labelEn: "Reaction Details",
        type: "textarea",
        required: false,
        conditional: {
          dependsOn: "child_reaction",
          value: "adverse",
        },
        placeholder: "प्रतिक्रिया भएको भए विस्तारमा लेख्नुहोस्...",
        validation: {
          max: 200,
        },
      },
    ],
  },
]
