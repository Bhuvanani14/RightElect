export interface ElectionStage {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export const ELECTION_STAGES: ElectionStage[] = [
  {
    id: 1,
    title: "Election Announcement",
    description: "The Election Commission of India (ECI) announces the schedule.",
    longDescription: "The process begins with the official notification by the ECI. This is when the Model Code of Conduct comes into effect, ensuring a level playing field for all candidates.",
    status: 'completed'
  },
  {
    id: 2,
    title: "Voter Registration",
    description: "Enroll yourself in the electoral roll to be eligible to vote.",
    longDescription: "Every citizen aged 18 or above must register to vote. You can check your status on the National Voter's Service Portal (NVSP) or using the 'Right Elect' registration guide.",
    status: 'ongoing'
  },
  {
    id: 3,
    title: "Candidate Nominations",
    description: "Candidates file their papers and are scrutinized.",
    longDescription: "Aspiring representatives file nomination papers. These are scrutinized to ensure eligibility, followed by a period where candidates can withdraw their names.",
    status: 'upcoming'
  },
  {
    id: 4,
    title: "Campaigning",
    description: "Parties and candidates present their vision to the voters.",
    longDescription: "A intensive phase where candidates hold rallies and meetings to connect with citizens. Campaigning must stop 48 hours before the conclusion of voting.",
    status: 'upcoming'
  },
  {
    id: 5,
    title: "Voting Day",
    description: "The most crucial day - go to your booth and cast your vote.",
    longDescription: "Citizens visit their designated polling booths to use Electronic Voting Machines (EVM) with VVPAT to securely cast their votes.",
    status: 'upcoming'
  },
  {
    id: 6,
    title: "Results & Declaration",
    description: "Votes are counted and winners are announced.",
    longDescription: "Counting happens at designated centers under strict supervision. Once results are verified, the winner is declared and the election process is formalized.",
    status: 'upcoming'
  }
];

export const FAQ_DATA = [
  {
    question: "Am I eligible to vote?",
    answer: "You are eligible if you are an Indian citizen, 18 years old or above on the qualifying date, and registered in the electoral roll of your constituency."
  },
  {
    question: "Can I vote without a Voter ID?",
    answer: "Yes, provided your name is in the electoral roll. You can use other official documents like Aadhaar, Passport, or PAN card as identity proof at the polling station."
  },
  {
    question: "What is EPIC?",
    answer: "Electors Photo Identity Card (EPIC) is also known as the Voter ID card. It is issued by the ECI to all eligible voters."
  }
];
