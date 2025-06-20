
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash2, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  itemName?: string;
  isLoading?: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemName,
  isLoading = false
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md text-center" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 mb-4">
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-8 h-8 text-red-600" />
          </div>
          
          <p className="text-gray-600 mb-2">
            האם אתה בטוח שברצונך למחוק?
          </p>
          
          {itemName && (
            <p className="font-semibold text-gray-900 mb-4">
              "{itemName}"
            </p>
          )}
          
          <p className="text-sm text-gray-500">
            פעולה זו לא ניתנת לביטול
          </p>
        </div>

        <div className="flex gap-3 justify-center">
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 flex items-center gap-2"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Trash2 size={16} />
            )}
            מחק
          </Button>
          
          <Button
            onClick={onClose}
            disabled={isLoading}
            variant="outline"
            className="px-6 py-2 flex items-center gap-2 hover:bg-gray-50"
          >
            <X size={16} />
            ביטול
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
