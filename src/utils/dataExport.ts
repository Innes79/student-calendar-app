
import { Class, StudySession } from '@/types';

export interface ExportData {
  classes: Class[];
  studySessions: StudySession[];
  exportDate: string;
  version: string;
}

export const exportData = (classes: Class[], studySessions: StudySession[]) => {
  const data: ExportData = {
    classes,
    studySessions,
    exportDate: new Date().toISOString(),
    version: '1.0'
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `student-calendar-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const parseImportData = (jsonString: string): ExportData => {
  const data = JSON.parse(jsonString);
  
  // Validate the data structure
  if (!data.classes || !Array.isArray(data.classes)) {
    throw new Error('Invalid data format: missing or invalid classes array');
  }
  
  if (!data.studySessions || !Array.isArray(data.studySessions)) {
    throw new Error('Invalid data format: missing or invalid studySessions array');
  }

  return data;
};
