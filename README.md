# OpticalVision - Optical Store Website

A modern, responsive website for OpticalVision optical store built with React.js and TypeScript.

## Features

### 🏢 Company Information
- **Home Page**: Hero section with company overview and featured content
- **About Us**: Company history, mission, values, and team information
- **Services**: Comprehensive list of optical services with pricing
- **Contact**: Contact form, location details, and business hours

### 👓 Frames Management
- **Text File Database**: Simple text-based database for frame inventory
- **Frame Catalog**: Browse extensive collection with detailed product information
- **Search & Filter**: Advanced filtering by brand, category, material, shape, color, and more
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### 🎨 Modern UI/UX
- **Tailwind CSS**: Modern styling with custom color scheme
- **Responsive Layout**: Mobile-first design approach
- **Interactive Components**: Smooth animations and hover effects
- **Accessible**: Built with accessibility best practices

## Technology Stack

- **Frontend**: React 19+ with TypeScript
- **Styling**: Tailwind CSS 4.x
- **Routing**: React Router v7
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Database**: Text file-based storage

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd optical-website
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5174`

## Database Structure

The frame database is stored in `public/frames.txt` with the following format:

```
id:FR001|name:Frame Name|brand:Brand Name|category:prescription|material:metal|shape:rectangle|color:Black|price:15500|inStock:true|description:Description here|features:Feature1,Feature2|gender:unisex|lens_width:52|bridge_width:18|temple_length:140
```

### Adding New Frames

To add new frames to the catalog, edit the `public/frames.txt` file following the pipe-delimited format above.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Layout.tsx
│   └── FrameCard.tsx
├── pages/              # Page components
│   ├── Home.tsx
│   ├── About.tsx
│   ├── Services.tsx
│   ├── Contact.tsx
│   └── Frames.tsx
├── hooks/              # Custom React hooks
│   └── useFrames.ts
├── types/              # TypeScript type definitions
│   └── frames.ts
├── utils/              # Utility functions
│   └── frameParser.ts
└── data/               # Static data files
```

## Features in Detail

### Frame Management System
- Parse text file database
- Real-time search functionality
- Multi-criteria filtering
- Sort by name, price, brand
- Stock status tracking

### Responsive Design
- Mobile-first approach
- Breakpoints for all screen sizes
- Touch-friendly navigation
- Optimized performance

### Contact System
- Contact form with validation
- Business hours display
- Location information
- Emergency contact details

## Customization

### Colors
Update the color scheme in `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom color palette
      }
    }
  }
}
```

### Content
- Update company information in the respective page components
- Modify the frames database in `public/frames.txt`
- Replace placeholder images with actual product photos

## Production Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting service
3. Ensure the `frames.txt` file is accessible at the root URL

## License

This project is licensed under the MIT License.
