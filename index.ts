export interface StudentProfile {
  name: string;
  qualification: string;
  subjects: string;
  grades: string;
  targetField: string;
  targetUniversitiesExams: string;
  interests: string;
  gapYearReason: string;
  availableHoursPerWeek: string;
  budgetConstraints: string;
  goals: string;
  learningStyle: string;
  isCustom?: boolean;
}

export interface KickstartDay {
  day: number;
  title: string;
  description: string;
  timeNeeded: string;
  output: string;
  completed?: boolean;
}

export interface RoadmapTask {
  id: string;
  title: string;
  category: 'Academic/Exam' | 'Skill Building' | 'Practical Project' | 'University Application' | 'Wellbeing' | string;
  detail: string;
  completed?: boolean;
}

export interface RoadmapMonth {
  monthNumber: number;
  monthTitle: string;
  objective: string;
  workloadHoursPerWeek: string;
  academicAndExamPrep: string;
  careerAndSkills: string;
  projectOrExtracurricular: string;
  milestone: string;
  tasks: RoadmapTask[];
}

export interface SkillRecommendation {
  skill: string;
  category: string;
  relevance: string;
  beginnerStartingPoint: string;
  achievableMiniProject: string;
  estimatedTimeCommitment: string;
  freeOrAffordableResource: string;
  verifiedNote?: string;
}

export interface GeneratedRoadmap {
  executiveSummary: string;
  weeklyPacingStrategy: string;
  sevenDayKickstart: KickstartDay[];
  months: RoadmapMonth[];
  skillsRecommendations: SkillRecommendation[];
  disclaimerNotice: string;
  generatedAt: string;
  studentName?: string;
  studentProfile?: StudentProfile;
}

export type ApplicationStatus =
  | 'Researching'
  | 'Preparing'
  | 'Submitted'
  | 'Interview / Test'
  | 'Accepted'
  | 'Waitlisted / Other';

export interface DocumentCheckItem {
  id: string;
  name: string;
  checked: boolean;
}

export interface ApplicationEntry {
  id: string;
  universityName: string;
  degreeProgram: string;
  entranceExam: string;
  applicationDeadline: string;
  isDeadlineVerified: boolean;
  status: ApplicationStatus;
  requiredDocuments: DocumentCheckItem[];
  notes: string;
  nextAction: string;
  isNextActionDone: boolean;
  isSample?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface SavedStudentSession {
  id: string;
  studentName: string;
  qualification: string;
  targetField: string;
  createdAt: string;
  lastActiveAt: string;
  profile: StudentProfile;
  roadmap: GeneratedRoadmap | null;
  applications: ApplicationEntry[];
}
