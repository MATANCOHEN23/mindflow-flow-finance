
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from "lucide-react";

interface FileDropZoneProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

export function FileDropZone({ onFileSelect, isProcessing }: FileDropZoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
      'text/plain': ['.txt'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    disabled: isProcessing
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
        isDragActive 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gold hover:border-blue-400 hover:bg-gray-50'
      } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <p className="text-lg font-medium">
        {isProcessing 
          ? 'מעבד קובץ...' 
          : isDragActive 
            ? 'שחרר את הקובץ כאן...' 
            : 'גרור קובץ או לחץ לבחירה'
        }
      </p>
      <p className="text-sm text-gray-500 mt-2">
        תומך ב: Excel (.xlsx), CSV, Word (.docx), Text (.txt)
      </p>
    </div>
  );
}
