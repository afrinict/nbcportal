import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  TrendingUp,
  BarChart3,
  Calendar,
  Filter,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  UserX
} from 'lucide-react';

interface DepartmentUser {
  id: number;
  username: string;
  email: string;
  department_role: 'department_admin' | 'write' | 'read_only';
  status: 'active' | 'inactive';
  created_at: string;
}

interface DepartmentApplication {
  id: number;
  applicant_name: string;
  license_type: string;
  status: string;
  current_stage: number;
  assigned_to: string;
  created_at: string;
  days_in_process: number;
}

interface DepartmentMetrics {
  total_users: number;
  active_users: number;
  total_applications: number;
  pending_applications: number;
  approved_applications: number;
  rejected_applications: number;
  avg_processing_time: number;
}

const DepartmentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [departmentId, setDepartmentId] = useState<number | null>(null);
  const [departments, setDepartments] = useState<any[]>([]);
  const [users, setUsers] = useState<DepartmentUser[]>([]);
  const [applications, setApplications] = useState<DepartmentApplication[]>([]);
  const [metrics, setMetrics] = useState<DepartmentMetrics>({
    total_users: 0,
    active_users: 0,
    total_applications: 0,
    pending_applications: 0,
    approved_applications: 0,
    rejected_applications: 0,
    avg_processing_time: 0
  });
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data for demonstration
  useEffect(() => {
    const mockDepartments = [
      { id: 1, name: 'Technical Standards', code: 'TECH' },
      { id: 2, name: 'Content Regulation', code: 'CONTENT' },
      { id: 3, name: 'Licensing', code: 'LICENSE' },
      { id: 4, name: 'Compliance', code: 'COMPLIANCE' }
    ];
    setDepartments(mockDepartments);
    setDepartmentId(1); // Default to first department
  }, []);

  useEffect(() => {
    if (departmentId) {
      // Mock data for department users
      const mockUsers: DepartmentUser[] = [
        {
          id: 1,
          username: 'tech_admin',
          email: 'tech.admin@nbc.gov.ng',
          department_role: 'department_admin',
          status: 'active',
          created_at: '2024-01-15'
        },
        {
          id: 2,
          username: 'tech_writer',
          email: 'tech.writer@nbc.gov.ng',
          department_role: 'write',
          status: 'active',
          created_at: '2024-01-20'
        },
        {
          id: 3,
          username: 'tech_reader',
          email: 'tech.reader@nbc.gov.ng',
          department_role: 'read_only',
          status: 'active',
          created_at: '2024-02-01'
        }
      ];

      const mockApplications: DepartmentApplication[] = [
        {
          id: 1,
          applicant_name: 'Radio Nigeria',
          license_type: 'Broadcasting License',
          status: 'pending',
          current_stage: 2,
          assigned_to: 'tech_writer',
          created_at: '2024-01-15',
          days_in_process: 15
        },
        {
          id: 2,
          applicant_name: 'TV Continental',
          license_type: 'Television License',
          status: 'approved',
          current_stage: 4,
          assigned_to: 'tech_admin',
          created_at: '2024-01-10',
          days_in_process: 8
        }
      ];

      const mockMetrics: DepartmentMetrics = {
        total_users: 3,
        active_users: 3,
        total_applications: 25,
        pending_applications: 8,
        approved_applications: 15,
        rejected_applications: 2,
        avg_processing_time: 12
      };

      setUsers(mockUsers);
      setApplications(mockApplications);
      setMetrics(mockMetrics);
    }
  }, [departmentId]);

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'department_admin': return 'destructive';
      case 'write': return 'default';
      case 'read_only': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      default: return 'outline';
    }
  };

  const getApplicationStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Pending</Badge>;
      case 'approved': return <Badge variant="default" className="bg-green-600">Approved</Badge>;
      case 'rejected': return <Badge variant="destructive">Rejected</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const canManageUsers = user?.role === 'admin' || user?.department_role === 'department_admin';
  const canWrite = user?.role === 'admin' || user?.department_role === 'department_admin' || user?.department_role === 'write';
  const canRead = user?.role === 'admin' || user?.department_role === 'department_admin' || user?.department_role === 'write' || user?.department_role === 'read_only';

  if (!canRead) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
              <p className="text-gray-600">You don't have permission to access this department dashboard.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Department Dashboard</h1>
                  <p className="text-gray-600">Manage department operations and monitor performance</p>
                </div>
                <div className="flex items-center space-x-4">
                  <Select value={departmentId?.toString()} onValueChange={(value) => setDepartmentId(parseInt(value))}>
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id.toString()}>
                          {dept.name} ({dept.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">Week</SelectItem>
                      <SelectItem value="month">Month</SelectItem>
                      <SelectItem value="quarter">Quarter</SelectItem>
                      <SelectItem value="year">Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.total_users}</div>
                  <p className="text-xs text-muted-foreground">
                    {metrics.active_users} active
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.total_applications}</div>
                  <p className="text-xs text-muted-foreground">
                    {metrics.pending_applications} pending
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {metrics.total_applications > 0 
                      ? Math.round((metrics.approved_applications / metrics.total_applications) * 100)
                      : 0}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {metrics.approved_applications} approved
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Processing Time</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.avg_processing_time}</div>
                  <p className="text-xs text-muted-foreground">
                    days per application
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="applications">Applications</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Application approved</p>
                            <p className="text-xs text-gray-600">TV Continental license approved by tech_admin</p>
                          </div>
                          <span className="text-xs text-gray-500">2 hours ago</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">New application received</p>
                            <p className="text-xs text-gray-600">Radio Nigeria submitted broadcasting license application</p>
                          </div>
                          <span className="text-xs text-gray-500">1 day ago</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">User role updated</p>
                            <p className="text-xs text-gray-600">tech_writer role changed to write permissions</p>
                          </div>
                          <span className="text-xs text-gray-500">3 days ago</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Quick Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        {canManageUsers && (
                          <Button className="h-20 flex-col gap-2">
                            <Plus className="h-5 w-5" />
                            <span className="text-sm">Add User</span>
                          </Button>
                        )}
                        {canWrite && (
                          <Button variant="outline" className="h-20 flex-col gap-2">
                            <FileText className="h-5 w-5" />
                            <span className="text-sm">Review Applications</span>
                          </Button>
                        )}
                        <Button variant="outline" className="h-20 flex-col gap-2">
                          <BarChart3 className="h-5 w-5" />
                          <span className="text-sm">View Reports</span>
                        </Button>
                        <Button variant="outline" className="h-20 flex-col gap-2">
                          <Calendar className="h-5 w-5" />
                          <span className="text-sm">Schedule Meeting</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="users" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Department Users
                      </CardTitle>
                      {canManageUsers && (
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Add User
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search users..."
                          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Roles</SelectItem>
                          <SelectItem value="department_admin">Department Admin</SelectItem>
                          <SelectItem value="write">Write</SelectItem>
                          <SelectItem value="read_only">Read Only</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 font-medium">User</th>
                            <th className="text-left py-3 px-4 font-medium">Role</th>
                            <th className="text-left py-3 px-4 font-medium">Status</th>
                            <th className="text-left py-3 px-4 font-medium">Joined</th>
                            <th className="text-left py-3 px-4 font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((user) => (
                            <tr key={user.id} className="border-b hover:bg-gray-50">
                              <td className="py-3 px-4">
                                <div>
                                  <div className="font-medium">{user.username}</div>
                                  <div className="text-sm text-gray-600">{user.email}</div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <Badge variant={getRoleBadgeVariant(user.department_role)}>
                                  {user.department_role.replace('_', ' ')}
                                </Badge>
                              </td>
                              <td className="py-3 px-4">
                                <Badge variant={getStatusBadgeVariant(user.status)}>
                                  {user.status}
                                </Badge>
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-600">
                                {new Date(user.created_at).toLocaleDateString()}
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <Button variant="ghost" size="sm">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  {canManageUsers && (
                                    <>
                                      <Button variant="ghost" size="sm">
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button variant="ghost" size="sm">
                                        {user.status === 'active' ? (
                                          <UserX className="h-4 w-4" />
                                        ) : (
                                          <UserCheck className="h-4 w-4" />
                                        )}
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="applications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Department Applications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 font-medium">Applicant</th>
                            <th className="text-left py-3 px-4 font-medium">License Type</th>
                            <th className="text-left py-3 px-4 font-medium">Status</th>
                            <th className="text-left py-3 px-4 font-medium">Stage</th>
                            <th className="text-left py-3 px-4 font-medium">Assigned To</th>
                            <th className="text-left py-3 px-4 font-medium">Days in Process</th>
                            <th className="text-left py-3 px-4 font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {applications.map((app) => (
                            <tr key={app.id} className="border-b hover:bg-gray-50">
                              <td className="py-3 px-4">
                                <div className="font-medium">{app.applicant_name}</div>
                                <div className="text-sm text-gray-600">
                                  {new Date(app.created_at).toLocaleDateString()}
                                </div>
                              </td>
                              <td className="py-3 px-4">{app.license_type}</td>
                              <td className="py-3 px-4">{getApplicationStatusBadge(app.status)}</td>
                              <td className="py-3 px-4">
                                <Badge variant="outline">Stage {app.current_stage}</Badge>
                              </td>
                              <td className="py-3 px-4">{app.assigned_to}</td>
                              <td className="py-3 px-4">
                                <span className={app.days_in_process > 14 ? 'text-red-600 font-medium' : 'text-gray-600'}>
                                  {app.days_in_process} days
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <Button variant="ghost" size="sm">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  {canWrite && (
                                    <Button variant="ghost" size="sm">
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Application Status Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Pending</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-yellow-500 h-2 rounded-full" 
                                style={{ width: `${(metrics.pending_applications / metrics.total_applications) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{metrics.pending_applications}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Approved</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${(metrics.approved_applications / metrics.total_applications) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{metrics.approved_applications}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Rejected</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-red-500 h-2 rounded-full" 
                                style={{ width: `${(metrics.rejected_applications / metrics.total_applications) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{metrics.rejected_applications}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Processing Time Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Processing time analytics will be displayed here</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DepartmentDashboard; 