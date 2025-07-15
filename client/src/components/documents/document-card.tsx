import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Upload } from 'lucide-react';
import { Document } from '@shared/schema';

interface DocumentCardProps {
  document?: Document;
  name: string;
  type: string;
  status: 'verified' | 'pending' | 'required';
  uploadedDate?: string;
  fileSize?: string;
  onDownload?: () => void;
  onUpload?: () => void;
}

export function DocumentCard({ 
  document, 
  name, 
  type, 
  status, 
  uploadedDate, 
  fileSize, 
  onDownload, 
  onUpload 
}: DocumentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'required':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getIconColor = (status: string) => {
    switch (status) {
      case 'verified':
      case 'pending':
        return 'text-nbc-blue';
      case 'required':
        return 'text-orange-500';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <FileText className={`text-2xl ${getIconColor(status)}`} />
        <Badge className={`text-xs px-2 py-1 rounded-full ${getStatusColor(status)}`}>
          {status === 'verified' ? 'Verified' : status === 'pending' ? 'Pending' : 'Required'}
        </Badge>
      </div>
      <h4 className="font-medium text-gray-900 text-sm mb-1">{name}</h4>
      <p className="text-xs text-gray-500 mb-3">
        {uploadedDate ? `Uploaded ${uploadedDate}` : 'Upload required'}
      </p>
      <div className="flex justify-between items-center text-xs">
        <span className="text-gray-500">
          {fileSize || 'Required document'}
        </span>
        {status === 'required' ? (
          <Button 
            size="sm" 
            variant="ghost" 
            className="text-nbc-blue hover:text-blue-700 font-medium"
            onClick={onUpload}
          >
            <Upload className="mr-1 h-3 w-3" />
            Upload
          </Button>
        ) : (
          <Button 
            size="sm" 
            variant="ghost" 
            className="text-nbc-blue hover:text-blue-700 font-medium"
            onClick={onDownload}
          >
            <Download className="mr-1 h-3 w-3" />
            Download
          </Button>
        )}
      </div>
    </div>
  );
}
