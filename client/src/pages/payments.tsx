import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, CreditCard, AlertCircle } from 'lucide-react';
import { Payment, Application } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export default function Payments() {
  const { user, token } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user || !token) {
      setLocation('/login');
    }
  }, [user, token, setLocation]);

  const { data: payments, isLoading: paymentsLoading } = useQuery<Payment[]>({
    queryKey: ['/api/payments'],
    enabled: !!token,
  });

  const { data: applications } = useQuery<Application[]>({
    queryKey: ['/api/applications'],
    enabled: !!token,
  });

  const confirmPaymentMutation = useMutation({
    mutationFn: async (transactionId: string) => {
      return apiRequest('POST', `/api/payments/${transactionId}/confirm`, {});
    },
    onSuccess: () => {
      toast({
        title: "Payment confirmed",
        description: "Your payment has been successfully confirmed",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/payments'] });
    },
    onError: (error: any) => {
      toast({
        title: "Confirmation failed",
        description: error.message || "Failed to confirm payment",
        variant: "destructive",
      });
    }
  });

  const handleDownloadReceipt = (transactionId: string) => {
    // Implementation would download the receipt
    console.log('Download receipt for transaction:', transactionId);
    toast({
      title: "Receipt download",
      description: "Receipt download feature will be implemented",
    });
  };

  const handleConfirmPayment = (transactionId: string) => {
    confirmPaymentMutation.mutate(transactionId);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getApplicationTitle = (applicationId: number) => {
    const application = applications?.find(app => app.id === applicationId);
    return application?.title || `Application #${applicationId}`;
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
              <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
              <p className="text-gray-600">View and manage your payment history</p>
            </div>

            {/* Payment Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <CreditCard className="h-8 w-8 text-nbc-blue" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Paid</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ₦{payments?.filter(p => p.status === 'completed').reduce((sum, p) => sum + parseFloat(p.amount), 0).toLocaleString() || '0'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <AlertCircle className="h-8 w-8 text-nbc-orange" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Pending</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ₦{payments?.filter(p => p.status === 'pending').reduce((sum, p) => sum + parseFloat(p.amount), 0).toLocaleString() || '0'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <CreditCard className="h-8 w-8 text-nbc-green" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                      <p className="text-2xl font-bold text-gray-900">{payments?.length || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment History */}
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                {paymentsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : payments && payments.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Transaction ID</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Application</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Type</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Amount</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Date</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Status</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {payments.map(payment => (
                          <tr key={payment.id}>
                            <td className="py-4 px-4 text-sm text-gray-900 font-mono">
                              {payment.transactionId}
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-900">
                              {getApplicationTitle(payment.applicationId)}
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-900 capitalize">
                              {payment.paymentType.replace('_', ' ')}
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-900 font-semibold">
                              ₦{parseFloat(payment.amount).toLocaleString()}
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-500">
                              {new Date(payment.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-4 px-4">
                              <Badge className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payment.status)}`}>
                                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                              </Badge>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex space-x-2">
                                {payment.status === 'completed' ? (
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="text-nbc-blue hover:text-blue-700"
                                    onClick={() => handleDownloadReceipt(payment.transactionId)}
                                  >
                                    <Download className="mr-1 h-4 w-4" />
                                    Receipt
                                  </Button>
                                ) : payment.status === 'pending' ? (
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="text-nbc-green hover:text-green-700"
                                    onClick={() => handleConfirmPayment(payment.transactionId)}
                                    disabled={confirmPaymentMutation.isPending}
                                  >
                                    {confirmPaymentMutation.isPending ? 'Confirming...' : 'Confirm'}
                                  </Button>
                                ) : null}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CreditCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No payments yet</h3>
                    <p className="text-gray-500">Payment history will appear here once you make payments for your applications</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Application Fees</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>• FM Radio License: ₦50,000</li>
                      <li>• AM Radio License: ₦50,000</li>
                      <li>• Television License: ₦50,000</li>
                      <li>• DTH License: ₦50,000</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Payment Methods</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>• Remita Payment Gateway</li>
                      <li>• Bank Transfer</li>
                      <li>• Online Banking</li>
                      <li>• Card Payment</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-nbc-blue mr-3 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-900">Payment Notice</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        All payments are processed through the official NBC payment gateway. 
                        Keep your transaction receipts for record-keeping purposes.
                      </p>
                    </div>
                  </div>
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
