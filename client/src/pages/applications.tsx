import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { Footer } from '@/components/layout/footer';
import { StatusCard } from '@/components/application/status-card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Application } from '@shared/schema';

export default function Applications() {
  const { user, token } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!user || !token) {
      setLocation('/login');
    }
  }, [user, token, setLocation]);

  const { data: applications, isLoading } = useQuery<Application[]>({
    queryKey: ['/api/applications'],
    enabled: !!token,
  });

  const handleNewApplication = () => {
    setLocation('/applications/new');
  };

  const handleViewApplication = (id: number) => {
    setLocation(`/applications/${id}`);
  };

  const handleDownloadReceipt = (id: number) => {
    console.log('Download receipt for application:', id);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3 mb-8 lg:mb-0">
            <Sidebar />
          </div>

          <div className="lg:col-span-9">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
                <p className="text-gray-600">Manage your license applications</p>
              </div>
              <Button 
                className="bg-nbc-blue hover:bg-blue-700"
                onClick={handleNewApplication}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                New Application
              </Button>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-2 bg-gray-200 rounded w-full"></div>
                  </div>
                ))}
              </div>
            ) : applications && applications.length > 0 ? (
              <div className="space-y-4">
                {applications.map(application => (
                  <StatusCard
                    key={application.id}
                    application={application}
                    onViewDetails={handleViewApplication}
                    onDownloadReceipt={handleDownloadReceipt}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <PlusCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                <p className="text-gray-500 mb-6">Get started by creating your first license application</p>
                <Button 
                  className="bg-nbc-blue hover:bg-blue-700"
                  onClick={handleNewApplication}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create New Application
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
