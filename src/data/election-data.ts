export interface ElectionStage {
  id: number;
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
  longDesc: string;
  longDescHi: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export const ELECTION_STAGES: ElectionStage[] = [
  {
    id: 1,
    title: "Election Announcement",
    titleHi: "चुनाव की घोषणा",
    description: "The ECI announces the formal schedule.",
    descriptionHi: "ECI औपचारिक कार्यक्रम की घोषणा करता है।",
    longDesc: "The process begins with the official notification. This is when the Model Code of Conduct comes into effect.",
    longDescHi: "प्रक्रिया आधिकारिक अधिसूचना के साथ शुरू होती है। यह तब होता है जब आदर्श आचार संहिता लागू होती है।",
    status: 'completed'
  },
  {
    id: 2,
    title: "Voter Registration",
    titleHi: "मतदाता पंजीकरण",
    description: "Enroll yourself in the electoral roll.",
    descriptionHi: "मतदाता सूची में अपना नाम दर्ज कराएं।",
    longDesc: "Every citizen aged 18 or above must register to vote. You can check your status on the official portal.",
    longDescHi: "18 वर्ष या उससे अधिक आयु के प्रत्येक नागरिक को मतदान के लिए पंजीकरण करना होगा।",
    status: 'ongoing'
  },
  {
    id: 3,
    title: "Candidate Nominations",
    titleHi: "उम्मीदवार नामांकन",
    description: "Candidates file their papers for scrutiny.",
    descriptionHi: "उम्मीदवार जांच के लिए अपने कागजात दाखिल करते हैं।",
    longDesc: "Aspiring representatives file nomination papers. These are scrutinized to ensure eligibility.",
    longDescHi: "भावी प्रतिनिधि नामांकन पत्र दाखिल करते हैं। पात्रता सुनिश्चित करने के लिए इनकी जांच की जाती है।",
    status: 'upcoming'
  },
  {
    id: 4,
    title: "Campaigning",
    titleHi: "चुनाव प्रचार",
    description: "Parties present their vision to the voters.",
    descriptionHi: "दल मतदाताओं के सामने अपना दृष्टिकोण रखते हैं।",
    longDesc: "An intensive phase where candidates hold rallies to connect with citizens before the silence period.",
    longDescHi: "एक गहन चरण जहां उम्मीदवार नागरिकों से जुड़ने के लिए रैलियां करते हैं।",
    status: 'upcoming'
  },
  {
    id: 5,
    title: "Voting Day",
    titleHi: "मतदान का दिन",
    description: "Cast your vote at your designated booth.",
    descriptionHi: "अपने निर्धारित बूथ पर अपना वोट डालें।",
    longDesc: "Citizens visit polling booths to use Electronic Voting Machines (EVM) to securely cast their votes.",
    longDescHi: "नागरिक सुरक्षित रूप से अपना वोट डालने के लिए ईवीएम का उपयोग करने के लिए मतदान केंद्रों पर जाते हैं।",
    status: 'upcoming'
  },
  {
    id: 6,
    title: "Results & Declaration",
    titleHi: "परिणाम और घोषणा",
    description: "Votes are counted and winners declared.",
    descriptionHi: "मतों की गिनती की जाती है और विजेताओं की घोषणा की जाती है।",
    longDesc: "Counting happens at designated centers. Once verified, the winner is formally declared.",
    longDescHi: "मतगणना निर्धारित केंद्रों पर होती है। सत्यापित होने के बाद, विजेता की औपचारिक घोषणा की जाती है।",
    status: 'upcoming'
  }
];

export const FAQ_DATA = [
  {
    question: "Am I eligible to vote?",
    answer: "You are eligible if you are an Indian citizen, 18 years old or above, and registered in the electoral roll."
  },
  {
    question: "Can I vote without a Voter ID?",
    answer: "Yes, if your name is in the roll, you can use Aadhaar, Passport, or PAN card as identity proof."
  }
];
