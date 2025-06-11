
import React, { useState, useEffect } from 'react';
import { CalendarView } from '@/components/CalendarView';
import { Dashboard } from '@/components/Dashboard';
import { AddClassModal } from '@/components/AddClassModal';
import { StudySessionModal } from '@/components/StudySessionModal';
import { NavigationTabs } from '@/components/NavigationTabs';
import { Header } from '@/components/Header';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Class, StudySession } from '@/types';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'calendar'>('dashboard');
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [isStudySessionOpen, setIsStudySessionOpen] = useState(false);
  const [classes, setClasses] = useLocalStorage<Class[]>('student-calendar-classes', []);
  const [studySessions, setStudySessions] = useLocalStorage<StudySession[]>('student-calendar-sessions', []);

  const addClass = (newClass: Omit<Class, 'id'>) => {
    const classWithId = {
      ...newClass,
      id: Date.now().toString(),
    };
    setClasses([...classes, classWithId]);
  };

  const addStudySession = (session: Omit<StudySession, 'id'>) => {
    const sessionWithId = {
      ...session,
      id: Date.now().toString(),
    };
    setStudySessions([...studySessions, sessionWithId]);
  };

  const deleteClass = (classId: string) => {
    setClasses(classes.filter(c => c.id !== classId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <Header 
          onAddClass={() => setIsAddClassOpen(true)}
          onAddStudySession={() => setIsStudySessionOpen(true)}
        />
        
        <NavigationTabs 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />

        <div className="mt-6">
          {activeTab === 'dashboard' && (
            <Dashboard 
              classes={classes}
              studySessions={studySessions}
              onAddClass={() => setIsAddClassOpen(true)}
              onAddStudySession={() => setIsStudySessionOpen(true)}
            />
          )}
          
          {activeTab === 'calendar' && (
            <CalendarView 
              classes={classes}
              studySessions={studySessions}
              onDeleteClass={deleteClass}
            />
          )}
        </div>

        <AddClassModal
          isOpen={isAddClassOpen}
          onClose={() => setIsAddClassOpen(false)}
          onAddClass={addClass}
        />

        <StudySessionModal
          isOpen={isStudySessionOpen}
          onClose={() => setIsStudySessionOpen(false)}
          onAddSession={addStudySession}
          classes={classes}
        />
      </div>
    </div>
  );
};

export default Index;
