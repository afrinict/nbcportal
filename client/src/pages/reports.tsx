import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  LineChartComponent, 
  AreaChartComponent, 
  BarChartComponent, 
  PieChartComponent, 
  DonutChartComponent,
  MultiLineChartComponent,
  StackedBarChartComponent,
  ComposedChartComponent
} from '@/components/analytics/charts';
import { analyticsApi, AnalyticsData, ReportRequest, ReportFilters } from '@/lib/analytics';
import { 
  TrendingUp, 
  Users, 
  FileText, 
  Building2, 
  Download, 
  Calendar,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity,
  Filter,
  Settings,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { format, subDays, subMonths, subYears, startOfDay, endOfDay } from 'date-fns';

export default function Reports() {
  const { user, token } = useAuth();
  const [, setLocation] = useLocation();
  
  // State for filters and settings
  const [timeRange, setTimeRange] = useState('30d');
  const [chartType, setChartType] = useState('line');
  const [startDate, setStartDate] = useState(format(subDays(new Date(), 30), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [reportType, setReportType] = useState<'applications_summary' | 'user_activity' | 'performance_metrics'>('applications_summary');
  const [showFilters, setShowFilters] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(true);
  const [selectedDataPoint, setSelectedDataPoint] = useState<any>(null);
  const [filters, setFilters] = useState<Partial<ReportFilters>>({});

  // Fetch analytics data with current filters
  const { data: analyticsData, isLoading, refetch } = useQuery<AnalyticsData>({
    queryKey: ['analytics', timeRange, startDate, endDate],
    queryFn: () => analyticsApi.getDashboardData(timeRange, startDate, endDate),
    enabled: !!token,
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });

  useEffect(() => {
    if (!user || !token) {
      setLocation('/login');
    }
  }, [user, token, setLocation]);

  if (!user) return null;

  const isAdmin = user.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleDataPointClick = (data: any) => {
    setSelectedDataPoint(data);
    console.log('Selected data point:', data);
  };

  const exportReport = async (format: 'json' | 'csv' = 'json') => {
    try {
      const reportRequest: ReportRequest = {
        reportType,
        startDate,
        endDate,
        filters,
        format
      };

      const result = await analyticsApi.generateReport(reportRequest);
      if (result) {
        console.log('Report generated:', result);
      }
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  const getChartComponent = (type: string, data: any[], title: string) => {
    const chartProps = {
      data,
      title,
      interactive: true,
      onDataPointClick: handleDataPointClick
    };

    switch (type) {
      case 'line':
        return <LineChartComponent {...chartProps} />;
      case 'area':
        return <AreaChartComponent {...chartProps} />;
      case 'bar':
        return <BarChartComponent {...chartProps} />;
      case 'pie':
        return <PieChartComponent {...chartProps} />;
      case 'donut':
        return <DonutChartComponent {...chartProps} />;
      case 'composed':
        return <ComposedChartComponent {...chartProps} />;
      case 'multi-line':
        return <MultiLineChartComponent {...chartProps} />;
      case 'stacked-bar':
        return <StackedBarChartComponent {...chartProps} />;
      default:
        return <LineChartComponent {...chartProps} />;
    }
  };

  const getQuickDateRange = (range: string) => {
    const today = new Date();
    switch (range) {
      case '7d':
        return {
          start: format(subDays(today, 7), 'yyyy-MM-dd'),
          end: format(today, 'yyyy-MM-dd')
        };
      case '30d':
        return {
          start: format(subDays(today, 30), 'yyyy-MM-dd'),
          end: format(today, 'yyyy-MM-dd')
        };
      case '90d':
        return {
          start: format(subDays(today, 90), 'yyyy-MM-dd'),
          end: format(today, 'yyyy-MM-dd')
        };
      case '1y':
        return {
          start: format(subYears(today, 1), 'yyyy-MM-dd'),
          end: format(today, 'yyyy-MM-dd')
        };
      default:
        return { start: startDate, end: endDate };
    }
  };

  const handleQuickDateSelect = (range: string) => {
    const { start, end } = getQuickDateRange(range);
    setStartDate(start);
    setEndDate(end);
    setTimeRange(range);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading analytics data...</p>
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
                  <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
                  <p className="text-gray-600">Comprehensive insights into NBC License Portal performance</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => setShowAnalytics(!showAnalytics)} 
                    variant="outline" 
                    size="sm"
                  >
                    {showAnalytics ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                    {showAnalytics ? 'Hide' : 'Show'} Analytics
                  </Button>
                  <Button onClick={() => refetch()} variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                  <Button onClick={() => exportReport('csv')} size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </div>
            </div>

            {/* Filters Panel */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filters & Settings
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
              {showFilters && (
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Quick Date Range */}
                    <div>
                      <Label>Quick Date Range</Label>
                      <Select value={timeRange} onValueChange={handleQuickDateSelect}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7d">Last 7 days</SelectItem>
                          <SelectItem value="30d">Last 30 days</SelectItem>
                          <SelectItem value="90d">Last 90 days</SelectItem>
                          <SelectItem value="1y">Last year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Custom Date Range */}
                    <div>
                      <Label>Start Date</Label>
                      <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>End Date</Label>
                      <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Chart Type</Label>
                      <Select value={chartType} onValueChange={setChartType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="line">Line Chart</SelectItem>
                          <SelectItem value="area">Area Chart</SelectItem>
                          <SelectItem value="bar">Bar Chart</SelectItem>
                          <SelectItem value="pie">Pie Chart</SelectItem>
                          <SelectItem value="donut">Donut Chart</SelectItem>
                          <SelectItem value="composed">Composed Chart</SelectItem>
                          <SelectItem value="multi-line">Multi-Line Chart</SelectItem>
                          <SelectItem value="stacked-bar">Stacked Bar Chart</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Report Type */}
                    <div>
                      <Label>Report Type</Label>
                      <Select value={reportType} onValueChange={(value: any) => setReportType(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="applications_summary">Applications Summary</SelectItem>
                          <SelectItem value="user_activity">User Activity</SelectItem>
                          <SelectItem value="performance_metrics">Performance Metrics</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Status Filter */}
                    <div>
                      <Label>Status Filter</Label>
                      <Select 
                        value={filters.status || ''} 
                        onValueChange={(value) => setFilters({ ...filters, status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Statuses</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                          <SelectItem value="in_review">In Review</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Role Filter */}
                    <div>
                      <Label>Role Filter</Label>
                      <Select 
                        value={filters.role || ''} 
                        onValueChange={(value) => setFilters({ ...filters, role: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All Roles" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Roles</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="staff">Staff</SelectItem>
                          <SelectItem value="applicant">Applicant</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

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
            {showAnalytics && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Applications</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {analyticsData?.applications.total || 0}
                        </p>
                        <p className="text-xs text-gray-500">
                          {analyticsData?.applications.completionRate || 0}% completion rate
                        </p>
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
                        <p className="text-xs text-gray-500">
                          {analyticsData?.users.newUsersThisMonth || 0} new this month
                        </p>
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
                        <p className="text-xs text-gray-500">
                          {analyticsData?.departments.activeDepartments || 0} active
                        </p>
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
                        <p className="text-xs text-gray-500">
                          {analyticsData?.performance.yearlyGrowthRate || 0}% yearly
                        </p>
                      </div>
                      <div className="p-3 bg-orange-100 rounded-lg">
                        <TrendingUp className="h-6 w-6 text-orange-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Charts Grid */}
            {showAnalytics && analyticsData && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Applications Over Time */}
                  {analyticsData.applications.monthlyData && (
                    <div>
                      {getChartComponent(
                        chartType,
                        analyticsData.applications.monthlyData,
                        'Applications Over Time'
                      )}
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

                {/* Performance Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Performance Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span>Average Processing Time:</span>
                          <span className="font-semibold">
                            {analyticsData?.performance.averageProcessingTime || 0} days
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>This Month:</span>
                          <span className="font-semibold">
                            {analyticsData?.performance.applicationsThisMonth || 0} applications
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Last Month:</span>
                          <span className="font-semibold">
                            {analyticsData?.performance.applicationsLastMonth || 0} applications
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Completion Rate:</span>
                          <span className="font-semibold">
                            {analyticsData?.performance.completionRate || 0}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Efficiency Score:</span>
                          <span className="font-semibold">
                            {analyticsData?.performance.efficiency || 0}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Quick Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <Button 
                          onClick={() => exportReport('json')} 
                          className="w-full"
                          variant="outline"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Export JSON Report
                        </Button>
                        <Button 
                          onClick={() => exportReport('csv')} 
                          className="w-full"
                          variant="outline"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Export CSV Report
                        </Button>
                        <Button 
                          onClick={() => refetch()} 
                          className="w-full"
                          variant="outline"
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Refresh Data
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 