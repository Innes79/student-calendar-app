
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Class } from '@/types';

interface AddClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddClass: (classData: Omit<Class, 'id'>) => void;
}

const EMOJI_OPTIONS = ['📚', '🧮', '🔬', '🎨', '🏃‍♂️', '💻', '🌍', '📖', '🎵', '⚖️', '🩺', '🏗️'];
const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const COLORS = ['purple', 'blue', 'green', 'orange', 'red', 'pink'];

export const AddClassModal: React.FC<AddClassModalProps> = ({ isOpen, onClose, onAddClass }) => {
  const [formData, setFormData] = useState({
    name: '',
    emoji: '📚',
    startTime: '',
    endTime: '',
    days: [] as string[],
    color: 'purple'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.startTime || !formData.endTime || formData.days.length === 0) {
      return;
    }

    onAddClass(formData);
    
    // Reset form
    setFormData({
      name: '',
      emoji: '📚',
      startTime: '',
      endTime: '',
      days: [],
      color: 'purple'
    });
    
    onClose();
  };

  const handleDayToggle = (day: string) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            📚 Add New Class
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="className">Class Name</Label>
            <Input
              id="className"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Mathematics"
              required
            />
          </div>

          <div>
            <Label>Choose Emoji</Label>
            <div className="grid grid-cols-6 gap-2 mt-2">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, emoji }))}
                  className={`text-2xl p-2 rounded-lg border-2 transition-all ${
                    formData.emoji === emoji
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <Label>Days of Week</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {DAYS_OF_WEEK.map((day) => (
                <div key={day} className="flex items-center space-x-2">
                  <Checkbox
                    id={day}
                    checked={formData.days.includes(day)}
                    onCheckedChange={() => handleDayToggle(day)}
                  />
                  <Label htmlFor={day} className="text-sm">{day}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Add Class
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
