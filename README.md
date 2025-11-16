# 🌍 Mystical Vacations - Luxury Travel Booking Platform

A premium full-stack web application for booking luxury travel experiences across Kenya and Tanzania. Built with Next.js 15, TypeScript, and Express.

![Mystical Vacations](https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&h=400&fit=crop)

## ✨ Features

### Frontend
- **🎨 Stunning UI**: Cinematic design with Deep Navy (#0A192F) and Muted Gold (#D4AF37) color palette
- **🔍 Omni-Search**: Centralized search with 4 tabs (Packages, Accommodation, Transport, Excursions)
- **📦 10 Curated Packages**: From Great Migration safaris to Kilimanjaro treks
- **🏨 20 Luxury Accommodations**: 5-star lodges, resorts, and boutique hotels
- **🚆 Multi-modal Transport**: Flight and SGR train comparisons with pricing
- **🎯 15 Unique Excursions**: Safari, culture, beach, adventure, and wellness experiences
- **💳 Complete Booking Flow**: 3-step process (Review → Payment → Confirmation)
- **📱 Fully Responsive**: Mobile-first design with Tailwind CSS
- **✨ Smooth Animations**: Framer Motion for elegant transitions

### Backend
- **🔐 Express/TypeScript API**: RESTful API with proper TypeScript interfaces
- **🚂 SGR/M-Pesa Abstraction**: Mock implementation of Standard Gauge Railway booking with M-Pesa B2B payment
- **💰 Payment Processing**: Mock payment gateway integration
- **📊 Data Models**: Comprehensive TypeScript interfaces for all entities
- **🎫 Ticket Generation**: Automated SGR ticket generation with QR codes

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **HTTP Client**: Axios
- **Image Handling**: Next.js Image Optimization

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Development**: tsx (TypeScript execution)

## 📁 Project Structure

```
mystical-vacations-web/
├── app/                          # Next.js app directory
│   ├── layout.tsx               # Root layout with Header/Footer
│   ├── page.tsx                 # Home page with hero & search
│   ├── packages/                # Package listing & detail pages
│   ├── accommodation/           # Accommodation search
│   ├── transport/               # Transport options
│   ├── excursions/              # Excursions catalog
│   ├── book/                    # Booking flow (review, payment, confirm)
│   ├── about/                   # About page
│   └── contact/                 # Contact page
├── backend/                     # Express backend
│   ├── server.ts               # Main server file
│   ├── routes/                 # API routes
│   │   ├── packages.ts
│   │   ├── accommodation.ts
│   │   ├── transport.ts
│   │   ├── excursions.ts
│   │   ├── booking.ts
│   │   ├── payment.ts
│   │   └── sgr.ts              # SGR/M-Pesa abstraction
│   └── tsconfig.json
├── components/                  # React components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── OmniSearch.tsx
│   └── PriceBreakdownWidget.tsx
├── data/                        # Mock data
│   ├── packages.ts             # 10 luxury packages
│   ├── accommodation.ts        # 20 properties
│   ├── transport.ts            # 8 transport routes
│   └── excursions.ts           # 15 experiences
├── types/                       # TypeScript interfaces
│   └── index.ts                # All type definitions
├── utils/                       # Utility functions
│   ├── formatters.ts
│   ├── constants.ts
│   └── api-client.ts
├── lib/                         # Library code
│   └── mock-images.ts
└── public/                      # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/mystical-vacations-web.git
cd mystical-vacations-web
```

2. **Install dependencies**
```bash
npm install
```

3. **Run the development servers**

**Terminal 1 - Frontend (Next.js)**
```bash
npm run dev
```
Frontend will be available at: http://localhost:3000

**Terminal 2 - Backend (Express)**
```bash
npm run backend
```
Backend API will be available at: http://localhost:4000

### Production Build

```bash
# Build frontend
npm run build

# Start production server
npm start

# Start backend (separate terminal)
npm run backend
```

## 🎯 Key Pages & Features

### Home Page (`/`)
- Cinematic hero section with full-screen image
- Omni-Search component with 4 tabs
- Featured packages grid
- Featured excursions
- Why Choose Us section
- Call-to-action

### Packages (`/packages`)
- 10 luxury travel packages
- Filter by duration
- Sort by price, rating, or duration
- Package detail pages with full itinerary

### Accommodation (`/accommodation`)
- 20 luxury properties across Kenya & Tanzania
- Filter by country and type
- Sort by price or rating
- Detailed property information

### Transport (`/transport`)
- Flight vs SGR train comparisons
- Multi-modal route options
- Real-time pricing
- Amenities display

### Excursions (`/excursions`)
- 15 curated experiences
- Filter by category (Safari, Culture, Beach, Adventure, Food & Wine, Wellness)
- Detailed activity information
- Pricing and duration

### Booking Flow
1. **Review** (`/book/review`): Select guests and dates
2. **Payment** (`/book/payment`): Guest info and payment details
3. **Confirmation** (`/book/confirm`): Booking reference and summary

## 🔌 API Endpoints

### Packages
- `GET /api/packages` - List all packages
- `GET /api/packages/:id` - Get package by ID

### Accommodation
- `GET /api/accommodation` - List accommodations with filters

### Transport
- `GET /api/transport/search` - Search transport routes

### Excursions
- `GET /api/excursions` - List excursions with filters

### Booking
- `POST /api/booking/create` - Create new booking
- `GET /api/booking/:reference` - Get booking by reference

### Payment
- `POST /api/payment/process` - Process payment
- `POST /api/payment/verify` - Verify payment status

### SGR (Standard Gauge Railway)
- `POST /api/sgr/book` - Book SGR tickets with M-Pesa abstraction
- `GET /api/sgr/ticket/:ticketNumber` - Retrieve ticket
- `GET /api/sgr/availability` - Check seat availability

## 🎨 Design System

### Colors
- **Primary Navy**: `#0A192F` (Deep, sophisticated base)
- **Accent Gold**: `#D4AF37` (Luxury accent)
- **Navy Light**: `#112240`
- **Gold Light**: `#E5C158`

### Typography
- **Headings**: Serif font family (Georgia)
- **Body**: Sans-serif (Inter)

### Breakpoints
- **Mobile**: `sm` (640px)
- **Tablet**: `md` (768px)
- **Desktop**: `lg` (1024px)

## 🔐 SGR/M-Pesa Abstraction

The SGR booking system demonstrates a complex real-world scenario:

1. **User Payment**: Guest pays via standard card/gateway
2. **Backend Conversion**: Server receives payment token
3. **M-Pesa B2B**: Backend processes M-Pesa payment to Kenya Railways
4. **Ticket Generation**: Upon successful payment, generates SGR tickets with QR codes
5. **Response**: Returns tickets to user

**Key Files**:
- `backend/routes/sgr.ts` - Complete SGR/M-Pesa implementation
- `types/index.ts` - SGR interfaces (ISGRBookingRequest, ISGRTicket, etc.)

## 📝 Mock Data

All mock data is realistic and based on actual Kenya/Tanzania destinations:

### Packages (10)
- Great Migration Experience
- Zanzibar Paradise Retreat
- Kilimanjaro Summit Adventure
- Kenya Safari Classic
- And 6 more...

### Accommodation (20)
- Four Seasons Safari Lodge Serengeti
- Angama Mara
- Zuri Zanzibar Resort
- And 17 more...

### Transport Routes (8)
- Nairobi ↔ Mombasa (Flight vs SGR comparison)
- Multi-modal routes (Flight + Ferry)
- Charter flights
- Road transfers

### Excursions (15)
- Hot Air Balloon Safari
- Maasai Village Cultural Experience
- Stone Town Walking Tour
- Scuba Diving Mnemba Atoll
- And 11 more...

## 🌟 Best Practices Implemented

- ✅ Type-safe with strict TypeScript
- ✅ Mobile-first responsive design
- ✅ SEO-optimized metadata
- ✅ Image optimization with Next.js
- ✅ Clean component architecture
- ✅ Reusable utility functions
- ✅ Proper error handling
- ✅ RESTful API design
- ✅ Comprehensive data models

## 🤝 Contributing

This is a demonstration project. For production use, consider:
- Implementing real payment gateway integration
- Adding user authentication
- Connecting to actual SGR/M-Pesa APIs
- Using a real database
- Adding comprehensive testing
- Implementing state management (Redux/Zustand)
- Adding server-side rendering optimizations

## 📄 License

This project is for demonstration purposes.

## 🙏 Acknowledgments

- Images from Unsplash (placeholder service)
- Inspired by luxury travel platforms
- Built following modern web development best practices

---

**Built with 🦁 for East African luxury travel**

