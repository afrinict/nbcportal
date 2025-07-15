import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  Shield, 
  UserCheck, 
  UserX, 
  Edit, 
  Trash2, 
  Plus,
  Building2,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface DepartmentRole {
  id: number;
  name: string;
  code: string;
  permissions: {
    can_read: boolean;
    can_write: boolean;
    can_delete: boolean;
    can_manage_users: boolean;
    can_approve_applications: boolean;
    can_view_analytics: boolean;
  };
  description: string;
  user_count: number;
}

interface Department {
  id: number;
  name: string;
  code: string;
  roles: DepartmentRole[];
}

const DepartmentRoles: React.FC = () => {
  const { user } = useAuth();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null);
  const [isAddRoleDialogOpen, setIsAddRoleDialogOpen] = useState(false);
  const [isEditRoleDialogOpen, setIsEditRoleDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<DepartmentRole | null>(null);
  const [newRole, setNewRole] = useState({
    name: '',
    code: '',
    description: '',
    permissions: {
      can_read: true,
      can_write: false,
      can_delete: false,
      can_manage_users: false,
      can_approve_applications: false,
      can_view_analytics: true
    }
  });

  // Mock data for demonstration
  useEffect(() => {
    const mockDepartments: Department[] = [
      {
        id: 1,
        name: 'Technical Standards',
        code: 'TECH',
        roles: [
          {
            id: 1,
            name: 'Department Admin',
            code: 'department_admin',
            permissions: {
              can_read: true,
              can_write: true,
              can_delete: true,
              can_manage_users: true,
              can_approve_applications: true,
              can_view_analytics: true
            },
            description: 'Full administrative access to department operations',
            user_count: 2
          },
          {
            id: 2,
            name: 'Write Access',
            code: 'write',
            permissions: {
              can_read: true,
              can_write: true,
              can_delete: false,
              can_manage_users: false,
              can_approve_applications: false,
              can_view_analytics: true
            },
            description: 'Can read and write but cannot delete or manage users',
            user_count: 5
          },
          {
            id: 3,
            name: 'Read Only',
            code: 'read_only',
            permissions: {
              can_read: true,
              can_write: false,
              can_delete: false,
              can_manage_users: false,
              can_approve_applications: false,
              can_view_analytics: true
            },
            description: 'Read-only access to department data',
            user_count: 8
          }
        ]
      }
    ];
    setDepartments(mockDepartments);
    setSelectedDepartment(1);
  }, []);

  const getPermissionIcon = (hasPermission: boolean) => {
    return hasPermission ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-red-600" />
    );
  };

  const getRoleBadgeVariant = (code: string) => {
    switch (code) {
      case 'department_admin': return 'destructive';
      case 'write': return 'default';
      case 'read_only': return 'secondary';
      default: return 'outline';
    }
  };

  const selectedDepartmentData = departments.find(d => d.id === selectedDepartment);

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
              <p className="text-gray-600">Only administrators can manage department roles.</p>
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
                  <h1 className="text-3xl font-bold text-gray-900">Department Roles Management</h1>
                  <p className="text-gray-600">Manage role-based access control for each department</p>
                </div>
                <div className="flex items-center space-x-4">
                  <Select value={selectedDepartment?.toString()} onValueChange={(value) => setSelectedDepartment(parseInt(value))}>
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
                </div>
              </div>
            </div>

            {selectedDepartmentData && (
              <div className="space-y-6">
                {/* Department Info */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        {selectedDepartmentData.name} Department
                      </CardTitle>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Role
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {selectedDepartmentData.roles.map((role) => (
                        <Card key={role.id} className="relative">
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div>
                                <CardTitle className="flex items-center gap-2">
                                  <Shield className="h-4 w-4" />
                                  {role.name}
                                </CardTitle>
                                <Badge variant={getRoleBadgeVariant(role.code)} className="mt-2">
                                  {role.code}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  disabled={role.user_count > 0}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-600 mb-4">{role.description}</p>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span>Users with this role:</span>
                                <Badge variant="outline">{role.user_count}</Badge>
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                  <span>Read Access</span>
                                  {getPermissionIcon(role.permissions.can_read)}
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                  <span>Write Access</span>
                                  {getPermissionIcon(role.permissions.can_write)}
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                  <span>Delete Access</span>
                                  {getPermissionIcon(role.permissions.can_delete)}
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                  <span>Manage Users</span>
                                  {getPermissionIcon(role.permissions.can_manage_users)}
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                  <span>Approve Applications</span>
                                  {getPermissionIcon(role.permissions.can_approve_applications)}
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                  <span>View Analytics</span>
                                  {getPermissionIcon(role.permissions.can_view_analytics)}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DepartmentRoles; 