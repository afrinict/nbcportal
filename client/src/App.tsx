import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/auth-context";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Dashboard from "@/pages/dashboard";
import Applications from "@/pages/applications";
import NewApplication from "@/pages/new-application";
import Documents from "@/pages/documents";
import Payments from "@/pages/payments";
import Profile from "@/pages/profile";
import Certificates from "@/pages/certificates";
import Reports from "@/pages/reports";
import AdminDashboard from "@/pages/admin/index";
import NotFound from "@/pages/not-found";
import DepartmentsAdminPage from '@/pages/admin/departments';
import UnitsAdminPage from '@/pages/admin/units';
import AdminIndex from '@/pages/admin/index';
import SubunitsAdminPage from '@/pages/admin/subunits';
import WorkflowBuilder from "./pages/admin/workflow-builder";
import AdminUsers from "@/pages/admin/users";
import AdminDepartmentDashboard from "@/pages/admin/department-dashboard";
import AdminDepartmentRoles from "@/pages/admin/department-roles";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/applications" component={Applications} />
      <Route path="/applications/new" component={NewApplication} />
      <Route path="/documents" component={Documents} />
      <Route path="/payments" component={Payments} />
      <Route path="/certificates" component={Certificates} />
      <Route path="/reports" component={Reports} />
      <Route path="/profile" component={Profile} />
      <Route path="/admin/departments" component={DepartmentsAdminPage} />
      <Route path="/admin/units" component={UnitsAdminPage} />
      <Route path="/admin" component={AdminIndex} />
      <Route path="/admin/subunits" component={SubunitsAdminPage} />
      <Route path="/admin/workflow-builder" component={WorkflowBuilder} />
      <Route path="/admin/users" component={AdminUsers} />
      <Route path="/admin/department-dashboard" component={AdminDepartmentDashboard} />
      <Route path="/admin/department-roles" component={AdminDepartmentRoles} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
