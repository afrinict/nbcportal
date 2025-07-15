import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  FileText, 
  FolderOpen, 
  CreditCard, 
  History, 
  Settings,
  Award,
  Building2,
  Layers,
  ListTree,
  Workflow,
  PlusCircle,
  Users,
  Shield,
  BarChart3
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Applications', href: '/applications', icon: FileText },
  { name: 'Documents', href: '/documents', icon: FolderOpen },
  { name: 'Payments', href: '/payments', icon: CreditCard },
  { name: 'Certificates', href: '/certificates', icon: Award },
  { name: 'License History', href: '/history', icon: History },
  { name: 'Profile Settings', href: '/profile', icon: Settings }
];

const adminNavigation = [
  { name: 'Admin Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Reports & Analytics', href: '/reports', icon: BarChart3 },
  { name: 'Department Dashboard', href: '/admin/department-dashboard', icon: Building2 },
  { name: 'Department Roles', href: '/admin/department-roles', icon: Shield },
  { name: 'Departments', href: '/admin/departments', icon: Building2 },
  { name: 'Units', href: '/admin/units', icon: Layers },
  { name: 'Subunits', href: '/admin/subunits', icon: ListTree },
  { name: 'Workflow Builder', href: '/admin/workflow-builder', icon: Workflow },
  { name: 'User Management', href: '/admin/users', icon: Users }
];

export function Sidebar() {
  const { user } = useAuth();
  const [location] = useLocation();

  // Filter navigation based on user role
  const getNavigationItems = () => {
    if (user?.role === 'admin') {
      return adminNavigation;
    }
    
    // For applicant users, include the New Application link
    const applicantNav = [...navigation];
    if (user?.role === 'applicant') {
      applicantNav.splice(1, 0, { name: 'New Application', href: '/new-application', icon: PlusCircle });
    }
    
    return applicantNav;
  };

  const navigationItems = getNavigationItems();

  return (
    <nav className="space-y-2">
      {navigationItems.map((item) => {
        const isActive = location === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
              isActive
                ? 'bg-nbc-blue text-white'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            )}
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
