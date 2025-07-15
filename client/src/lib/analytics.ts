import { apiRequest } from './queryClient';

export interface AnalyticsData {
  applications: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    inReview: number;
    monthlyData: Array<{
      month: string;
      count: number;
      date: string;
    }>;
    dailyData: Array<{
      day: string;
      count: number;
      date: string;
    }>;
    statusDistribution: Array<{
      status: string;
      count: number;
      percentage: number;
    }>;
    licenseTypeDistribution: Array<{
      type: string;
      count: number;
      percentage: number;
    }>;
    completionRate: number;
  };
  users: {
    total: number;
    active: number;
    inactive: number;
    roleDistribution: Array<{
      role: string;
      count: number;
      percentage: number;
    }>;
    newUsersThisMonth: number;
  };
  departments: {
    total: number;
    activeDepartments: number;
    departmentStats: Array<{
      name: string;
      applications: number;
      users: number;
      efficiency: number;
    }>;
  };
  performance: {
    averageProcessingTime: number;
    applicationsThisMonth: number;
    applicationsLastMonth: number;
    growthRate: number;
    completionRate: number;
    efficiency: number;
  };
}

export interface ReportFilters {
  startDate: string;
  endDate: string;
  status?: string;
  role?: string;
  department?: string;
  licenseType?: number;
}

export interface ReportRequest {
  reportType: 'applications_summary' | 'user_activity' | 'performance_metrics';
  startDate: string;
  endDate: string;
  filters?: ReportFilters;
  format?: 'json' | 'csv';
}

// Mock data generator
const generateMockData = (timeRange?: string, startDate?: string, endDate?: string): AnalyticsData => {
  const currentDate = new Date();
  const start = startDate ? new Date(startDate) : new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);
  const end = endDate ? new Date(endDate) : currentDate;

  // Generate monthly data
  const monthlyData = [];
  for (let i = 11; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthName = date.toLocaleDateString('en-US', { month: 'short' });
    const count = Math.floor(Math.random() * 50) + 10;
    monthlyData.push({ 
      month: monthName, 
      count,
      date: date.toISOString().split('T')[0]
    });
  }

  // Generate daily data
  const dailyData = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - i);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const count = Math.floor(Math.random() * 20) + 5;
    dailyData.push({ 
      day: dayName, 
      count,
      date: date.toISOString().split('T')[0]
    });
  }

  const totalApplications = Math.floor(Math.random() * 500) + 200;
  const pending = Math.floor(totalApplications * 0.15);
  const approved = Math.floor(totalApplications * 0.65);
  const rejected = Math.floor(totalApplications * 0.10);
  const inReview = totalApplications - pending - approved - rejected;

  const totalUsers = Math.floor(Math.random() * 200) + 100;
  const activeUsers = Math.floor(totalUsers * 0.85);

  return {
    applications: {
      total: totalApplications,
      pending,
      approved,
      rejected,
      inReview,
      monthlyData,
      dailyData,
      statusDistribution: [
        { status: 'Pending', count: pending, percentage: Math.round((pending / totalApplications) * 100) },
        { status: 'In Review', count: inReview, percentage: Math.round((inReview / totalApplications) * 100) },
        { status: 'Approved', count: approved, percentage: Math.round((approved / totalApplications) * 100) },
        { status: 'Rejected', count: rejected, percentage: Math.round((rejected / totalApplications) * 100) }
      ],
      licenseTypeDistribution: [
        { type: 'Broadcasting License', count: Math.floor(totalApplications * 0.35), percentage: 35 },
        { type: 'Cable TV License', count: Math.floor(totalApplications * 0.25), percentage: 25 },
        { type: 'Satellite License', count: Math.floor(totalApplications * 0.20), percentage: 20 },
        { type: 'Radio License', count: Math.floor(totalApplications * 0.15), percentage: 15 },
        { type: 'TV License', count: Math.floor(totalApplications * 0.05), percentage: 5 }
      ],
      completionRate: Math.round(((approved + rejected) / totalApplications) * 100)
    },
    users: {
      total: totalUsers,
      active: activeUsers,
      inactive: totalUsers - activeUsers,
      roleDistribution: [
        { role: 'Admin', count: Math.floor(totalUsers * 0.10), percentage: 10 },
        { role: 'Staff', count: Math.floor(totalUsers * 0.20), percentage: 20 },
        { role: 'Applicant', count: Math.floor(totalUsers * 0.70), percentage: 70 }
      ],
      newUsersThisMonth: Math.floor(Math.random() * 20) + 5
    },
    departments: {
      total: 6,
      activeDepartments: 6,
      departmentStats: [
        { name: 'Technical Standards', applications: Math.floor(totalApplications * 0.25), users: Math.floor(totalUsers * 0.15), efficiency: Math.random() * 2 + 1 },
        { name: 'Content Regulation', applications: Math.floor(totalApplications * 0.20), users: Math.floor(totalUsers * 0.12), efficiency: Math.random() * 2 + 1 },
        { name: 'Licensing', applications: Math.floor(totalApplications * 0.30), users: Math.floor(totalUsers * 0.20), efficiency: Math.random() * 2 + 1 },
        { name: 'Compliance', applications: Math.floor(totalApplications * 0.15), users: Math.floor(totalUsers * 0.10), efficiency: Math.random() * 2 + 1 },
        { name: 'Legal Affairs', applications: Math.floor(totalApplications * 0.10), users: Math.floor(totalUsers * 0.08), efficiency: Math.random() * 2 + 1 }
      ]
    },
    performance: {
      averageProcessingTime: Math.floor(Math.random() * 10) + 5,
      applicationsThisMonth: Math.floor(Math.random() * 50) + 20,
      applicationsLastMonth: Math.floor(Math.random() * 45) + 15,
      growthRate: (Math.random() * 40) - 10, // Can be negative or positive
      completionRate: Math.round(((approved + rejected) / totalApplications) * 100),
      efficiency: Math.random() * 2 + 1
    }
  };
};

export const analyticsApi = {
  getDashboardData: async (timeRange?: string, startDate?: string, endDate?: string): Promise<AnalyticsData> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock data for now
    return generateMockData(timeRange, startDate, endDate);
  },

  getApplicationStats: async (filters?: Partial<ReportFilters>) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return generateMockData();
  },

  getUserStats: async (filters?: Partial<ReportFilters>) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return generateMockData();
  },

  getDepartmentStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return generateMockData();
  },

  getPerformanceMetrics: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return generateMockData();
  },

  generateReport: async (reportRequest: ReportRequest) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (reportRequest.format === 'csv') {
      // Generate CSV content
      const csvContent = `Report Type,${reportRequest.reportType}
Start Date,${reportRequest.startDate}
End Date,${reportRequest.endDate}
Generated At,${new Date().toISOString()}

Data:
Applications,Users,Departments,Performance
${Math.floor(Math.random() * 500) + 200},${Math.floor(Math.random() * 200) + 100},6,${Math.random() * 100}`;
      
      // Create and download CSV file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportRequest.reportType}_${reportRequest.startDate}_${reportRequest.endDate}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      return null;
    }
    
    // Return JSON report
    return {
      reportType: reportRequest.reportType,
      startDate: reportRequest.startDate,
      endDate: reportRequest.endDate,
      generatedAt: new Date().toISOString(),
      data: generateMockData()
    };
  },

  // Real-time data fetching with polling
  subscribeToRealTimeData: (callback: (data: AnalyticsData) => void, interval = 30000) => {
    let isSubscribed = true;
    
    const fetchData = async () => {
      if (!isSubscribed) return;
      
      try {
        const data = await analyticsApi.getDashboardData();
        callback(data);
      } catch (error) {
        console.error('Error fetching real-time data:', error);
      }
      
      if (isSubscribed) {
        setTimeout(fetchData, interval);
      }
    };
    
    fetchData();
    
    // Return unsubscribe function
    return () => {
      isSubscribed = false;
    };
  }
}; 