import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { loginUser } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { PowerCalculator } from '@/components/power-calculator';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await loginUser(email, password);
      login(response.user, response.token);
      toast({
        title: "Login successful",
        description: "Welcome back to NBC License Portal",
      });
      // Small delay to ensure auth context is updated
      setTimeout(() => {
        setLocation('/dashboard');
      }, 100);
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <img 
            src="/Images/NBC-logo.jpg" 
            alt="NBC Logo" 
            className="mx-auto h-20 w-auto mb-4"
          />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            National Broadcasting Commission
          </h1>
          <p className="text-xl text-gray-600">
            License Application Portal & Broadcasting Tools
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Login Section */}
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Sign in to your account</CardTitle>
                <CardDescription>
                  Access the National Broadcasting Commission License Portal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="your.email@example.com"
                      className="h-12"
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Your password"
                      className="h-12"
                    />
                  </div>

                  <Button type="submit" className="w-full h-12 bg-nbc-blue hover:bg-blue-700 text-lg" disabled={loading}>
                    {loading ? "Signing in..." : "Sign in"}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link href="/register">
                      <a className="font-medium text-nbc-blue hover:text-blue-500">
                        Sign up here
                      </a>
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Portal Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">License Application Management</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Document Upload & Verification</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Payment Processing</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Real-time Application Tracking</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Broadcasting Power Calculator</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Power Calculator Section */}
          <div className="space-y-6">
            <PowerCalculator />
            
            {/* Additional Info */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Broadcasting Regulations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">
                  The NBC regulates all broadcasting activities in Nigeria. Use the power calculator above to determine compliance with our broadcasting standards.
                </p>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <strong>FM Radio:</strong> 88-108 MHz
                  </div>
                  <div>
                    <strong>AM Radio:</strong> 535-1605 kHz
                  </div>
                  <div>
                    <strong>VHF TV:</strong> 174-216 MHz
                  </div>
                  <div>
                    <strong>UHF TV:</strong> 470-806 MHz
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            © 2024 National Broadcasting Commission. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            For technical support, contact: support@nbc.gov.ng
          </p>
        </div>
      </div>
    </div>
  );
}
