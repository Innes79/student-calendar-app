
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileUp, FileDown, Copy, Check } from 'lucide-react';
import { Class, StudySession } from '@/types';
import { exportData, parseImportData } from '@/utils/dataExport';
import { useToast } from '@/hooks/use-toast';

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  classes: Class[];
  studySessions: StudySession[];
  onImportData: (classes: Class[], studySessions: StudySession[]) => void;
}

export const ImportExportModal: React.FC<ImportExportModalProps> = ({
  isOpen,
  onClose,
  classes,
  studySessions,
  onImportData
}) => {
  const [importText, setImportText] = useState('');
  const [exportText, setExportText] = useState('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleExportFile = () => {
    try {
      exportData(classes, studySessions);
      toast({
        title: "Export Successful",
        description: "Your data has been exported to a file.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting your data.",
        variant: "destructive",
      });
    }
  };

  const handleExportText = () => {
    const data = {
      classes,
      studySessions,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    setExportText(JSON.stringify(data, null, 2));
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(exportText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied to clipboard",
        description: "Export data copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleImportFromText = () => {
    try {
      const data = parseImportData(importText);
      onImportData(data.classes, data.studySessions);
      toast({
        title: "Import Successful",
        description: `Imported ${data.classes.length} classes and ${data.studySessions.length} study sessions.`,
      });
      setImportText('');
      onClose();
    } catch (error) {
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Invalid data format.",
        variant: "destructive",
      });
    }
  };

  const handleImportFromFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = parseImportData(content);
        onImportData(data.classes, data.studySessions);
        toast({
          title: "Import Successful",
          description: `Imported ${data.classes.length} classes and ${data.studySessions.length} study sessions.`,
        });
        onClose();
      } catch (error) {
        toast({
          title: "Import Failed",
          description: error instanceof Error ? error.message : "Invalid file format.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            📁 Import & Export Data
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="export" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="export" className="flex items-center gap-2">
              <FileDown className="w-4 h-4" />
              Export
            </TabsTrigger>
            <TabsTrigger value="import" className="flex items-center gap-2">
              <FileUp className="w-4 h-4" />
              Import
            </TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="space-y-4 mt-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Export Your Data</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Export your classes and study sessions to backup or share with others.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={handleExportFile}
                  className="flex items-center gap-2 justify-center"
                >
                  <FileDown className="w-4 h-4" />
                  Download as File
                </Button>

                <Button
                  onClick={handleExportText}
                  variant="outline"
                  className="flex items-center gap-2 justify-center"
                >
                  Generate Text
                </Button>
              </div>

              {exportText && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="export-text">Export Data (JSON)</Label>
                    <Button
                      onClick={handleCopyToClipboard}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                  <Textarea
                    id="export-text"
                    value={exportText}
                    readOnly
                    className="font-mono text-xs h-48"
                    placeholder="Generated export data will appear here..."
                  />
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="import" className="space-y-4 mt-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Import Data</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Import classes and study sessions from a file or text. This will replace your current data.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="file-upload" className="text-sm font-medium">
                    Import from File
                  </Label>
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".json"
                    onChange={handleImportFromFile}
                    className="mt-2"
                  />
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  or
                </div>

                <div className="space-y-3">
                  <Label htmlFor="import-text" className="text-sm font-medium">
                    Import from Text
                  </Label>
                  <Textarea
                    id="import-text"
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                    className="font-mono text-xs h-48"
                    placeholder="Paste your exported JSON data here..."
                  />
                  <Button
                    onClick={handleImportFromText}
                    disabled={!importText.trim()}
                    className="w-full"
                  >
                    Import Data
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
