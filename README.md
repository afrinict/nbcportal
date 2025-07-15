# NBC License Portal

Official licensing portal of the National Broadcasting Commission of Nigeria. Apply for broadcasting licenses, track applications, and manage renewals.

## 🚀 Features

### 📊 Power Calculator
- **UHF, VHF, FM, AM** broadcasting calculator
- Real-time calculations for ERP, coverage area, field strength
- NBC compliance checking
- Interactive UI with service type selection

### 📈 Analytics & Reporting
- Real-time dashboard with charts and metrics
- Comprehensive reporting system with filters
- Export functionality (JSON/CSV)
- Performance metrics and growth tracking

### 👥 User Management
- Authentication system with JWT
- Role-based access control (Admin, Staff, Applicant)
- User profile management
- Department and unit management

### 📋 Application Management
- License application workflow
- Document upload and management
- Status tracking and notifications
- Payment processing

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Node.js, Express, PostgreSQL
- **Database**: Drizzle ORM
- **UI**: Tailwind CSS, Radix UI
- **Charts**: Recharts
- **Authentication**: JWT
- **Deployment**: Netlify, GitHub Actions

## 📦 Installation

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/NBCLicensePortal.git
   cd NBCLicensePortal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Configure your `.env` file:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/nbc_portal
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 🚀 Deployment

### Netlify Deployment

1. **Connect your GitHub repository to Netlify**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub account
   - Select the NBCLicensePortal repository

2. **Configure build settings**
   - Build command: `npm run build`
   - Publish directory: `dist/public`
   - Node version: 18

3. **Set environment variables in Netlify**
   - Go to Site settings > Environment variables
   - Add the following variables:
     - `DATABASE_URL`
     - `JWT_SECRET`
     - `NODE_ENV=production`

4. **Deploy**
   - Netlify will automatically deploy on every push to main branch
   - Preview deployments are created for pull requests

### GitHub Actions CI/CD

The repository includes GitHub Actions workflow for automated deployment:

1. **Set up GitHub Secrets**
   - Go to your repository settings > Secrets and variables > Actions
   - Add the following secrets:
     - `NETLIFY_AUTH_TOKEN`
     - `NETLIFY_SITE_ID`
     - `DATABASE_URL`
     - `JWT_SECRET`

2. **Push to main branch**
   - The workflow will automatically build and deploy to Netlify
   - Pull requests will create preview deployments

## 📁 Project Structure

```
NBCLicensePortal/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions
│   │   └── contexts/      # React contexts
│   └── public/            # Static assets
├── server/                # Backend Node.js application
│   ├── routes.ts          # API routes
│   ├── db.ts             # Database configuration
│   └── middleware/       # Express middleware
├── shared/               # Shared types and schemas
├── migrations/           # Database migrations
├── dist/                # Build output
└── docs/                # Documentation
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Run TypeScript type checking
- `npm run db:push` - Push database schema changes

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Applications
- `GET /api/applications` - Get all applications
- `POST /api/applications` - Create new application
- `PUT /api/applications/:id` - Update application
- `DELETE /api/applications/:id` - Delete application

### Analytics
- `GET /api/analytics/dashboard` - Dashboard analytics
- `GET /api/analytics/reports` - Generate reports

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `NODE_ENV` | Environment (development/production) | Yes |
| `PORT` | Server port (default: 5000) | No |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@nbc.gov.ng or create an issue in this repository.

## 🗺️ Roadmap

- [ ] Mobile application
- [ ] Advanced analytics dashboard
- [ ] Integration with payment gateways
- [ ] Multi-language support
- [ ] Advanced workflow automation
- [ ] API rate limiting
- [ ] Real-time notifications

---

**Built with ❤️ for the National Broadcasting Commission of Nigeria** 