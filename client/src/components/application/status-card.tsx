import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Eye, Download } from 'lucide-react';
import { Application } from '@shared/schema';

interface StatusCardProps {
  application: Application;
  onViewDetails: (id: number) => void;
  onDownloadReceipt: (id: number) => void;
}

export function StatusCard({ application, onViewDetails, onDownloadReceipt }: StatusCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'under_review':
      case 'technical review':
        return 'bg-orange-100 text-orange-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-lg font-medium text-gray-900">{application.title}</h4>
          <p className="text-sm text-gray-500">Application ID: {application.applicationId}</p>
          <p className="text-sm text-gray-500">
            Submitted: {new Date(application.submittedAt).toLocaleDateString()}
          </p>
        </div>
        <Badge className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(application.status)}`}>
          {application.currentStage || application.status}
        </Badge>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{application.progress}%</span>
        </div>
        <Progress value={application.progress} className="w-full h-2" />
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
        <Button 
          variant="ghost" 
          className="text-nbc-blue hover:text-blue-700 text-sm font-medium"
          onClick={() => onViewDetails(application.id)}
        >
          <Eye className="mr-1 h-4 w-4" />
          View Details
        </Button>
        <Button 
          variant="ghost" 
          className="text-gray-600 hover:text-gray-900 text-sm font-medium"
          onClick={() => onDownloadReceipt(application.id)}
        >
          <Download className="mr-1 h-4 w-4" />
          Download Receipt
        </Button>
      </div>
    </div>
  );
}
