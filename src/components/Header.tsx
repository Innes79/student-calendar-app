
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, BookOpen } from 'lucide-react';

interface HeaderProps {
  onAddClass: () => void;
  onAddStudySession: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAddClass, onAddStudySession }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div className="flex items-center gap-3">
        <img 
          src="/lovable-uploads/59769ea3-f8bb-42b1-bd95-b500d76f5227.png" 
          alt="Student Calendar Logo" 
          className="w-12 h-12 object-contain"
        />
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            📚 Student Calendar
          </h1>
          <p className="text-muted-foreground mt-1">
            Organize your academic life with style
          </p>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button 
          onClick={onAddStudySession}
          variant="outline"
          className="flex items-center gap-2 hover:bg-purple-50 hover:border-purple-300 transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          Log Study
        </Button>
        <Button 
          onClick={onAddClass}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Class
        </Button>
      </div>
    </div>
  );
};
