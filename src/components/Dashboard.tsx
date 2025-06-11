
import React from 'react';
import { Class, StudySession } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, BookOpen, Calendar, TrendingUp } from 'lucide-react';

interface DashboardProps {
  classes: Class[];
  studySessions: StudySession[];
  onAddClass: () => void;
  onAddStudySession: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  classes, 
  studySessions, 
  onAddClass, 
  onAddStudySession 
}) => {
  const today = new Date();
  const currentDay = today.toLocaleDateString('en-US', { weekday: 'long' });
  
  const todaysClasses = classes.filter(cls => cls.days.includes(currentDay));
  
  const thisWeekSessions = studySessions.filter(session => {
    const sessionDate = new Date(session.date);
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    return sessionDate >= weekStart && sessionDate <= weekEnd;
  });

  const totalStudyTime = thisWeekSessions.reduce((total, session) => total + session.duration, 0);
  const studyHours = Math.floor(totalStudyTime / 60);
  const studyMinutes = totalStudyTime % 60;

  const getNextClass = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    return todaysClasses
      .filter(cls => {
        const [hours, minutes] = cls.startTime.split(':').map(Number);
        return (hours * 60 + minutes) > currentTime;
      })
      .sort((a, b) => {
        const timeA = a.startTime.split(':').map(Number);
        const timeB = b.startTime.split(':').map(Number);
        return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
      })[0];
  };

  const nextClass = getNextClass();

  const getSubjectStats = () => {
    const subjectMap = new Map<string, number>();
    thisWeekSessions.forEach(session => {
      subjectMap.set(session.subject, (subjectMap.get(session.subject) || 0) + session.duration);
    });
    
    const sortedSubjects = Array.from(subjectMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    
    return sortedSubjects;
  };

  const topSubjects = getSubjectStats();

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Total Classes</p>
                <p className="text-3xl font-bold">{classes.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Study Time This Week</p>
                <p className="text-3xl font-bold">{studyHours}h {studyMinutes}m</p>
              </div>
              <Clock className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Study Sessions</p>
                <p className="text-3xl font-bold">{thisWeekSessions.length}</p>
              </div>
              <BookOpen className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Today's Classes</p>
                <p className="text-3xl font-bold">{todaysClasses.length}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Next Class */}
        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🕐 Next Class
            </CardTitle>
          </CardHeader>
          <CardContent>
            {nextClass ? (
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                <div className="text-3xl">{nextClass.emoji}</div>
                <div className="flex-1">
                  <p className="font-semibold text-lg">{nextClass.name}</p>
                  <p className="text-muted-foreground">
                    {nextClass.startTime} - {nextClass.endTime}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No more classes today! 🎉</p>
                <Button 
                  onClick={onAddClass}
                  variant="outline" 
                  className="mt-4"
                >
                  Add a Class
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Today's Schedule */}
        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📅 Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todaysClasses.length > 0 ? (
              <div className="space-y-3">
                {todaysClasses
                  .sort((a, b) => a.startTime.localeCompare(b.startTime))
                  .map((cls) => (
                    <div key={cls.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                      <div className="text-2xl">{cls.emoji}</div>
                      <div className="flex-1">
                        <p className="font-medium">{cls.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {cls.startTime} - {cls.endTime}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No classes today!</p>
                <Button 
                  onClick={onAddClass}
                  variant="outline" 
                  className="mt-4"
                >
                  Add a Class
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Study Progress */}
        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📈 Top Subjects This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topSubjects.length > 0 ? (
              <div className="space-y-4">
                {topSubjects.map(([subject, minutes], index) => (
                  <div key={subject} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{subject}</p>
                      <p className="text-sm text-muted-foreground">
                        {Math.floor(minutes / 60)}h {minutes % 60}m
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No study sessions logged yet</p>
                <Button 
                  onClick={onAddStudySession}
                  variant="outline" 
                  className="mt-4"
                >
                  Log Study Session
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ⚡ Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button 
                onClick={onAddClass}
                className="w-full justify-start bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Add New Class
              </Button>
              <Button 
                onClick={onAddStudySession}
                variant="outline"
                className="w-full justify-start hover:bg-purple-50 hover:border-purple-300"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Log Study Session
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
