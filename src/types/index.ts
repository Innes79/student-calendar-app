
export interface Class {
  id: string;
  name: string;
  emoji: string;
  startTime: string;
  endTime: string;
  days: string[];
  color: string;
}

export interface StudySession {
  id: string;
  subject: string;
  duration: number; // in minutes
  notes: string;
  date: string;
  tag: 'productive' | 'revision' | 'exam-prep' | 'research';
  classId?: string;
}

export type TabType = 'dashboard' | 'calendar';
