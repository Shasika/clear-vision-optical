# OpticalVision - Modern Optical Store Platform

A comprehensive, modern website and admin management system for OpticalVision optical store built with React.js, TypeScript, and Express.js.

## 🌟 Current Features

### 🏢 **Public Website**

#### **Homepage & Navigation**
- Modern responsive hero section with company branding
- Featured products showcase
- Smooth navigation with mobile-optimized menu
- Quick access to all major sections

#### **Product Catalogs**
- **Frames Collection**: Browse extensive eyeglass frame inventory
- **Sunglasses Collection**: Premium sunglasses with detailed specifications
- **Product Details**: Individual product pages with full specifications
- **Advanced Search & Filtering**: Multi-criteria filtering by:
  - Brand, category, material, shape, color
  - Price range, gender, stock status
  - Custom mobile-responsive dropdown filters

#### **Company Pages**
- **About Us**: Company history, mission, and values
- **Services**: Comprehensive optical services with pricing
- **Contact**: Interactive contact form with validation
- **Business Information**: Hours, location, and contact details

### 🛡️ **Admin Management System**

#### **Dashboard Analytics**
- Comprehensive overview with key metrics
- Real-time inventory statistics
- Sales performance indicators
- Stock status monitoring
- Brand and material analysis
- Price distribution insights
- Customer inquiry tracking

#### **Product Management**
- **Frames Management**: Full CRUD operations for eyeglass frames
- **Sunglasses Management**: Complete sunglasses inventory control
- **Image Upload System**: Multi-image upload with automatic organization
- **Bulk Operations**: Import/export capabilities
- **Stock Management**: Real-time inventory tracking

#### **Customer Communications**
- **Inquiry Management**: Customer inquiry tracking and responses
- **Contact Management**: Lead management from contact forms
- **Status Tracking**: Complete workflow from new to completed
- **Priority System**: High/medium/low priority classification
- **Assignment System**: Assign inquiries to team members

#### **Data Management**
- **JSON Data Editor**: Direct editing of all database files
- **Syntax Validation**: Real-time JSON validation and error checking
- **File Operations**: Save, preview, download, and backup functionality
- **Version Control**: Change tracking and rollback capabilities

#### **Company Settings**
- **Business Information**: Update company details, hours, contact info
- **Team Management**: Staff profiles and contact information
- **Service Configuration**: Manage services and pricing
- **System Settings**: Platform configuration options

### 🔧 **Technical Features**

#### **Mobile-First Design**
- **Responsive Dropdowns**: Custom mobile-optimized dropdown components
- **Touch-Friendly Interface**: 44px minimum touch targets
- **Adaptive Layouts**: Separate mobile/desktop layouts where needed
- **Smart Positioning**: Intelligent dropdown positioning (top/bottom)

#### **Advanced UI Components**
- **Custom Pagination**: Mobile-responsive pagination with flexible page sizes
- **Smart Tables**: Sortable tables with mobile-friendly layouts
- **Interactive Forms**: Real-time validation and user feedback
- **Modal Systems**: Overlay dialogs for confirmations and previews

#### **Database & API**
- **JSON File Database**: Structured data storage in JSON format
- **RESTful API**: Complete CRUD operations via Express.js endpoints
- **File Management**: Automated image organization and cleanup
- **Data Validation**: Server-side validation and error handling

## 🚀 **Technology Stack**

### **Frontend**
- **React 19+** with TypeScript
- **Tailwind CSS 4.x** for styling
- **React Router v7** for navigation
- **Lucide React** for icons
- **Vite** as build tool

### **Backend**
- **Express.js** API server
- **Multer** for file uploads
- **CORS** for cross-origin requests
- **JSON File System** for data persistence

### **Development Tools**
- **TypeScript** for type safety
- **ESLint** for code quality
- **Custom Hooks** for state management
- **Responsive Design** utilities

## 📊 **Database Structure**

### **JSON Data Files** (`server/data/`)
```
├── company.json     # Business information, team, services
├── frames.json      # Eyeglass frames inventory
├── sunglasses.json  # Sunglasses inventory
├── contacts.json    # Customer contact submissions
└── inquiries.json   # Customer inquiries and support requests
```

### **Sample Frame Record**
```json
{
  "id": "frame-001",
  "name": "Ray-Ban Classic Aviator",
  "brand": "Ray-Ban",
  "category": "prescription",
  "material": "metal",
  "shape": "aviator",
  "color": "Gold",
  "price": 25000,
  "inStock": true,
  "description": "Classic aviator frames with premium metal construction",
  "features": ["UV Protection", "Lightweight", "Durable"],
  "gender": "unisex",
  "frameSize": {
    "lens_width": 58,
    "bridge_width": 14,
    "temple_length": 135
  },
  "imageUrl": "/images/frames/aviator-gold.jpg",
  "images": ["/images/frames/aviator-gold-1.jpg"]
}
```

### **Image Organization** (`public/images/`)
```
├── frames/          # Eyeglass frame images
├── sunglasses/      # Sunglasses images
├── company/         # Company and team photos
└── temp/           # Temporary upload directory
```

## 🛠️ **Development Setup**

### **Prerequisites**
- Node.js 18+
- npm or yarn

### **Installation**

1. **Clone the repository:**
```bash
git clone <repository-url>
cd optical-website
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the backend server:**
```bash
cd server
npm install
npm start
```
Backend runs on: `http://localhost:3001`

4. **Start the frontend development server:**
```bash
npm run dev
```
Frontend runs on: `http://localhost:5174`

### **Available Scripts**

#### **Frontend**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

#### **Backend**
- `npm start` - Start production server
- `npm run dev` - Start with nodemon (auto-restart)

## 📁 **Project Structure**

```
optical-website/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Layout.tsx       # Main layout wrapper
│   │   ├── Header.tsx       # Navigation header
│   │   ├── Footer.tsx       # Site footer
│   │   ├── CustomDropdown.tsx   # Mobile-responsive dropdown
│   │   ├── InlineDropdown.tsx   # Inline table dropdown
│   │   └── admin/           # Admin-specific components
│   │       ├── AdminLayout.tsx  # Admin panel layout
│   │       ├── Pagination.tsx   # Mobile-first pagination
│   │       └── SortingControls.tsx # Table sorting
│   ├── pages/               # Page components
│   │   ├── Home.tsx         # Homepage
│   │   ├── About.tsx        # About page
│   │   ├── Services.tsx     # Services page
│   │   ├── Contact.tsx      # Contact page
│   │   ├── Frames.tsx       # Frames catalog
│   │   ├── Sunglasses.tsx   # Sunglasses catalog
│   │   └── admin/           # Admin pages
│   │       ├── AdminDashboard.tsx    # Main dashboard
│   │       ├── DataManagement.tsx    # JSON editor
│   │       ├── CompanySettings.tsx   # Company settings
│   │       ├── frames/      # Frame management
│   │       ├── sunglasses/  # Sunglasses management
│   │       ├── contacts/    # Contact management
│   │       └── inquiries/   # Inquiry management
│   ├── hooks/               # Custom React hooks
│   │   ├── useFrames.ts     # Frames data management
│   │   ├── useSunglasses.ts # Sunglasses data management
│   │   ├── useAdmin.ts      # Admin authentication
│   │   ├── usePagination.ts # Pagination logic
│   │   └── useSorting.ts    # Table sorting logic
│   ├── types/               # TypeScript definitions
│   │   ├── frames.ts        # Frame type definitions
│   │   ├── sunglasses.ts    # Sunglasses types
│   │   ├── contact.ts       # Contact types
│   │   └── inquiry.ts       # Inquiry types
│   ├── services/            # API service functions
│   │   ├── dataService.ts   # Data fetching utilities
│   │   └── contactService.ts # Contact form handling
│   ├── contexts/            # React context providers
│   │   └── AdminContext.tsx # Admin authentication context
│   └── utils/               # Utility functions
├── server/                  # Backend API server
│   ├── server.js           # Express server configuration
│   ├── data/               # JSON database files
│   │   ├── company.json
│   │   ├── frames.json
│   │   ├── sunglasses.json
│   │   ├── contacts.json
│   │   └── inquiries.json
│   └── package.json        # Server dependencies
└── public/
    ├── images/             # Product and company images
    └── index.html          # Main HTML template
```

## 🔧 **API Endpoints**

### **Product Management**
- `GET /api/frames` - Get all frames
- `POST /api/frames` - Update frames database
- `GET /api/sunglasses` - Get all sunglasses
- `POST /api/sunglasses` - Update sunglasses database

### **Customer Management**
- `GET /api/contacts` - Get all contacts
- `POST /api/contacts` - Create new contact
- `PUT /api/contacts/:id` - Update contact
- `DELETE /api/contacts/:id` - Delete contact
- `GET /api/contacts/stats` - Get contact statistics

### **Inquiry Management**
- `GET /api/inquiries` - Get all inquiries
- `POST /api/inquiries` - Create new inquiry
- `PUT /api/inquiries/:id` - Update inquiry
- `DELETE /api/inquiries/:id` - Delete inquiry
- `GET /api/inquiries/stats` - Get inquiry statistics

### **Company Data**
- `GET /api/company` - Get company information
- `POST /api/company` - Update company information

### **File Management**
- `POST /api/upload-image` - Upload product images
- `DELETE /api/delete-image` - Delete images
- `GET /api/data/files` - List JSON data files
- `GET /api/data/files/:filename` - Load JSON file
- `PUT /api/data/files/:filename` - Update JSON file

### **System**
- `GET /api/health` - Health check endpoint

## 🎨 **Customization**

### **Styling**
Update colors and themes in `tailwind.config.js`:
```js
theme: {
  extend: {
    colors: {
      primary: {
        50: '#eff6ff',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
      }
    }
  }
}
```

### **Content Management**
- Update company information via Admin → Company Settings
- Manage products through Admin → Frames/Sunglasses Management
- Edit JSON data directly via Admin → Data Management
- Upload and organize images through the admin interface

### **Configuration**
- Server port: `server/server.js` (default: 3001)
- Frontend dev server: `vite.config.ts` (default: 5174)
- Database location: `server/data/` directory

## 🚀 **Production Deployment**

### **Build Process**
1. **Build frontend:**
```bash
npm run build
```

2. **Prepare server:**
```bash
cd server
npm install --production
```

3. **Environment Setup:**
```bash
# Set production environment
export NODE_ENV=production
export PORT=3001
```

### **Deployment Options**
- **Frontend**: Deploy `dist/` folder to static hosting (Netlify, Vercel)
- **Backend**: Deploy server to Node.js hosting (Railway, Heroku, DigitalOcean)
- **Full-Stack**: Deploy both to same server with reverse proxy

## 📋 **Current Data**
- **25+ Sample Frames**: Diverse collection with various brands and styles
- **25+ Sample Sunglasses**: Premium sunglasses with detailed specifications  
- **25+ Sample Contacts**: Customer contact records with various statuses
- **25+ Sample Inquiries**: Customer inquiries with priority tracking
- **Complete Company Profile**: Business information, team, and services

## 🔒 **Admin Access**
- **Login URL**: `/admin`
- **Default Credentials**: Set up during first run
- **Role-Based Access**: Admin authentication system
- **Session Management**: Secure login sessions

## 🐛 **Development Notes**
- **Mobile-First**: All components designed for mobile first
- **Responsive**: Tested on various screen sizes
- **TypeScript**: Full type safety throughout
- **Modern React**: Uses latest React 19 features
- **Performance**: Optimized for fast loading
- **SEO Ready**: Proper meta tags and structure

## 📄 **License**
This project is licensed under the MIT License.

## 🤝 **Contributing**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

*Last updated: January 2025*