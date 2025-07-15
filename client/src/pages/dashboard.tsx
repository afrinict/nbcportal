import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  LineChartComponent, 
  AreaChartComponent, 
  BarChartComponent, 
  PieChartComponent, 
  DonutChartComponent,
  MultiLineChartComponent
} from '@/components/analytics/charts';
import { analyticsApi, AnalyticsData } from '@/lib/analytics';
import { 
  TrendingUp, 
  Users, 
  FileText, 
  Building2, 
  Bell,
  Calendar,
  RefreshCw,
  Eye,
  EyeOff,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';

export default function Dashboard() {
  const { user, token } = useAuth();
  const [, setLocation] = useLocation();
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [selectedDataPoint, setSelectedDataPoint] = useState<any>(null);

  // Fetch analytics data
  const { data: analyticsData, isLoading, refetch } = useQuery<AnalyticsData>({
    queryKey: ['analytics-dashboard'],
    queryFn: () => analyticsApi.getDashboardData(),
    enabled: !!token && user?.role === 'admin',
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });

  useEffect(() => {
    if (!user || !token) {
      setLocation('/login');
    }
  }, [user, token, setLocation]);

  if (!user) return null;

  const isAdmin = user.role === 'admin';

  const handleDataPointClick = (data: any) => {
    setSelectedDataPoint(data);
    console.log('Selected data point:', data);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_review':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'in_review':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading dashboard data...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                  <p className="text-gray-600">Welcome back, {user.fullName}</p>
                </div>
                <div className="flex gap-2">
                  {isAdmin && (
                    <Button 
                      onClick={() => setShowAnalytics(!showAnalytics)} 
                      variant="outline" 
                      size="sm"
                    >
                      {showAnalytics ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                      {showAnalytics ? 'Hide' : 'Show'} Analytics
                    </Button>
                  )}
                  <Button onClick={() => refetch()} variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </div>
            </div>

            {/* Selected Data Point Info */}
            {selectedDataPoint && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Selected Data Point</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                    {JSON.stringify(selectedDataPoint, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Applications</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {analyticsData?.applications.total || 0}
                      </p>
                      {analyticsData?.applications.completionRate && (
                        <p className="text-xs text-gray-500">
                          {analyticsData.applications.completionRate}% completion rate
                        </p>
                      )}
                    </div>
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Users</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {analyticsData?.users.active || 0}
                      </p>
                      {analyticsData?.users.newUsersThisMonth && (
                        <p className="text-xs text-gray-500">
                          {analyticsData.users.newUsersThisMonth} new this month
                        </p>
                      )}
                    </div>
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Departments</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {analyticsData?.departments.total || 0}
                      </p>
                      {analyticsData?.departments.activeDepartments && (
                        <p className="text-xs text-gray-500">
                          {analyticsData.departments.activeDepartments} active
                        </p>
                      )}
                    </div>
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Building2 className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Growth Rate</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {analyticsData?.performance.growthRate || 0}%
                      </p>
                      {analyticsData?.performance.yearlyGrowthRate && (
                        <p className="text-xs text-gray-500">
                          {analyticsData.performance.yearlyGrowthRate}% yearly
                        </p>
                      )}
                    </div>
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Analytics Section for Admin */}
            {isAdmin && showAnalytics && analyticsData && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Analytics Overview</h2>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Activity className="h-3 w-3" />
                    Real-time
                  </Badge>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Applications Over Time */}
                  {analyticsData.applications.monthlyData && (
                    <div>
                      <LineChartComponent
                        data={analyticsData.applications.monthlyData}
                        title="Applications Over Time"
                        onDataPointClick={handleDataPointClick}
                      />
                    </div>
                  )}

                  {/* Application Status Distribution */}
                  {analyticsData.applications.statusDistribution && (
                    <div>
                      <PieChartComponent
                        data={analyticsData.applications.statusDistribution}
                        title="Application Status Distribution"
                        onDataPointClick={handleDataPointClick}
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* License Type Distribution */}
                  {analyticsData.applications.licenseTypeDistribution && (
                    <div>
                      <BarChartComponent
                        data={analyticsData.applications.licenseTypeDistribution}
                        title="License Type Distribution"
                        onDataPointClick={handleDataPointClick}
                      />
                    </div>
                  )}

                  {/* User Role Distribution */}
                  {analyticsData.users.roleDistribution && (
                    <div>
                      <DonutChartComponent
                        data={analyticsData.users.roleDistribution}
                        title="User Role Distribution"
                        onDataPointClick={handleDataPointClick}
                      />
                    </div>
                  )}
                </div>

                {/* Department Performance */}
                {analyticsData.departments.departmentStats && (
                  <div className="mb-8">
                    <BarChartComponent
                      data={analyticsData.departments.departmentStats}
                      title="Department Performance"
                      height={400}
                      onDataPointClick={handleDataPointClick}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Recent Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New application submitted</p>
                        <p className="text-xs text-gray-500">Broadcasting License application #12345</p>
                      </div>
                      <span className="text-xs text-gray-400">2 min ago</span>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <div className="p-2 bg-green-100 rounded-full">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Application approved</p>
                        <p className="text-xs text-gray-500">Cable TV License #12340</p>
                      </div>
                      <span className="text-xs text-gray-400">1 hour ago</span>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                      <div className="p-2 bg-yellow-100 rounded-full">
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Document review required</p>
                        <p className="text-xs text-gray-500">Additional documents needed for #12342</p>
                      </div>
                      <span className="text-xs text-gray-400">3 hours ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Recent Applications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Broadcasting License</p>
                          <p className="text-xs text-gray-500">Submitted by John Doe</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor('pending')}>
                        {getStatusIcon('pending')}
                        <span className="ml-1">Pending</span>
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-full">
                          <FileText className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Cable TV License</p>
                          <p className="text-xs text-gray-500">Submitted by Jane Smith</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor('approved')}>
                        {getStatusIcon('approved')}
                        <span className="ml-1">Approved</span>
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Radio License</p>
                          <p className="text-xs text-gray-500">Submitted by Bob Johnson</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor('in_review')}>
                        {getStatusIcon('in_review')}
                        <span className="ml-1">In Review</span>
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics for Admin */}
            {isAdmin && analyticsData && (
              <div className="mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Performance Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">
                          {analyticsData.performance.averageProcessingTime || 0}
                        </p>
                        <p className="text-sm text-gray-600">Average Processing Time (days)</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">
                          {analyticsData.performance.completionRate || 0}%
                        </p>
                        <p className="text-sm text-gray-600">Completion Rate</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-orange-600">
                          {analyticsData.performance.efficiency || 0}
                        </p>
                        <p className="text-sm text-gray-600">Efficiency Score</p>
                      </div>
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
}
