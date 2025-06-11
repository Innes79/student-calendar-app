
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Class, StudySession } from '@/types';

interface StudySessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSession: (session: Omit<StudySession, 'id'>) => void;
  classes: Class[];
}

const STUDY_TAGS = [
  { value: 'productive', label: '🎯 Productive', color: 'green' },
  { value: 'revision', label: '📖 Revision', color: 'blue' },
  { value: 'exam-prep', label: '📝 Exam Prep', color: 'purple' },
  { value: 'research', label: '🔍 Research', color: 'orange' }
] as const;

export const StudySessionModal: React.FC<StudySessionModalProps> = ({ 
  isOpen, 
  onClose, 
  onAddSession, 
  classes 
}) => {
  const [formData, setFormData] = useState({
    subject: '',
    duration: '',
    notes: '',
    date: new Date().toISOString().split('T')[0],
    tag: 'productive' as StudySession['tag'],
    classId: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject || !formData.duration) {
      return;
    }

    onAddSession({
      subject: formData.subject,
      duration: parseInt(formData.duration),
      notes: formData.notes,
      date: formData.date,
      tag: formData.tag,
      classId: formData.classId || undefined
    });
    
    // Reset form
    setFormData({
      subject: '',
      duration: '',
      notes: '',
      date: new Date().toISOString().split('T')[0],
      tag: 'productive',
      classId: ''
    });
    
    onClose();
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            📚 Log Study Session
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="e.g., Mathematics"
              required
            />
          </div>

          <div>
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              min="1"
              value={formData.duration}
              onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
              placeholder="e.g., 60"
              required
            />
            {formData.duration && (
              <p className="text-sm text-muted-foreground mt-1">
                That's {formatDuration(parseInt(formData.duration))}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label>Study Type</Label>
            <Select value={formData.tag} onValueChange={(value: StudySession['tag']) => setFormData(prev => ({ ...prev, tag: value }))}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select study type" />
              </SelectTrigger>
              <SelectContent>
                {STUDY_TAGS.map((tag) => (
                  <SelectItem key={tag.value} value={tag.value}>
                    {tag.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {classes.length > 0 && (
            <div>
              <Label>Related Class (Optional)</Label>
              <Select value={formData.classId} onValueChange={(value) => setFormData(prev => ({ ...prev, classId: value }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.emoji} {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="What did you work on?"
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Log Session
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
