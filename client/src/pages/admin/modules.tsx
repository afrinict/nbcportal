import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { 
  Users, 
  Shield, 
  BookOpen, 
  Globe, 
  Search, 
  Wrench, 
  Scale, 
  Truck, 
  Radio,
  Plus,
  Edit,
  Eye,
  Settings,
  Activity,
  Workflow,
  Database,
  Zap,
  Clock,
  CheckCircle,
  AlertCircle,
  Play,
  Pause
} from 'lucide-react';

const allModules = [
  // HR Modules
  {
    id: 'hr-recruitment',
    name: 'Recruitment',
    department: 'Human Resources',
    description: 'End-to-end recruitment workflow automation',
    status: 'active',
    type: 'workflow',
    icon: Users,
    color: 'bg-blue-500',
    features: ['Job Posting', 'Candidate Screening', 'Interview Scheduling', 'Offer Management'],
    users: 12,
    workflows: 8,
    avgProcessingTime: '3.2 days'
  },
  {
    id: 'hr-training',
    name: 'Training & Capacity Building',
    department: 'Human Resources',
    description: 'Employee training and development management',
    status: 'active',
    type: 'workflow',
    icon: BookOpen,
    color: 'bg-blue-500',
    features: ['Course Management', 'Training Calendar', 'Certification Tracking', 'Skills Assessment'],
    users: 8,
    workflows: 5,
    avgProcessingTime: '1.5 days'
  },
  {
    id: 'hr-leave',
    name: 'Leave Management',
    department: 'Human Resources',
    description: 'Leave request and approval automation',
    status: 'active',
    type: 'workflow',
    icon: Calendar,
    color: 'bg-blue-500',
    features: ['Leave Requests', 'Approval Workflow', 'Leave Balance', 'Calendar Integration'],
    users: 45,
    workflows: 3,
    avgProcessingTime: '0.5 days'
  },
  {
    id: 'hr-performance',
    name: 'Performance Management',
    department: 'Human Resources',
    description: 'Performance evaluation and goal setting',
    status: 'pending',
    type: 'workflow',
    icon: TrendingUp,
    color: 'bg-blue-500',
    features: ['Goal Setting', 'Performance Reviews', '360 Feedback', 'Development Plans'],
    users: 0,
    workflows: 0,
    avgProcessingTime: 'N/A'
  },
  {
    id: 'hr-payroll',
    name: 'Payroll Processing',
    department: 'Human Resources',
    description: 'Automated payroll and benefits management',
    status: 'pending',
    type: 'integration',
    icon: Database,
    color: 'bg-blue-500',
    features: ['Salary Processing', 'Benefits Management', 'Tax Calculations', 'Report Generation'],
    users: 0,
    workflows: 0,
    avgProcessingTime: 'N/A'
  },
  {
    id: 'hr-correspondence',
    name: 'Administrative Correspondence',
    department: 'Human Resources',
    description: 'HR document and correspondence management',
    status: 'active',
    type: 'workflow',
    icon: Mail,
    color: 'bg-blue-500',
    features: ['Document Templates', 'Approval Routing', 'Digital Signatures', 'Archive Management'],
    users: 15,
    workflows: 6,
    avgProcessingTime: '1.0 days'
  },

  // OHS Modules
  {
    id: 'ohs-incidents',
    name: 'Incident Reporting',
    department: 'Occupational Health & Safety',
    description: 'Safety incident reporting and investigation',
    status: 'active',
    type: 'workflow',
    icon: AlertCircle,
    color: 'bg-green-500',
    features: ['Incident Reporting', 'Investigation Workflow', 'Corrective Actions', 'Safety Alerts'],
    users: 23,
    workflows: 4,
    avgProcessingTime: '2.1 days'
  },
  {
    id: 'ohs-inspections',
    name: 'Safety Inspections',
    department: 'Occupational Health & Safety',
    description: 'Routine safety inspections and compliance',
    status: 'active',
    type: 'workflow',
    icon: Shield,
    color: 'bg-green-500',
    features: ['Inspection Checklists', 'Mobile Data Collection', 'Risk Assessment', 'Compliance Tracking'],
    users: 18,
    workflows: 3,
    avgProcessingTime: '1.8 days'
  },
  {
    id: 'ohs-training',
    name: 'Safety Training',
    department: 'Occupational Health & Safety',
    description: 'Safety awareness and training management',
    status: 'active',
    type: 'workflow',
    icon: BookOpen,
    color: 'bg-green-500',
    features: ['Training Courses', 'Certification Tracking', 'Compliance Monitoring', 'Safety Alerts'],
    users: 20,
    workflows: 4,
    avgProcessingTime: '1.2 days'
  },
  {
    id: 'ohs-ncr',
    name: 'NCR Management',
    department: 'Occupational Health & Safety',
    description: 'Non-Conformance Report management',
    status: 'active',
    type: 'workflow',
    icon: AlertTriangle,
    color: 'bg-green-500',
    features: ['NCR Creation', 'Root Cause Analysis', 'Corrective Actions', 'Follow-up Tracking'],
    users: 12,
    workflows: 3,
    avgProcessingTime: '3.5 days'
  },

  // Policy & Research Modules
  {
    id: 'policy-knowledge',
    name: 'Knowledge Capture',
    department: 'Policy & Research',
    description: 'Knowledge capture and curation system',
    status: 'active',
    type: 'workflow',
    icon: Database,
    color: 'bg-purple-500',
    features: ['Document Ingestion', 'Metadata Extraction', 'Taxonomy Management', 'Search Indexing'],
    users: 18,
    workflows: 5,
    avgProcessingTime: '0.8 days'
  },
  {
    id: 'policy-dissemination',
    name: 'Information Dissemination',
    department: 'Policy & Research',
    description: 'Policy information distribution system',
    status: 'active',
    type: 'workflow',
    icon: Globe,
    color: 'bg-purple-500',
    features: ['Content Publishing', 'Audience Targeting', 'Delivery Tracking', 'Feedback Collection'],
    users: 15,
    workflows: 4,
    avgProcessingTime: '0.5 days'
  },
  {
    id: 'policy-research',
    name: 'Research Workspaces',
    department: 'Policy & Research',
    description: 'Collaborative research workspace',
    status: 'pending',
    type: 'workflow',
    icon: BookOpen,
    color: 'bg-purple-500',
    features: ['Version Control', 'Peer Review', 'Collaboration Tools', 'Research Analytics'],
    users: 0,
    workflows: 0,
    avgProcessingTime: 'N/A'
  },
  {
    id: 'policy-ai',
    name: 'AI Knowledge Discovery',
    department: 'Policy & Research',
    description: 'AI-powered knowledge discovery and recommendations',
    status: 'pending',
    type: 'ai',
    icon: Zap,
    color: 'bg-purple-500',
    features: ['Recommendation Engine', 'Impact Analytics', 'Cross-Department Sharing', 'Knowledge Radar'],
    users: 0,
    workflows: 0,
    avgProcessingTime: 'N/A'
  },

  // Public Affairs Modules
  {
    id: 'pa-media',
    name: 'Media Monitoring',
    department: 'Public Affairs',
    description: 'Real-time media monitoring and analysis',
    status: 'active',
    type: 'monitoring',
    icon: Globe,
    color: 'bg-orange-500',
    features: ['Media Tracking', 'Sentiment Analysis', 'Alert System', 'Report Generation'],
    users: 32,
    workflows: 3,
    avgProcessingTime: '0.1 days'
  },
  {
    id: 'pa-stakeholders',
    name: 'Stakeholder Engagement',
    department: 'Public Affairs',
    description: 'Stakeholder relationship management',
    status: 'active',
    type: 'workflow',
    icon: Users,
    color: 'bg-orange-500',
    features: ['Stakeholder Database', 'Communication Tracking', 'Engagement Planning', 'Feedback Management'],
    users: 25,
    workflows: 4,
    avgProcessingTime: '1.5 days'
  },
  {
    id: 'pa-sentiment',
    name: 'Sentiment Analysis',
    department: 'Public Affairs',
    description: 'Public sentiment analysis and reporting',
    status: 'pending',
    type: 'ai',
    icon: TrendingUp,
    color: 'bg-orange-500',
    features: ['Sentiment Tracking', 'Trend Analysis', 'Report Generation', 'Alert System'],
    users: 0,
    workflows: 0,
    avgProcessingTime: 'N/A'
  },
  {
    id: 'pa-response',
    name: 'Response Coordination',
    department: 'Public Affairs',
    description: 'Coordinated response management system',
    status: 'active',
    type: 'workflow',
    icon: Mail,
    color: 'bg-orange-500',
    features: ['Response Templates', 'Approval Workflow', 'Multi-Channel Distribution', 'Response Tracking'],
    users: 28,
    workflows: 5,
    avgProcessingTime: '2.0 days'
  },

  // Investigation & Enforcement Modules
  {
    id: 'ie-complaints',
    name: 'Complaint Intake',
    department: 'Investigation & Enforcement',
    description: 'Digital complaint intake and triage system',
    status: 'active',
    type: 'workflow',
    icon: Search,
    color: 'bg-red-500',
    features: ['Digital Intake', 'AI-Assisted Triage', 'Evidence Management', 'Case Assignment'],
    users: 28,
    workflows: 6,
    avgProcessingTime: '1.2 days'
  },
  {
    id: 'ie-process',
    name: 'Investigation Process',
    department: 'Investigation & Enforcement',
    description: 'Investigation workflow management',
    status: 'active',
    type: 'workflow',
    icon: Search,
    color: 'bg-red-500',
    features: ['Case Management', 'Evidence Collection', 'Legal Framework', 'Progress Tracking'],
    users: 22,
    workflows: 8,
    avgProcessingTime: '5.5 days'
  },
  {
    id: 'ie-mediation',
    name: 'Mediation & Arbitration',
    department: 'Investigation & Enforcement',
    description: 'Virtual mediation and arbitration system',
    status: 'active',
    type: 'workflow',
    icon: Scale,
    color: 'bg-red-500',
    features: ['Virtual Rooms', 'Document Sharing', 'Settlement Tracking', 'Outcome Management'],
    users: 15,
    workflows: 4,
    avgProcessingTime: '3.8 days'
  },
  {
    id: 'ie-enforcement',
    name: 'Enforcement Actions',
    department: 'Investigation & Enforcement',
    description: 'Enforcement order and action management',
    status: 'active',
    type: 'workflow',
    icon: Gavel,
    color: 'bg-red-500',
    features: ['Order Generation', 'Action Tracking', 'Compliance Monitoring', 'Public Register'],
    users: 18,
    workflows: 5,
    avgProcessingTime: '2.5 days'
  },
  {
    id: 'ie-inspection',
    name: 'Station Inspection',
    department: 'Investigation & Enforcement',
    description: 'Broadcaster station inspection system',
    status: 'active',
    type: 'workflow',
    icon: Search,
    color: 'bg-red-500',
    features: ['Inspection Scheduling', 'Mobile Data Collection', 'Compliance Scoring', 'Risk Assessment'],
    users: 20,
    workflows: 4,
    avgProcessingTime: '4.2 days'
  },

  // Engineering Modules
  {
    id: 'eng-tickets',
    name: 'Ticket Management',
    department: 'Engineering Department',
    description: 'Unified ICT support ticket system',
    status: 'active',
    type: 'workflow',
    icon: Wrench,
    color: 'bg-indigo-500',
    features: ['Ticket Intake', 'AI Classification', 'Escalation Management', 'Resolution Tracking'],
    users: 35,
    workflows: 8,
    avgProcessingTime: '1.8 days'
  },
  {
    id: 'eng-assets',
    name: 'Asset Lifecycle',
    department: 'Engineering Department',
    description: 'ICT asset lifecycle management',
    status: 'active',
    type: 'workflow',
    icon: Database,
    color: 'bg-indigo-500',
    features: ['Asset Tracking', 'Procurement Workflow', 'Maintenance Scheduling', 'Disposal Management'],
    users: 25,
    workflows: 6,
    avgProcessingTime: '2.1 days'
  },
  {
    id: 'eng-access',
    name: 'Access Management',
    department: 'Engineering Department',
    description: 'Role-based access control system',
    status: 'active',
    type: 'security',
    icon: Shield,
    color: 'bg-indigo-500',
    features: ['Access Control', 'Role Management', 'Policy Engine', 'Audit Logging'],
    users: 30,
    workflows: 4,
    avgProcessingTime: '0.5 days'
  },
  {
    id: 'eng-id-cards',
    name: 'ID Card Operations',
    department: 'Engineering Department',
    description: 'ID card production and management',
    status: 'active',
    type: 'workflow',
    icon: CreditCard,
    color: 'bg-indigo-500',
    features: ['Card Production', 'Photo Capture', 'Printing Workflow', 'Distribution Tracking'],
    users: 12,
    workflows: 3,
    avgProcessingTime: '1.0 days'
  },
  {
    id: 'eng-changes',
    name: 'Change Management',
    department: 'Engineering Department',
    description: 'IT change advisory board workflows',
    status: 'active',
    type: 'workflow',
    icon: Settings,
    color: 'bg-indigo-500',
    features: ['Change Requests', 'Advisory Board', 'Risk Assessment', 'Implementation Tracking'],
    users: 20,
    workflows: 5,
    avgProcessingTime: '3.5 days'
  },
  {
    id: 'eng-incidents',
    name: 'Incident Escalation',
    department: 'Engineering Department',
    description: 'ICT incident war room protocols',
    status: 'active',
    type: 'workflow',
    icon: AlertTriangle,
    color: 'bg-indigo-500',
    features: ['Incident Detection', 'Escalation Matrix', 'War Room Protocols', 'Resolution Tracking'],
    users: 28,
    workflows: 4,
    avgProcessingTime: '0.8 days'
  },

  // Legal Modules
  {
    id: 'legal-court',
    name: 'Court Process Management',
    department: 'Legal Department',
    description: 'Legal correspondence and court process management',
    status: 'active',
    type: 'workflow',
    icon: Scale,
    color: 'bg-yellow-500',
    features: ['Document Processing', 'Deadline Tracking', 'Court Integration', 'Case Management'],
    users: 15,
    workflows: 6,
    avgProcessingTime: '2.5 days'
  },
  {
    id: 'legal-payments',
    name: 'Solicitor Payment',
    department: 'Legal Department',
    description: 'External solicitor payment workflow',
    status: 'active',
    type: 'workflow',
    icon: CreditCard,
    color: 'bg-yellow-500',
    features: ['Solicitor Database', 'Approval Chain', 'Finance Integration', 'Payment Tracking'],
    users: 8,
    workflows: 4,
    avgProcessingTime: '3.2 days'
  },
  {
    id: 'legal-library',
    name: 'E-Library Management',
    department: 'Legal Department',
    description: 'Legal e-library and research system',
    status: 'pending',
    type: 'workflow',
    icon: BookOpen,
    color: 'bg-yellow-500',
    features: ['Document Ingestion', 'AI Research', 'Access Controls', 'Search Engine'],
    users: 0,
    workflows: 0,
    avgProcessingTime: 'N/A'
  },
  {
    id: 'legal-correspondence',
    name: 'Legal Correspondence',
    department: 'Legal Department',
    description: 'Legal correspondence management',
    status: 'active',
    type: 'workflow',
    icon: Mail,
    color: 'bg-yellow-500',
    features: ['Correspondence Tracking', 'Template Management', 'Approval Workflow', 'Archive System'],
    users: 12,
    workflows: 3,
    avgProcessingTime: '1.8 days'
  },

  // General Services Modules
  {
    id: 'gs-maintenance',
    name: 'Maintenance Requests',
    department: 'General Services',
    description: 'Digital maintenance request system',
    status: 'active',
    type: 'workflow',
    icon: Wrench,
    color: 'bg-teal-500',
    features: ['Request Intake', 'Priority Classification', 'Vendor Assignment', 'Completion Tracking'],
    users: 42,
    workflows: 5,
    avgProcessingTime: '2.8 days'
  },
  {
    id: 'gs-boardroom',
    name: 'Boardroom Booking',
    department: 'General Services',
    description: 'Boardroom and facility booking system',
    status: 'active',
    type: 'workflow',
    icon: Calendar,
    color: 'bg-teal-500',
    features: ['Room Booking', 'Calendar Integration', 'Resource Management', 'Conflict Resolution'],
    users: 35,
    workflows: 3,
    avgProcessingTime: '0.2 days'
  },
  {
    id: 'gs-vehicles',
    name: 'Vehicle Booking',
    department: 'General Services',
    description: 'Vehicle booking and management system',
    status: 'active',
    type: 'workflow',
    icon: Truck,
    color: 'bg-teal-500',
    features: ['Vehicle Booking', 'Driver Assignment', 'Route Planning', 'Fuel Tracking'],
    users: 28,
    workflows: 4,
    avgProcessingTime: '0.5 days'
  },
  {
    id: 'gs-vendors',
    name: 'Vendor Tracking',
    department: 'General Services',
    description: 'Vendor performance tracking system',
    status: 'active',
    type: 'workflow',
    icon: Users,
    color: 'bg-teal-500',
    features: ['Vendor Database', 'Performance Metrics', 'Contract Management', 'Payment Tracking'],
    users: 20,
    workflows: 4,
    avgProcessingTime: '1.5 days'
  },
  {
    id: 'gs-logbook',
    name: 'Digital Logbook',
    department: 'General Services',
    description: 'Digital vehicle logbook system',
    status: 'active',
    type: 'workflow',
    icon: BookOpen,
    color: 'bg-teal-500',
    features: ['Trip Logging', 'Fuel Records', 'Maintenance History', 'Driver Reports'],
    users: 25,
    workflows: 3,
    avgProcessingTime: '0.3 days'
  },
  {
    id: 'gs-attendance',
    name: 'Biometric Attendance',
    department: 'General Services',
    description: 'Biometric time attendance system',
    status: 'pending',
    type: 'integration',
    icon: Clock,
    color: 'bg-teal-500',
    features: ['Biometric Integration', 'Time Tracking', 'Leave Integration', 'Report Generation'],
    users: 0,
    workflows: 0,
    avgProcessingTime: 'N/A'
  },

  // Broadcast Licensing Modules
  {
    id: 'lic-applications',
    name: 'License Applications',
    department: 'Broadcast Licensing (STC)',
    description: 'License application processing system',
    status: 'active',
    type: 'workflow',
    icon: Radio,
    color: 'bg-pink-500',
    features: ['Application Intake', 'Document Validation', 'Workflow Routing', 'Status Tracking'],
    users: 38,
    workflows: 8,
    avgProcessingTime: '15.2 days'
  },
  {
    id: 'lic-technical',
    name: 'Technical Review',
    department: 'Broadcast Licensing (STC)',
    description: 'Technical review and assessment system',
    status: 'active',
    type: 'workflow',
    icon: Wrench,
    color: 'bg-pink-500',
    features: ['Technical Assessment', 'DET Integration', 'Compliance Checks', 'Review Workflow'],
    users: 25,
    workflows: 6,
    avgProcessingTime: '8.5 days'
  },
  {
    id: 'lic-legal',
    name: 'Legal Verification',
    department: 'Broadcast Licensing (STC)',
    description: 'Legal verification automation system',
    status: 'active',
    type: 'workflow',
    icon: Scale,
    color: 'bg-pink-500',
    features: ['Legal Checks', 'Document Verification', 'Compliance Validation', 'Approval Workflow'],
    users: 18,
    workflows: 4,
    avgProcessingTime: '5.2 days'
  },
  {
    id: 'lic-payments',
    name: 'Payment Processing',
    department: 'Broadcast Licensing (STC)',
    description: 'License payment processing system',
    status: 'active',
    type: 'workflow',
    icon: CreditCard,
    color: 'bg-pink-500',
    features: ['Payment Gateway', 'Fee Calculation', 'Receipt Generation', 'Payment Tracking'],
    users: 30,
    workflows: 3,
    avgProcessingTime: '1.0 days'
  },
  {
    id: 'lic-presidential',
    name: 'Presidential Submission',
    department: 'Broadcast Licensing (STC)',
    description: 'Presidential submission package system',
    status: 'active',
    type: 'workflow',
    icon: Mail,
    color: 'bg-pink-500',
    features: ['Document Compilation', 'Digital Signatures', 'Submission Tracking', 'Approval Chain'],
    users: 12,
    workflows: 5,
    avgProcessingTime: '12.5 days'
  },
  {
    id: 'lic-compliance',
    name: 'Compliance Tracking',
    department: 'Broadcast Licensing (STC)',
    description: 'License compliance tracking system',
    status: 'active',
    type: 'workflow',
    icon: CheckCircle,
    color: 'bg-pink-500',
    features: ['Renewal Tracking', 'Fee Monitoring', 'Audit Scheduling', 'Compliance Reports'],
    users: 22,
    workflows: 4,
    avgProcessingTime: '2.8 days'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'inactive': return 'bg-gray-100 text-gray-800';
    case 'maintenance': return 'bg-orange-100 text-orange-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'workflow': return 'bg-blue-100 text-blue-800';
    case 'monitoring': return 'bg-purple-100 text-purple-800';
    case 'ai': return 'bg-green-100 text-green-800';
    case 'integration': return 'bg-orange-100 text-orange-800';
    case 'security': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function ModulesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedModule, setSelectedModule] = useState<any>(null);

  const filteredModules = allModules.filter(module => {
    const matchesSearch = module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || module.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || module.status === statusFilter;
    const matchesType = typeFilter === 'all' || module.type === typeFilter;
    return matchesSearch && matchesDepartment && matchesStatus && matchesType;
  });

  const departments = [...new Set(allModules.map(m => m.department))];
  const types = [...new Set(allModules.map(m => m.type))];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">NBC Workflow Modules</h1>
          <p className="text-gray-600 mt-2">
            Manage all workflow modules across departments
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Workflow className="w-4 h-4 mr-2" />
            Workflow Builder
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Module
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Workflow className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total Modules</p>
                <p className="text-2xl font-bold">{allModules.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Active Modules</p>
                <p className="text-2xl font-bold">{allModules.filter(m => m.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold">{allModules.reduce((sum, m) => sum + m.users, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Avg Processing</p>
                <p className="text-2xl font-bold">2.1 days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search modules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map(dept => (
              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {types.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((module) => {
          const IconComponent = module.icon;
          return (
            <Card key={module.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${module.color}`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{module.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {module.department}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Badge className={getStatusColor(module.status)}>
                      {module.status}
                    </Badge>
                    <Badge className={getTypeColor(module.type)}>
                      {module.type}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">{module.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Users</p>
                      <p className="font-semibold">{module.users}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Workflows</p>
                      <p className="font-semibold">{module.workflows}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">Key Features:</p>
                    <div className="flex flex-wrap gap-1">
                      {module.features.slice(0, 3).map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {module.features.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{module.features.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedModule(module)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-1" />
                      Configure
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Module Detail Modal */}
      {selectedModule && (
        <Dialog open={!!selectedModule} onOpenChange={() => setSelectedModule(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedModule.name}</DialogTitle>
              <DialogDescription>
                {selectedModule.description}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Department</Label>
                  <p className="font-medium">{selectedModule.department}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Status</Label>
                  <Badge className={getStatusColor(selectedModule.status)}>
                    {selectedModule.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Type</Label>
                  <Badge className={getTypeColor(selectedModule.type)}>
                    {selectedModule.type}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Avg Processing Time</Label>
                  <p className="font-medium">{selectedModule.avgProcessingTime}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Active Users</Label>
                  <p className="font-medium">{selectedModule.users}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Workflows</Label>
                  <p className="font-medium">{selectedModule.workflows}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-600">Features</Label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {selectedModule.features.map((feature: string, index: number) => (
                    <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedModule(null)}>
                Close
              </Button>
              <Button>
                <Activity className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
} 