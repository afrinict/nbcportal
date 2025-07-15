import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Building2, 
  FileText, 
  Shield, 
  Search, 
  Wrench, 
  Scale, 
  Truck, 
  Radio, 
  AlertTriangle,
  TrendingUp,
  Calendar,
  Mail,
  Settings,
  Database,
  Globe,
  BookOpen,
  Gavel,
  Car,
  Clock
} from 'lucide-react';

const departmentModules = [
  {
    id: 'hr',
    name: 'Human Resources',
    description: 'HR Workflow Process Automation',
    icon: Users,
    color: 'bg-blue-500',
    modules: [
      { name: 'Recruitment', status: 'active', path: '/admin/hr/recruitment' },
      { name: 'Training & Capacity Building', status: 'active', path: '/admin/hr/training' },
      { name: 'Leave Management', status: 'active', path: '/admin/hr/leave' },
      { name: 'Performance Management', status: 'pending', path: '/admin/hr/performance' },
      { name: 'Payroll Processing', status: 'pending', path: '/admin/hr/payroll' },
      { name: 'Administrative Correspondence', status: 'active', path: '/admin/hr/correspondence' }
    ]
  },
  {
    id: 'ohs',
    name: 'Occupational Health & Safety',
    description: 'Safety Management & Incident Reporting',
    icon: Shield,
    color: 'bg-green-500',
    modules: [
      { name: 'Incident Reporting', status: 'active', path: '/admin/ohs/incidents' },
      { name: 'Safety Inspections', status: 'active', path: '/admin/ohs/inspections' },
      { name: 'Safety Training', status: 'active', path: '/admin/ohs/training' },
      { name: 'NCR Management', status: 'active', path: '/admin/ohs/ncr' }
    ]
  },
  {
    id: 'policy',
    name: 'Policy & Research',
    description: 'Knowledge Management Hub',
    icon: BookOpen,
    color: 'bg-purple-500',
    modules: [
      { name: 'Knowledge Capture', status: 'active', path: '/admin/policy/knowledge' },
      { name: 'Information Dissemination', status: 'active', path: '/admin/policy/dissemination' },
      { name: 'Research Workspaces', status: 'pending', path: '/admin/policy/research' },
      { name: 'AI Knowledge Discovery', status: 'pending', path: '/admin/policy/ai' }
    ]
  },
  {
    id: 'public-affairs',
    name: 'Public Affairs',
    description: 'Reputation Management & Communication',
    icon: Globe,
    color: 'bg-orange-500',
    modules: [
      { name: 'Media Monitoring', status: 'active', path: '/admin/public-affairs/media' },
      { name: 'Stakeholder Engagement', status: 'active', path: '/admin/public-affairs/stakeholders' },
      { name: 'Sentiment Analysis', status: 'pending', path: '/admin/public-affairs/sentiment' },
      { name: 'Response Coordination', status: 'active', path: '/admin/public-affairs/response' }
    ]
  },
  {
    id: 'investigation',
    name: 'Investigation & Enforcement',
    description: 'Case Management & Compliance',
    icon: Search,
    color: 'bg-red-500',
    modules: [
      { name: 'Complaint Intake', status: 'active', path: '/admin/investigation/complaints' },
      { name: 'Investigation Process', status: 'active', path: '/admin/investigation/process' },
      { name: 'Mediation & Arbitration', status: 'active', path: '/admin/investigation/mediation' },
      { name: 'Enforcement Actions', status: 'active', path: '/admin/investigation/enforcement' },
      { name: 'Station Inspection', status: 'active', path: '/admin/investigation/inspection' }
    ]
  },
  {
    id: 'engineering',
    name: 'Engineering Department',
    description: 'ICT Support & Asset Management',
    icon: Wrench,
    color: 'bg-indigo-500',
    modules: [
      { name: 'Ticket Management', status: 'active', path: '/admin/engineering/tickets' },
      { name: 'Asset Lifecycle', status: 'active', path: '/admin/engineering/assets' },
      { name: 'Access Management', status: 'active', path: '/admin/engineering/access' },
      { name: 'ID Card Operations', status: 'active', path: '/admin/engineering/id-cards' },
      { name: 'Change Management', status: 'active', path: '/admin/engineering/changes' },
      { name: 'Incident Escalation', status: 'active', path: '/admin/engineering/incidents' }
    ]
  },
  {
    id: 'legal',
    name: 'Legal Department',
    description: 'Legal Process Management',
    icon: Scale,
    color: 'bg-yellow-500',
    modules: [
      { name: 'Court Process Management', status: 'active', path: '/admin/legal/court' },
      { name: 'Solicitor Payment', status: 'active', path: '/admin/legal/payments' },
      { name: 'E-Library Management', status: 'pending', path: '/admin/legal/library' },
      { name: 'Legal Correspondence', status: 'active', path: '/admin/legal/correspondence' }
    ]
  },
  {
    id: 'general-services',
    name: 'General Services',
    description: 'Facility & Logistics Management',
    icon: Truck,
    color: 'bg-teal-500',
    modules: [
      { name: 'Maintenance Requests', status: 'active', path: '/admin/general-services/maintenance' },
      { name: 'Boardroom Booking', status: 'active', path: '/admin/general-services/boardroom' },
      { name: 'Vehicle Booking', status: 'active', path: '/admin/general-services/vehicles' },
      { name: 'Vendor Tracking', status: 'active', path: '/admin/general-services/vendors' },
      { name: 'Digital Logbook', status: 'active', path: '/admin/general-services/logbook' },
      { name: 'Biometric Attendance', status: 'pending', path: '/admin/general-services/attendance' }
    ]
  },
  {
    id: 'broadcast-licensing',
    name: 'Broadcast Licensing (STC)',
    description: 'License Processing & Compliance',
    icon: Radio,
    color: 'bg-pink-500',
    modules: [
      { name: 'License Applications', status: 'active', path: '/admin/licensing/applications' },
      { name: 'Technical Review', status: 'active', path: '/admin/licensing/technical' },
      { name: 'Legal Verification', status: 'active', path: '/admin/licensing/legal' },
      { name: 'Payment Processing', status: 'active', path: '/admin/licensing/payments' },
      { name: 'Presidential Submission', status: 'active', path: '/admin/licensing/presidential' },
      { name: 'Compliance Tracking', status: 'active', path: '/admin/licensing/compliance' }
    ]
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'inactive': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function DashboardsPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">NBC Department Dashboards</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive workflow automation for all NBC departments
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            System Settings
          </Button>
          <Button>
            <TrendingUp className="w-4 h-4 mr-2" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold">1,247</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Active Cases</p>
                <p className="text-2xl font-bold">89</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Pending Approvals</p>
                <p className="text-2xl font-bold">23</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Avg Response Time</p>
                <p className="text-2xl font-bold">2.4h</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {departmentModules.map((department) => {
          const IconComponent = department.icon;
          return (
            <Card key={department.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${department.color}`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{department.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {department.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {department.modules.map((module, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium">{module.name}</span>
                      <Badge className={getStatusColor(module.status)}>
                        {module.status}
                      </Badge>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => window.location.href = `/admin/${department.id}`}
                  >
                    View Department
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* System Overview */}
      <Card>
        <CardHeader>
          <CardTitle>System Overview</CardTitle>
          <CardDescription>
            Real-time status of all NBC workflow systems
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-800">Active Systems</h3>
              <p className="text-2xl font-bold text-green-600">8/9</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800">Total Modules</h3>
              <p className="text-2xl font-bold text-blue-600">47</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-purple-800">Uptime</h3>
              <p className="text-2xl font-bold text-purple-600">99.8%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 