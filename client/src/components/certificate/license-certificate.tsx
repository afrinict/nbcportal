import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';

interface LicenseCertificateProps {
  licenseNumber: string;
  applicantName: string;
  companyName?: string;
  licenseType: string;
  issuedDate: string;
  expiryDate: string;
  status: string;
}

export function LicenseCertificate({
  licenseNumber,
  applicantName,
  companyName,
  licenseType,
  issuedDate,
  expiryDate,
  status
}: LicenseCertificateProps) {
  const handleDownload = () => {
    // TODO: Implement PDF generation and download
    console.log('Downloading certificate...');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Card className="max-w-4xl mx-auto bg-white border-2 border-gray-200 print:border-0">
      <CardHeader className="text-center border-b-2 border-gray-200 pb-6">
        <div className="flex justify-center items-center mb-6">
          <img 
            src="/Images/NBC-logo.jpg" 
            alt="NBC Logo" 
            className="h-20 w-auto"
          />
        </div>
        <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
          BROADCASTING LICENSE
        </CardTitle>
        <p className="text-lg text-gray-600">
          National Broadcasting Commission of Nigeria
        </p>
        <p className="text-sm text-gray-500">
          Plot 755, Herbert Macaulay Way, Central Area, Abuja
        </p>
      </CardHeader>
      
      <CardContent className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">License Details</h3>
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-700">License Number:</span>
                <p className="text-lg font-bold text-nbc-blue">{licenseNumber}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">License Type:</span>
                <p className="text-gray-900">{licenseType}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Status:</span>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  status === 'active' ? 'bg-green-100 text-green-800' : 
                  status === 'expired' ? 'bg-red-100 text-red-800' : 
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Applicant Information</h3>
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-700">Name:</span>
                <p className="text-gray-900">{applicantName}</p>
              </div>
              {companyName && (
                <div>
                  <span className="font-medium text-gray-700">Company:</span>
                  <p className="text-gray-900">{companyName}</p>
                </div>
              )}
              <div>
                <span className="font-medium text-gray-700">Issued Date:</span>
                <p className="text-gray-900">{issuedDate}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Expiry Date:</span>
                <p className="text-gray-900">{expiryDate}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t-2 border-gray-200 pt-6">
          <div className="text-center mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Terms and Conditions</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              This license is issued subject to the provisions of the National Broadcasting Commission Act 
              and all applicable regulations. The licensee must comply with all broadcasting standards, 
              content regulations, and operational requirements as stipulated by the Commission.
            </p>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              <p>Authorized by: National Broadcasting Commission</p>
              <p>Digital Signature: NBC-{licenseNumber.slice(-8)}</p>
            </div>
            <div className="text-sm text-gray-500">
              <p>Generated on: {new Date().toLocaleDateString()}</p>
              <p>Certificate ID: CERT-{Date.now()}</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center space-x-4 mt-8 print:hidden">
          <Button 
            onClick={handleDownload}
            className="bg-nbc-blue hover:bg-blue-700 text-white"
          >
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button 
            onClick={handlePrint}
            variant="outline"
            className="border-nbc-blue text-nbc-blue hover:bg-nbc-blue hover:text-white"
          >
            <Printer className="mr-2 h-4 w-4" />
            Print Certificate
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 