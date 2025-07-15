import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Layers, 
  ListTree, 
  Workflow, 
  Users, 
  FileText, 
  CreditCard, 
  Award,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Settings
} from 'lucide-react';

export default function AdminIndex() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      setLocation('/login');
    }
  }, [user, loading, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nbc-blue mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  // Mock statistics data
  const stats = {
    totalDepartments: 8,
    totalUnits: 24,
    totalSubunits: 67,
    activeWorkflows: 12,
    pendingApplications: 45,
    approvedApplications: 156,
    totalRevenue: '₦2,450,000',
    activeUsers: 89
  };

  const adminModules = [
    {
      title: 'Department Management',
      description: 'Manage organizational departments and their configurations',
      icon: Building2,
      href: '/admin/departments',
      color: 'bg-blue-500',
      stats: `${stats.totalDepartments} Departments`
    },
    {
      title: 'Unit Management',
      description: 'Configure units within departments and their relationships',
      icon: Layers,
      href: '/admin/units',
      color: 'bg-green-500',
      stats: `${stats.totalUnits} Units`
    },
    {
      title: 'Subunit Management',
      description: 'Manage subunits and their hierarchical structure',
      icon: ListTree,
      href: '/admin/subunits',
      color: 'bg-purple-500',
      stats: `${stats.totalSubunits} Subunits`
    },
    {
      title: 'Workflow Builder',
      description: 'Create and manage application workflow stages and templates',
      icon: Workflow,
      href: '/admin/workflow-builder',
      color: 'bg-orange-500',
      stats: `${stats.activeWorkflows} Active Workflows`
    },
    {
      title: 'User Management',
      description: 'Manage system users and permissions',
      icon: Users,
      href: '/admin/users',
      color: 'bg-rose-500',
      stats: `${stats.activeUsers} Active Users`
    }
  ];

  const quickActions = [
    {
      title: 'View Applications',
      description: 'Review and manage license applications',
      icon: FileText,
      href: '/applications',
      color: 'bg-indigo-500'
    },
    {
      title: 'Payment Management',
      description: 'Monitor payments and financial transactions',
      icon: CreditCard,
      href: '/payments',
      color: 'bg-emerald-500'
    },
    {
      title: 'Certificate Management',
      description: 'Issue and manage license certificates',
      icon: Award,
      href: '/certificates',
      color: 'bg-amber-500'
    },
    {
      title: 'User Management',
      description: 'Manage system users and permissions',
      icon: Users,
      href: '/admin/users',
      color: 'bg-rose-500'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      action: 'New application submitted',
      details: 'NBC-2024-FM-0123 - Radio Nigeria',
      time: '2 minutes ago',
      status: 'pending'
    },
    {
      id: 2,
      action: 'Workflow stage completed',
      details: 'Technical Assessment - NBC-2024-FM-0122',
      time: '15 minutes ago',
      status: 'completed'
    },
    {
      id: 3,
      action: 'Payment received',
      details: '₦50,000 - NBC-2024-FM-0121',
      time: '1 hour ago',
      status: 'completed'
    },
    {
      id: 4,
      action: 'Certificate issued',
      details: 'Broadcasting License - NBC-2024-FM-0120',
      time: '3 hours ago',
      status: 'completed'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3 mb-8 lg:mb-0">
            <Sidebar />
          </div>

          <div className="lg:col-span-9">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="mt-2 text-gray-600">Manage the NBC License Portal system and monitor operations</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Pending Applications</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.pendingApplications}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Approved Applications</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.approvedApplications}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalRevenue}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Users className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Active Users</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Admin Modules */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {adminModules.map((module) => (
                <Card
                  key={module.title}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setLocation(module.href)}
                >
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className={`p-3 rounded-lg ${module.color}`}>
                      <module.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle>{module.title}</CardTitle>
                      <p className="text-sm text-gray-500">{module.description}</p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="secondary">{module.stats}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions and Recent Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {quickActions.map((action) => {
                      const Icon = action.icon;
                      return (
                        <Button
                          key={action.title}
                          variant="outline"
                          className="w-full justify-start h-auto p-3"
                          onClick={() => setLocation(action.href)}
                        >
                          <div className={`p-2 rounded-lg ${action.color} text-white mr-3`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium">{action.title}</div>
                            <div className="text-sm text-gray-600">{action.description}</div>
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Recent Activities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        {getStatusIcon(activity.status)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                          <p className="text-sm text-gray-600">{activity.details}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
} 