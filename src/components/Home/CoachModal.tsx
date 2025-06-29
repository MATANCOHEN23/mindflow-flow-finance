
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { X } from "lucide-react";

interface CoachModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CoachModal: React.FC<CoachModalProps> = ({ isOpen, onClose }) => {
  const groups = ['גן', 'א', 'ב', 'ג', 'ד', 'ו', 'פעם-בשבוע'];

  const handleGroupClick = (coach: string, group: string) => {
    toast.success(`נבחר: ${coach} - קבוצת ${group}`);
  };

  const coaches = [
    { name: 'נווה עוז', id: 'neve-oz' },
    { name: 'אמיר', id: 'amir' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="modal-content max-w-4xl" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-600 text-center">
            🏀 מאמני כדורסל
          </DialogTitle>
          <button
            onClick={onClose}
            className="absolute left-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {coaches.map((coach) => (
            <div key={coach.id} className="quick-card">
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-blue-600">{coach.name}</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {groups.map((group) => (
                  <button
                    key={`${coach.id}-${group}`}
                    className="group-btn"
                    onClick={() => handleGroupClick(coach.name, group)}
                  >
                    {group}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
