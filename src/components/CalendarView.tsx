
import React, { useState } from 'react';
import { Class, StudySession } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';

interface CalendarViewProps {
  classes: Class[];
  studySessions: StudySession[];
  onDeleteClass: (classId: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ 
  classes, 
  studySessions, 
  onDeleteClass 
}) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayAbbr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getWeekDates = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const weekDates = getWeekDates(currentWeek);

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newDate);
  };

  const getClassesForDay = (dayName: string) => {
    return classes.filter(cls => cls.days.includes(dayName))
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const getStudySessionsForDate = (date: Date) => {
    return studySessions.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate.toDateString() === date.toDateString();
    });
  };

  const formatWeekRange = () => {
    const start = weekDates[0];
    const end = weekDates[6];
    
    if (start.getMonth() === end.getMonth()) {
      return `${start.toLocaleDateString('en-US', { month: 'long' })} ${start.getDate()} - ${end.getDate()}, ${start.getFullYear()}`;
    } else {
      return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${start.getFullYear()}`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Week Navigation */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              📅 Weekly View
            </CardTitle>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateWeek('prev')}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Prev
              </Button>
              <span className="text-lg font-semibold">
                {formatWeekRange()}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateWeek('next')}
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Calendar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDates.map((date, index) => {
          const dayName = daysOfWeek[date.getDay()];
          const dayClasses = getClassesForDay(dayName);
          const daySessions = getStudySessionsForDate(date);
          const isToday = date.toDateString() === new Date().toDateString();

          return (
            <Card 
              key={index} 
              className={`min-h-[300px] ${
                isToday 
                  ? 'bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200' 
                  : 'bg-white'
              } shadow-sm hover:shadow-md transition-all`}
            >
              <CardHeader className="pb-3">
                <div className="text-center">
                  <div className={`text-sm font-medium ${
                    isToday ? 'text-purple-600' : 'text-muted-foreground'
                  }`}>
                    {dayAbbr[date.getDay()]}
                  </div>
                  <div className={`text-2xl font-bold ${
                    isToday 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent' 
                      : 'text-foreground'
                  }`}>
                    {date.getDate()}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {/* Classes */}
                {dayClasses.map((cls) => (
                  <div
                    key={cls.id}
                    className="group relative p-3 rounded-lg bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{cls.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{cls.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {cls.startTime} - {cls.endTime}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteClass(cls.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto w-auto text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Study Sessions */}
                {daySessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-2 rounded-lg bg-green-50 border border-green-200"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">📚</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-xs truncate">{session.subject}</p>
                        <p className="text-xs text-muted-foreground">
                          {Math.floor(session.duration / 60)}h {session.duration % 60}m
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {dayClasses.length === 0 && daySessions.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    No events
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
