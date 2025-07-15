import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { LicenseType } from '@shared/schema';
import { AlertCircle, Lock } from 'lucide-react';

export default function NewApplication() {
  const { user, token } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: '',
    licenseTypeId: '',
    proposedLocation: '',
    applicationData: {
      companyDetails: '',
      technicalSpecs: '',
      businessPlan: ''
    }
  });

  useEffect(() => {
    if (!user || !token) {
      setLocation('/login');
    }
  }, [user, token, setLocation]);

  // Check if user has applicant role
  const isApplicant = user?.role === 'applicant';

  const { data: licenseTypes } = useQuery<LicenseType[]>({
    queryKey: ['/api/license-types'],
    enabled: !!token && isApplicant,
  });

  const createApplicationMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('POST', '/api/applications', data);
    },
    onSuccess: () => {
      toast({
        title: "Application submitted",
        description: "Your license application has been submitted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/applications'] });
      setLocation('/applications');
    },
    onError: (error: any) => {
      toast({
        title: "Submission failed",
        description: error.message || "Failed to submit application",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.licenseTypeId || !formData.proposedLocation) {
      toast({
        title: "Validation error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    createApplicationMutation.mutate({
      ...formData,
      licenseTypeId: parseInt(formData.licenseTypeId)
    });
  };

  const handleChange = (field: string, value: string) => {
    if (field.startsWith('applicationData.')) {
      const subField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        applicationData: {
          ...prev.applicationData,
          [subField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  if (!user) return null;

  // Show access denied for non-applicant users
  if (!isApplicant) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-3 mb-8 lg:mb-0">
              <Sidebar />
            </div>

            <div className="lg:col-span-9">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Access Denied</h1>
                <p className="text-gray-600">You don't have permission to access this page</p>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <Alert className="border-red-200 bg-red-50">
                    <Lock className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      <strong>License applications are restricted to applicant accounts only.</strong><br />
                      Your current role ({user.role}) does not have permission to submit license applications. 
                      Please contact the system administrator if you believe this is an error.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="mt-6">
                    <Button 
                      onClick={() => setLocation('/dashboard')}
                      variant="outline"
                    >
                      Return to Dashboard
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
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
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">New License Application</h1>
              <p className="text-gray-600">Submit a new broadcasting license application</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Application Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="title">Application Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                        placeholder="e.g., FM Radio Station License - Lagos"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="licenseType">License Type *</Label>
                      <Select value={formData.licenseTypeId} onValueChange={(value) => handleChange('licenseTypeId', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select license type" />
                        </SelectTrigger>
                        <SelectContent>
                          {licenseTypes?.map(type => (
                            <SelectItem key={type.id} value={type.id.toString()}>
                              {type.name} - {type.category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="proposedLocation">Proposed Location *</Label>
                    <Input
                      id="proposedLocation"
                      value={formData.proposedLocation}
                      onChange={(e) => handleChange('proposedLocation', e.target.value)}
                      placeholder="e.g., Lagos State, Nigeria"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="companyDetails">Company Details</Label>
                    <Textarea
                      id="companyDetails"
                      value={formData.applicationData.companyDetails}
                      onChange={(e) => handleChange('applicationData.companyDetails', e.target.value)}
                      placeholder="Brief description of your company and broadcasting experience"
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="technicalSpecs">Technical Specifications</Label>
                    <Textarea
                      id="technicalSpecs"
                      value={formData.applicationData.technicalSpecs}
                      onChange={(e) => handleChange('applicationData.technicalSpecs', e.target.value)}
                      placeholder="Technical details of your proposed broadcasting setup"
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="businessPlan">Business Plan Summary</Label>
                    <Textarea
                      id="businessPlan"
                      value={formData.applicationData.businessPlan}
                      onChange={(e) => handleChange('applicationData.businessPlan', e.target.value)}
                      placeholder="Brief overview of your business plan and programming strategy"
                      rows={4}
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Required Documents</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Letter requesting approval to purchase broadcasting equipment</li>
                      <li>• Engineering design and feasibility study</li>
                      <li>• Letter of undertaking (Section 9(2) of NBC Act)</li>
                      <li>• Bank reference letter</li>
                      <li>• Proof of application fee payment (₦50,000)</li>
                    </ul>
                    <p className="text-sm text-blue-600 mt-2">
                      You can upload these documents after submitting your application.
                    </p>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setLocation('/applications')}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={createApplicationMutation.isPending}
                    >
                      {createApplicationMutation.isPending ? 'Submitting...' : 'Submit Application'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
