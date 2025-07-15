export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <img 
              src="/Images/NBC-logo.jpg" 
              alt="NBC Logo" 
              className="h-12 w-auto mb-4"
            />
            <h4 className="font-semibold text-gray-900 mb-4">NBC Portal</h4>
            <p className="text-sm text-gray-600">
              Official licensing portal of the National Broadcasting Commission of Nigeria
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-nbc-blue">License Requirements</a></li>
              <li><a href="#" className="hover:text-nbc-blue">Application Forms</a></li>
              <li><a href="#" className="hover:text-nbc-blue">Fee Structure</a></li>
              <li><a href="#" className="hover:text-nbc-blue">NBC Act</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-nbc-blue">Help Center</a></li>
              <li><a href="#" className="hover:text-nbc-blue">Contact Support</a></li>
              <li><a href="#" className="hover:text-nbc-blue">System Status</a></li>
              <li><a href="#" className="hover:text-nbc-blue">User Guide</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Contact</h4>
            <div className="text-sm text-gray-600 space-y-2">
              <p>Phone: +234-9-123-4567</p>
              <p>Email: licensing@nbc.gov.ng</p>
              <p>Address: Plot 755, Herbert Macaulay Way, Central Area, Abuja</p>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>&copy; 2024 National Broadcasting Commission. All rights reserved. | Privacy Policy | Terms of Service</p>
        </div>
      </div>
    </footer>
  );
}
