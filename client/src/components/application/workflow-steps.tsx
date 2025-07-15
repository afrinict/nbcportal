import { CheckCircle, Clock, Circle } from 'lucide-react';

interface WorkflowStep {
  name: string;
  status: 'completed' | 'current' | 'pending';
}

interface WorkflowStepsProps {
  steps: WorkflowStep[];
}

export function WorkflowSteps({ steps }: WorkflowStepsProps) {
  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-nbc-success" />;
      case 'current':
        return <Clock className="h-5 w-5 text-nbc-orange" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-nbc-success';
      case 'current':
        return 'text-nbc-orange';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="flex items-center justify-between text-sm">
      {steps.map((step, index) => (
        <div key={index} className={`flex items-center ${getStepColor(step.status)}`}>
          {getStepIcon(step.status)}
          <span className="ml-1">{step.name}</span>
        </div>
      ))}
    </div>
  );
}
