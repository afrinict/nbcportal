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
  Trash2,
  Eye,
  Settings,
  Activity
} from 'lucide-react';

const departments = [
  {
    id: 1,
    name: 'Human Resources',
    code: 'HR',
    description: 'HR Workflow Process Automation',
    icon: Users,
    color: 'bg-blue-500',
    status: 'active',
    modules: 6,
    users: 45,
    head: 'Mrs. Sarah Johnson',
    email: 'hr@nbc.gov.ng',
    phone: '+234 803 123 4567'
  },
  {
    id: 2,
    name: 'Occupational Health & Safety',
    code: 'OHS',
    description: 'Safety Management & Incident Reporting',
    icon: Shield,
    color: 'bg-green-500',
    status: 'active',
    modules: 4,
    users: 23,
    head: 'Mr. David Okonkwo',
    email: 'ohs@nbc.gov.ng',
    phone: '+234 803 123 4568'
  },
  {
    id: 3,
    name: 'Policy & Research',
    code: 'PR',
    description: 'Knowledge Management Hub',
    icon: BookOpen,
    color: 'bg-purple-500',
    status: 'active',
    modules: 4,
    users: 18,
    head: 'Dr. Amina Hassan',
    email: 'policy@nbc.gov.ng',
    phone: '+234 803 123 4569'
  },
  {
    id: 4,
    name: 'Public Affairs',
    code: 'PA',
    description: 'Reputation Management & Communication',
    icon: Globe,
    color: 'bg-orange-500',
    status: 'active',
    modules: 4,
    users: 32,
    head: 'Mr. Femi Adebayo',
    email: 'publicaffairs@nbc.gov.ng',
    phone: '+234 803 123 4570'
  },
  {
    id: 5,
    name: 'Investigation & Enforcement',
    code: 'I&E',
    description: 'Case Management & Compliance',
    icon: Search,
    color: 'bg-red-500',
    status: 'active',
    modules: 5,
    users: 28,
    head: 'Mrs. Grace Eze',
    email: 'investigation@nbc.gov.ng',
    phone: '+234 803 123 4571'
  },
  {
    id: 6,
    name: 'Engineering Department',
    code: 'ENG',
    description: 'ICT Support & Asset Management',
    icon: Wrench,
    color: 'bg-indigo-500',
    status: 'active',
    modules: 6,
    users: 35,
    head: 'Engr. Michael Bello',
    email: 'engineering@nbc.gov.ng',
    phone: '+234 803 123 4572'
  },
  {
    id: 7,
    name: 'Legal Department',
    code: 'LEG',
    description: 'Legal Process Management',
    icon: Scale,
    color: 'bg-yellow-500',
    status: 'active',
    modules: 4,
    users: 15,
    head: 'Barr. Chukwudi Nwankwo',
    email: 'legal@nbc.gov.ng',
    phone: '+234 803 123 4573'
  },
  {
    id: 8,
    name: 'General Services',
    code: 'GS',
    description: 'Facility & Logistics Management',
    icon: Truck,
    color: 'bg-teal-500',
    status: 'active',
    modules: 6,
    users: 42,
    head: 'Mr. Ibrahim Musa',
    email: 'generalservices@nbc.gov.ng',
    phone: '+234 803 123 4574'
  },
  {
    id: 9,
    name: 'Broadcast Licensing (STC)',
    code: 'STC',
    description: 'License Processing & Compliance',
    icon: Radio,
    color: 'bg-pink-500',
    status: 'active',
    modules: 6,
    users: 38,
    head: 'Mrs. Patricia Okechukwu',
    email: 'licensing@nbc.gov.ng',
    phone: '+234 803 123 4575'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800';
    case 'inactive': return 'bg-gray-100 text-gray-800';
    case 'maintenance': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function DepartmentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState<any>(null);

  const filteredDepartments = departments.filter(dept => {
    const matchesSearch = dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dept.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || dept.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">NBC Departments</h1>
          <p className="text-gray-600 mt-2">
            Manage all departments and their workflow modules
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Department
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Department</DialogTitle>
              <DialogDescription>
                Create a new department with its modules and settings.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="Department name"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="code" className="text-right">
                  Code
                </Label>
                <Input
                  id="code"
                  placeholder="Department code"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  placeholder="Department description"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Create Department</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search departments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDepartments.map((department) => {
          const IconComponent = department.icon;
          return (
            <Card key={department.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${department.color}`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{department.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {department.code} • {department.description}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={getStatusColor(department.status)}>
                    {department.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Modules</p>
                      <p className="font-semibold">{department.modules}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Users</p>
                      <p className="font-semibold">{department.users}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-gray-600">Department Head</p>
                      <p className="font-medium">{department.head}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Contact</p>
                      <p className="font-medium">{department.email}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedDepartment(department)}
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
                      Settings
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Department Detail Modal */}
      {selectedDepartment && (
        <Dialog open={!!selectedDepartment} onOpenChange={() => setSelectedDepartment(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedDepartment.name} Department</DialogTitle>
              <DialogDescription>
                Detailed view of department information and modules
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Department Code</Label>
                  <p className="text-lg font-semibold">{selectedDepartment.code}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Status</Label>
                  <Badge className={getStatusColor(selectedDepartment.status)}>
                    {selectedDepartment.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Department Head</Label>
                  <p className="font-medium">{selectedDepartment.head}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Contact Email</Label>
                  <p className="font-medium">{selectedDepartment.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Phone</Label>
                  <p className="font-medium">{selectedDepartment.phone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Total Users</Label>
                  <p className="font-medium">{selectedDepartment.users}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-600">Description</Label>
                <p className="text-gray-700">{selectedDepartment.description}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">Modules ({selectedDepartment.modules})</Label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {Array.from({ length: selectedDepartment.modules }, (_, i) => (
                    <div key={i} className="p-2 bg-gray-50 rounded text-sm">
                      Module {i + 1}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedDepartment(null)}>
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