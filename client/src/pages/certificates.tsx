import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { LicenseCertificate } from '@/components/certificate/license-certificate';
import { Download, Eye, FileText } from 'lucide-react';

// Mock data - replace with actual API calls
const mockCertificates = [
  {
    id: 1,
    licenseNumber: 'NBC-FM-2024-001',
    applicantName: 'John Doe',
    companyName: 'Radio Excellence Ltd',
    licenseType: 'FM Broadcasting License',
    issuedDate: '2024-01-15',
    expiryDate: '2029-01-15',
    status: 'active',
    applicationId: 'APP-2024-001'
  },
  {
    id: 2,
    licenseNumber: 'NBC-TV-2023-045',
    applicantName: 'Jane Smith',
    companyName: 'Vision Broadcasting Network',
    licenseType: 'Television Broadcasting License',
    issuedDate: '2023-06-20',
    expiryDate: '2028-06-20',
    status: 'active',
    applicationId: 'APP-2023-045'
  }
];

export default function Certificates() {
  const [selectedCertificate, setSelectedCertificate] = useState<typeof mockCertificates[0] | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'certificate'>('list');

  const handleViewCertificate = (certificate: typeof mockCertificates[0]) => {
    setSelectedCertificate(certificate);
    setViewMode('certificate');
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedCertificate(null);
  };

  const handleDownloadCertificate = (certificateId: number) => {
    // TODO: Implement actual download functionality
    console.log('Downloading certificate:', certificateId);
  };

  if (viewMode === 'certificate' && selectedCertificate) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button 
              onClick={handleBackToList}
              variant="ghost"
              className="text-nbc-blue hover:text-blue-700"
            >
              ← Back to Certificates
            </Button>
          </div>
          <LicenseCertificate {...selectedCertificate} />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Certificates</h1>
          <p className="text-gray-600">
            View and download your broadcasting licenses and certificates
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCertificates.map((certificate) => (
            <Card key={certificate.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <FileText className="h-8 w-8 text-nbc-blue mr-3" />
                    <div>
                      <CardTitle className="text-lg">{certificate.licenseType}</CardTitle>
                      <p className="text-sm text-gray-500">{certificate.licenseNumber}</p>
                    </div>
                  </div>
                  <Badge className={`px-2 py-1 text-xs ${
                    certificate.status === 'active' ? 'bg-green-100 text-green-800' : 
                    certificate.status === 'expired' ? 'bg-red-100 text-red-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {certificate.status.charAt(0).toUpperCase() + certificate.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Applicant:</span>
                    <p className="text-sm text-gray-900">{certificate.applicantName}</p>
                  </div>
                  {certificate.companyName && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Company:</span>
                      <p className="text-sm text-gray-900">{certificate.companyName}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-sm font-medium text-gray-700">Issued:</span>
                    <p className="text-sm text-gray-900">{new Date(certificate.issuedDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Expires:</span>
                    <p className="text-sm text-gray-900">{new Date(certificate.expiryDate).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => handleViewCertificate(certificate)}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                  <Button 
                    onClick={() => handleDownloadCertificate(certificate.id)}
                    size="sm"
                    className="bg-nbc-blue hover:bg-blue-700 text-white"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {mockCertificates.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Certificates Found</h3>
              <p className="text-gray-500 mb-4">
                You don't have any certificates yet. Complete your license application to receive your certificate.
              </p>
              <Button className="bg-nbc-blue hover:bg-blue-700 text-white">
                Apply for License
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      <Footer />
    </div>
  );
} 