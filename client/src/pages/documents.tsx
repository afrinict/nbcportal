import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { Footer } from '@/components/layout/footer';
import { DocumentCard } from '@/components/documents/document-card';
import { UploadDialog } from '@/components/documents/upload-dialog';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { Document } from '@shared/schema';

export default function Documents() {
  const { user, token } = useAuth();
  const [, setLocation] = useLocation();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  useEffect(() => {
    if (!user || !token) {
      setLocation('/login');
    }
  }, [user, token, setLocation]);

  // For now, we'll use mock data since we need an application context
  const mockDocuments = [
    {
      name: 'Engineering Design Report',
      type: 'engineering_design',
      status: 'verified' as const,
      uploadedDate: 'March 10, 2024',
      fileSize: 'PDF • 2.3 MB'
    },
    {
      name: 'Bank Reference Letter',
      type: 'bank_reference',
      status: 'verified' as const,
      uploadedDate: 'March 12, 2024',
      fileSize: 'PDF • 1.8 MB'
    },
    {
      name: 'Feasibility Study',
      type: 'feasibility_study',
      status: 'required' as const,
      uploadedDate: '',
      fileSize: ''
    },
    {
      name: 'Letter of Undertaking',
      type: 'undertaking_letter',
      status: 'pending' as const,
      uploadedDate: 'March 14, 2024',
      fileSize: 'PDF • 1.2 MB'
    }
  ];

  const handleUpload = (file: File, name: string, type: string) => {
    console.log('Uploading file:', { file, name, type });
    // Implementation would go here
  };

  const handleDownload = (name: string) => {
    console.log('Downloading document:', name);
    // Implementation would go here
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
                <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
                <p className="text-gray-600">Manage your application documents</p>
              </div>
              <Button 
                className="bg-nbc-blue hover:bg-blue-700"
                onClick={() => setUploadDialogOpen(true)}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockDocuments.map((doc, index) => (
                <DocumentCard
                  key={index}
                  name={doc.name}
                  type={doc.type}
                  status={doc.status}
                  uploadedDate={doc.uploadedDate}
                  fileSize={doc.fileSize}
                  onDownload={() => handleDownload(doc.name)}
                  onUpload={() => setUploadDialogOpen(true)}
                />
              ))}
            </div>

            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-4">Document Requirements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
                <div>
                  <h4 className="font-medium mb-2">Required for All Applications:</h4>
                  <ul className="space-y-1">
                    <li>• Letter requesting approval to purchase</li>
                    <li>• Engineering design and feasibility study</li>
                    <li>• Letter of undertaking (NBC Act Section 9(2))</li>
                    <li>• Bank reference letter</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">File Requirements:</h4>
                  <ul className="space-y-1">
                    <li>• Maximum file size: 10MB</li>
                    <li>• Supported formats: PDF, DOC, DOCX, Images</li>
                    <li>• All documents must be clear and legible</li>
                    <li>• Official letterheads required where applicable</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <UploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onUpload={handleUpload}
      />

      <Footer />
    </div>
  );
}
