import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, Building, MapPin, Hash, Shield } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export default function Profile() {
  const { user, token, login } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    address: '',
    nin: '',
    cacNumber: ''
  });

  useEffect(() => {
    if (!user || !token) {
      setLocation('/login');
    } else {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        companyName: user.companyName || '',
        address: user.address || '',
        nin: user.nin || '',
        cacNumber: user.cacNumber || ''
      });
    }
  }, [user, token, setLocation]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('PATCH', '/api/profile', data);
      return response.json();
    },
    onSuccess: (updatedUser) => {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
      
      // Update the auth context with new user data
      login({ ...user, ...updatedUser }, token!);
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
              <p className="text-gray-600">Manage your account information and preferences</p>
            </div>

            <div className="space-y-6">
              {/* Profile Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Profile Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="h-16 w-16 bg-nbc-blue rounded-full flex items-center justify-center">
                      <span className="text-white text-xl font-medium">
                        {user.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{user.fullName}</h3>
                      <p className="text-gray-500">{user.email}</p>
                      <div className="flex items-center mt-2">
                        <Badge className="bg-nbc-blue text-white">
                          <Shield className="mr-1 h-3 w-3" />
                          {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                        </Badge>
                        {user.isVerified && (
                          <Badge className="ml-2 bg-nbc-green text-white">
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="fullName" className="flex items-center">
                          <User className="mr-2 h-4 w-4" />
                          Full Name
                        </Label>
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) => handleChange('fullName', e.target.value)}
                          placeholder="Your full name"
                        />
                      </div>

                      <div>
                        <Label htmlFor="email" className="flex items-center">
                          <Mail className="mr-2 h-4 w-4" />
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                          placeholder="your.email@example.com"
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone" className="flex items-center">
                          <Phone className="mr-2 h-4 w-4" />
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleChange('phone', e.target.value)}
                          placeholder="+234 800 000 0000"
                        />
                      </div>

                      <div>
                        <Label htmlFor="companyName" className="flex items-center">
                          <Building className="mr-2 h-4 w-4" />
                          Company Name
                        </Label>
                        <Input
                          id="companyName"
                          value={formData.companyName}
                          onChange={(e) => handleChange('companyName', e.target.value)}
                          placeholder="Your Company Ltd"
                        />
                      </div>

                      <div>
                        <Label htmlFor="nin" className="flex items-center">
                          <Hash className="mr-2 h-4 w-4" />
                          NIN
                        </Label>
                        <Input
                          id="nin"
                          value={formData.nin}
                          onChange={(e) => handleChange('nin', e.target.value)}
                          placeholder="National Identification Number"
                        />
                      </div>

                      <div>
                        <Label htmlFor="cacNumber" className="flex items-center">
                          <Hash className="mr-2 h-4 w-4" />
                          CAC Number
                        </Label>
                        <Input
                          id="cacNumber"
                          value={formData.cacNumber}
                          onChange={(e) => handleChange('cacNumber', e.target.value)}
                          placeholder="Corporate Affairs Commission Number"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address" className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4" />
                        Address
                      </Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleChange('address', e.target.value)}
                        placeholder="Your full address"
                      />
                    </div>

                    <Separator />

                    <div className="flex justify-end">
                      <Button 
                        type="submit" 
                        className="bg-nbc-blue hover:bg-blue-700"
                        disabled={updateProfileMutation.isPending}
                      >
                        {updateProfileMutation.isPending ? 'Updating...' : 'Update Profile'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Account Security */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Security</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Password</h4>
                        <p className="text-sm text-gray-600">Last updated: Recently</p>
                      </div>
                      <Button variant="outline">
                        Change Password
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-600">Add an extra layer of security</p>
                      </div>
                      <Button variant="outline">
                        Enable 2FA
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Account Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Account Details</h4>
                      <ul className="space-y-2 text-gray-600">
                        <li>Username: {user.username}</li>
                        <li>Account Type: {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}</li>
                        <li>Verification Status: {user.isVerified ? 'Verified' : 'Pending'}</li>
                        <li>Member Since: {new Date(user.createdAt || '').toLocaleDateString()}</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Support</h4>
                      <ul className="space-y-2 text-gray-600">
                        <li>Help Center: Available 24/7</li>
                        <li>Phone: +234-9-123-4567</li>
                        <li>Email: support@nbc.gov.ng</li>
                        <li>Response Time: Within 24 hours</li>
                      </ul>
                    </div>
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
