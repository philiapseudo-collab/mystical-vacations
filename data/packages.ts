/**
 * Real package data for Mystical Vacations
 * Packages provided by client - Bonfire Adventures & Marascarface Travelers Ltd
 */

import { IPackage } from '@/types';

// Helper function to generate generic itinerary based on duration
const generateItinerary = (duration: number, location: string, activityType: string) => {
  const itinerary = [];
  for (let i = 1; i <= duration; i++) {
    if (i === 1) {
      itinerary.push({
        day: i,
        title: 'Arrival & Check-in',
        description: `Arrive at ${location} and check into your accommodation.`,
        activities: ['Arrival', 'Check-in', 'Welcome briefing'],
        accommodation: 'Hotel/Lodge',
        meals: ['Dinner'] as ('Breakfast' | 'Lunch' | 'Dinner')[],
      });
    } else if (i === duration) {
      itinerary.push({
        day: i,
        title: 'Departure',
        description: `Final morning at ${location} before departure.`,
        activities: ['Leisure time', 'Check-out', 'Departure'],
        accommodation: 'N/A',
        meals: ['Breakfast'] as ('Breakfast' | 'Lunch' | 'Dinner')[],
      });
    } else {
      itinerary.push({
        day: i,
        title: `${activityType} Activities`,
        description: `Full day of ${activityType.toLowerCase()} activities at ${location}.`,
        activities: [activityType, 'Sightseeing', 'Leisure time'],
        accommodation: 'Hotel/Lodge',
        meals: ['Breakfast', 'Lunch', 'Dinner'] as ('Breakfast' | 'Lunch' | 'Dinner')[],
      });
    }
  }
  return itinerary;
};

export const packages: IPackage[] = [
  // Package 1: Sarova Whitesands Honeymoon Package
  {
    id: 'pkg-real-001',
    title: 'Sarova Whitesands Honeymoon Package',
    slug: 'sarova-whitesands-honeymoon-package',
    subtitle: 'Two Hearts, One Journey - 3 Days of Romantic Bliss',
    description: 'Experience a romantic getaway at Sarova Whitesands Beach Resort. This honeymoon package includes accommodation, return SGR tickets, transfers, and travel insurance. Pricing varies by group size (2-6 pax). Contact us for a detailed quote.',
    duration: 3,
    maxGroupSize: 6,
    difficulty: 'Easy',
    locations: [
      { country: 'Kenya', city: 'Mombasa' },
    ],
    itinerary: generateItinerary(3, 'Mombasa', 'Beach Relaxation'),
    inclusions: [
      '2 Nights accommodation',
      'Return SGR tickets (Standard Gauge Railway)',
      'Return transfers',
      'Travel insurance',
    ],
    exclusions: [
      'All items not mentioned in the inclusions',
      'Single supplement',
      'Personal expenses',
    ],
    price: {
      basePrice: 269, // KSh 39,000 / 145
      serviceFee: 0,
      taxes: 0,
      total: 269,
      currency: 'USD',
    },
    images: [
      {
        url: 'https://images.trvl-media.com/lodging/5000000/4020000/4016400/4016348/441d4d2b.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill',
        alt: 'Sarova Whitesands Honeymoon Package',
        aspectRatio: '16:9',
        credit: '',
      },
    ],
    highlights: [
      'Romantic honeymoon experience',
      'Beachfront accommodation',
      'SGR transport included',
      'All transfers included',
    ],
    bestSeasons: ['All Year Round'],
    rating: 4.7,
    reviewCount: 85,
    featured: true,
  },
  // Package 2: Family Coastal Christmas Getaway
  {
    id: 'pkg-real-002',
    title: 'Family Coastal Christmas Getaway',
    slug: 'family-coastal-christmas-getaway',
    subtitle: 'Neptune Village Beach Resort & Spa - 5 Days of Family Fun',
    description: 'Celebrate Christmas at Neptune Village Beach Resort & Spa. This family package offers 4 nights accommodation with meals on All Inclusive basis. Choose between SGR or Flight package. Pricing varies by group size and room category. Contact us for a detailed quote.',
    duration: 5,
    maxGroupSize: 8,
    difficulty: 'Easy',
    locations: [
      { country: 'Kenya', city: 'Mombasa' },
    ],
    itinerary: generateItinerary(5, 'Mombasa', 'Beach Activities'),
    inclusions: [
      '4 Nights Accommodation',
      'Meals on All Inclusive basis',
      'Return tickets (SGR or Flight)',
      'Return Transfers',
      'Travel insurance',
    ],
    exclusions: [
      'All items not mentioned in the inclusions',
      'Personal expenses',
    ],
    price: {
      basePrice: 805, // Using lowest price KSh 116,800 / 145 (SGR Superior Garden)
      serviceFee: 0,
      taxes: 0,
      total: 805,
      currency: 'USD',
    },
    images: [
      {
        url: 'https://images.pexels.com/photos/39691/family-pier-man-woman-39691.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        alt: 'Family Coastal Christmas Getaway',
        aspectRatio: '16:9',
        credit: '',
      },
    ],
    highlights: [
      'All Inclusive meals',
      'Family-friendly resort',
      'SGR or Flight options',
      'Christmas holiday special',
    ],
    bestSeasons: ['All Year Round'],
    rating: 4.6,
    reviewCount: 112,
    featured: true,
  },
  // Package 3: Ashnil Mara Camp Safari Package
  {
    id: 'pkg-real-003',
    title: 'Ashnil Mara Camp Safari Package',
    slug: 'ashnil-mara-camp-safari-package',
    subtitle: 'Just Us Two - 3 Days of Wildlife Wonder',
    description: 'Discover the magic of Maasai Mara at Ashnil Mara Camp. This romantic safari package includes accommodation, game drives, meals on Full Board, and professional guide. Pricing varies by group size (2-6 pax). Contact us for a detailed quote.',
    duration: 3,
    maxGroupSize: 6,
    difficulty: 'Easy',
    locations: [
      { country: 'Kenya', city: 'Maasai Mara' },
    ],
    itinerary: generateItinerary(3, 'Maasai Mara', 'Game Drive'),
    inclusions: [
      '2 Nights accommodation',
      'Transport in safari vehicle',
      'Meals on Full Board',
      'Game drives',
      'Professional Tour Guide',
    ],
    exclusions: [
      'Park Fees',
      'Tips',
      'Single supplement',
      'All other items not mentioned',
    ],
    price: {
      basePrice: 281, // KSh 40,800 / 145
      serviceFee: 0,
      taxes: 0,
      total: 281,
      currency: 'USD',
    },
    images: [
      {
        url: 'https://www.masaimara.in/wp-content/uploads/2023/06/image1-2.webp',
        alt: 'Ashnil Mara Camp Safari Package',
        aspectRatio: '16:9',
        credit: '',
      },
    ],
    highlights: [
      'Romantic safari experience',
      'Full Board meals',
      'Game drives included',
      'Professional guide',
    ],
    bestSeasons: ['All Year Round'],
    rating: 4.8,
    reviewCount: 127,
    featured: true,
  },
  // Package 4: Watamu/Malindi Coastal Packages
  {
    id: 'pkg-real-004',
    title: 'Watamu & Malindi Coastal Getaway',
    slug: 'watamu-malindi-coastal-getaway',
    subtitle: 'Multiple Hotel Options - 3 or 5 Days of Beach Paradise',
    description: 'Choose from 7 luxury beach resorts in Watamu, Malindi, and Kilifi. Accommodation options include Turtle Bay Beach Resort, Medina Palms, Hemingways Watamu, Diamonds Malindi, Kilili Baharini Resort & Spa, Silver Palm Kilifi, and Ocean Beach Resort. Pricing varies by hotel, duration, and meal plan. Contact us for a detailed quote.',
    duration: 5, // Using 5 days as primary
    maxGroupSize: 8,
    difficulty: 'Easy',
    locations: [
      { country: 'Kenya', city: 'Watamu' },
      { country: 'Kenya', city: 'Malindi' },
      { country: 'Kenya', city: 'Kilifi' },
    ],
    itinerary: generateItinerary(5, 'Watamu/Malindi', 'Beach Relaxation'),
    inclusions: [
      '4 Nights Accommodation (for 5-day package)',
      'Return SGR tickets',
      'Return Transfers',
      'Travel Insurance',
    ],
    exclusions: [
      'All items not mentioned in the inclusions',
      'Meals (varies by hotel and package)',
    ],
    price: {
      basePrice: 238, // Using lowest price KSh 34,500 / 145 (Turtle Bay 3 days), converted to 5 days equivalent
      serviceFee: 0,
      taxes: 0,
      total: 238,
      currency: 'USD',
    },
    images: [
      {
        url: 'https://cdn.pixabay.com/photo/2021/05/29/03/00/beach-6292382_1280.jpg',
        alt: 'Watamu & Malindi Coastal Getaway',
        aspectRatio: '16:9',
        credit: '',
      },
    ],
    highlights: [
      'Multiple hotel options',
      'SGR transport included',
      'Beachfront locations',
      'All Inclusive or Half Board options',
    ],
    bestSeasons: ['All Year Round'],
    rating: 4.7,
    reviewCount: 156,
    featured: false,
  },
  // Package 5: Mount Kenya Getaways
  {
    id: 'pkg-real-005',
    title: 'Mount Kenya Getaways',
    slug: 'mount-kenya-getaways',
    subtitle: '2 Days of Mountain Escapes',
    description: 'Explore the beautiful Mount Kenya region with stays at various hotels and resorts in Muranga, Nanyuki, Embu, Nyeri, Sagana, and Nyahururu. Options include Comfort Gardens Nanyuki, Hotel Nokras Silver Oak, Chaka Ranch, and many more. Pricing varies by hotel and dates. Contact us for a detailed quote.',
    duration: 2,
    maxGroupSize: 8,
    difficulty: 'Easy',
    locations: [
      { country: 'Kenya', city: 'Nanyuki' },
      { country: 'Kenya', city: 'Mount Kenya' },
    ],
    itinerary: generateItinerary(2, 'Mount Kenya Region', 'Mountain Activities'),
    inclusions: [
      '1 Night Accommodation',
      'Meals as per hotel meal plan',
    ],
    exclusions: [
      'Transport (self-drive packages)',
      'All items not mentioned',
    ],
    price: {
      basePrice: 48, // Using lowest price KSh 7,000 / 145
      serviceFee: 0,
      taxes: 0,
      total: 48,
      currency: 'USD',
    },
    images: [
      {
        url: 'https://cdn.pixabay.com/photo/2022/08/10/17/39/mount-kenya-7377735_1280.jpg',
        alt: 'Mount Kenya Getaways',
        aspectRatio: '16:9',
        credit: '',
      },
    ],
    highlights: [
      'Mountain retreat',
      'Multiple hotel options',
      'Scenic views',
      'Self-drive friendly',
    ],
    bestSeasons: ['All Year Round'],
    rating: 4.6,
    reviewCount: 98,
    featured: false,
  },
  // Package 6: Maasai Mara Long Weekend Escape
  {
    id: 'pkg-real-006',
    title: 'Maasai Mara Long Weekend Escape',
    slug: 'maasai-mara-long-weekend-escape',
    subtitle: '3 Days Safari Adventure - Van or Cruiser Options',
    description: 'Experience the Big Five in Maasai Mara. Choose between Safari Van (budget-friendly) or Land Cruiser (premium comfort). Multiple camp options available including Mara budget camp, Orng\'atuny Mara King Camp, Enkorok camp, Ashnil Mara, Mara Sopa Lodge, and more. Land Cruiser upgrade available. Pricing varies by camp and transport choice. Contact us for a detailed quote.',
    duration: 3,
    maxGroupSize: 8,
    difficulty: 'Easy',
    locations: [
      { country: 'Kenya', city: 'Maasai Mara' },
    ],
    itinerary: generateItinerary(3, 'Maasai Mara', 'Game Drive'),
    inclusions: [
      '2 Nights Accommodation',
      'Transport in Safari Vehicle (Van or Cruiser)',
      'Meals on Full Board',
      'Game Drives',
      'Professional Tour Guide',
    ],
    exclusions: [
      'Park fees',
      'Tips',
      'Single supplement',
    ],
    price: {
      basePrice: 117, // Using lowest Van price KSh 17,000 / 145
      serviceFee: 0,
      taxes: 0,
      total: 117,
      currency: 'USD',
    },
    images: [
      {
        url: 'https://cdn.pixabay.com/photo/2019/03/13/09/12/africa-4052497_1280.jpg',
        alt: 'Maasai Mara Long Weekend Escape',
        aspectRatio: '16:9',
        credit: '',
      },
    ],
    highlights: [
      'Big Five safari',
      'Land Cruiser upgrade available',
      'Multiple camp options',
      'Full Board meals',
    ],
    bestSeasons: ['All Year Round'],
    rating: 4.8,
    reviewCount: 234,
    featured: true,
  },
  // Package 7: Voyager Beach Resort Christmas Holiday Package
  {
    id: 'pkg-real-007',
    title: 'Voyager Beach Resort Christmas Holiday Package',
    slug: 'voyager-beach-resort-christmas-holiday',
    subtitle: '30% OFF Special - 3 Days of Beach Bliss',
    description: 'Special 30% OFF Christmas holiday package at Voyager Beach Resort in Mombasa. Includes accommodation, SGR tickets, transfers, and meals. Pricing varies by group size (2-5 pax). Contact us for a detailed quote.',
    duration: 3,
    maxGroupSize: 5,
    difficulty: 'Easy',
    locations: [
      { country: 'Kenya', city: 'Mombasa' },
    ],
    itinerary: generateItinerary(3, 'Mombasa', 'Beach Activities'),
    inclusions: [
      '2 Nights Accommodation',
      'SGR Tickets (To and Fro)',
      'Transfers',
      'Meals',
    ],
    exclusions: [
      'Personal expenses',
      'Items not mentioned',
    ],
    price: {
      basePrice: 234, // Using lowest group price USD 335 for 5 pax, but showing per person
      serviceFee: 0,
      taxes: 0,
      total: 234,
      currency: 'USD',
    },
    images: [
      {
        url: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/57942966.jpg?k=ab62131c7cebcbbf95365acec83c5fda210aa0239e8b61290948221543f936ab&o=',
        alt: 'Voyager Beach Resort Christmas Holiday Package',
        aspectRatio: '16:9',
        credit: '',
      },
    ],
    highlights: [
      '30% OFF special',
      'Christmas holiday package',
      'Group discounts available',
      'SGR transport included',
    ],
    bestSeasons: ['All Year Round'],
    rating: 4.7,
    reviewCount: 145,
    featured: true,
  },
  // Package 8: Maasai Mara Christmas Holiday Offer
  {
    id: 'pkg-real-008',
    title: 'Maasai Mara Christmas Holiday Offer',
    slug: 'maasai-mara-christmas-holiday-offer',
    subtitle: 'Private Safari - 3 Days at Jambo Mara Safari Lodge',
    description: 'Let\'s Explore! Private safari package to Maasai Mara during Christmas. Includes transport in Land Cruiser, professional guide, accommodation at Jambo Mara Safari Lodge, park fees, meals, game drives, and drinking water. Pricing varies by group size (2-6 pax). Contact us for a detailed quote.',
    duration: 3,
    maxGroupSize: 6,
    difficulty: 'Easy',
    locations: [
      { country: 'Kenya', city: 'Maasai Mara' },
    ],
    itinerary: generateItinerary(3, 'Maasai Mara', 'Game Drive'),
    inclusions: [
      'Transport in Land Cruiser',
      'Professional Guide',
      '2 Nights Accommodation at Jambo Mara Safari Lodge',
      'Park Fees',
      'Meals',
      'Game Drives',
      'Drinking Water',
    ],
    exclusions: [
      'Tips',
      'Personal expenses',
    ],
    price: {
      basePrice: 290, // Using lowest group price USD 770 for 6 pax
      serviceFee: 0,
      taxes: 0,
      total: 290,
      currency: 'USD',
    },
    images: [
      {
        url: 'https://cdn.pixabay.com/photo/2017/10/14/11/20/elephant-2850254_1280.jpg',
        alt: 'Maasai Mara Christmas Holiday Offer',
        aspectRatio: '16:9',
        credit: '',
      },
    ],
    highlights: [
      'Private safari',
      'Park fees included',
      'Land Cruiser transport',
      'Christmas special',
    ],
    bestSeasons: ['All Year Round'],
    rating: 4.8,
    reviewCount: 189,
    featured: true,
  },
  // Package 9: Amboseli National Park Christmas Holiday Offer
  {
    id: 'pkg-real-009',
    title: 'Amboseli National Park Christmas Holiday Offer',
    slug: 'amboseli-national-park-christmas-holiday',
    subtitle: 'Private Safari - 3 Days at Nyati Safari Camp',
    description: 'Let\'s Explore! Private safari to Amboseli National Park with stunning views of Mount Kilimanjaro. Includes transport in Land Cruiser, professional guide, accommodation at Nyati Safari Camp, park fees, meals, game drives, and drinking water. Pricing varies by group size (2-6 pax). Contact us for a detailed quote.',
    duration: 3,
    maxGroupSize: 6,
    difficulty: 'Easy',
    locations: [
      { country: 'Kenya', city: 'Amboseli' },
    ],
    itinerary: generateItinerary(3, 'Amboseli', 'Game Drive'),
    inclusions: [
      'Transport in Land Cruiser',
      'Professional Guide',
      '2 Nights Accommodation at Nyati Safari Camp',
      'Park Fees',
      'Meals',
      'Game Drives',
      'Drinking Water',
    ],
    exclusions: [
      'Tips',
      'Personal expenses',
    ],
    price: {
      basePrice: 276, // Using lowest group price USD 615 for 6 pax
      serviceFee: 0,
      taxes: 0,
      total: 276,
      currency: 'USD',
    },
    images: [
      {
        url: 'https://images.pexels.com/photos/30980273/pexels-photo-30980273.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        alt: 'Amboseli National Park Christmas Holiday Offer',
        aspectRatio: '16:9',
        credit: '',
      },
    ],
    highlights: [
      'Mount Kilimanjaro views',
      'Park fees included',
      'Private safari',
      'Elephant viewing',
    ],
    bestSeasons: ['All Year Round'],
    rating: 4.7,
    reviewCount: 167,
    featured: true,
  },
  // Package 10: Lake Nakuru & Naivasha Private Safari
  {
    id: 'pkg-real-010',
    title: 'Lake Nakuru & Naivasha Private Safari',
    slug: 'lake-nakuru-naivasha-private-safari',
    subtitle: '3 Days of Rift Valley Lakes Adventure',
    description: 'Explore the stunning Rift Valley lakes with a private safari to Lake Nakuru and Lake Naivasha. Includes accommodation at Lake Nakuru Lodge and Naivasha Kongoni Lodge, transport in 4x4 Landcruiser, all park entrance charges, all taxes, purified drinking water, professional guide, and game drives. Pricing varies by group size (2-6 pax). Contact us for a detailed quote.',
    duration: 3,
    maxGroupSize: 6,
    difficulty: 'Easy',
    locations: [
      { country: 'Kenya', city: 'Lake Nakuru' },
      { country: 'Kenya', city: 'Lake Naivasha' },
    ],
    itinerary: generateItinerary(3, 'Rift Valley Lakes', 'Game Drive'),
    inclusions: [
      '2 Nights Accommodation',
      'Transport in 4x4 Landcruiser',
      'All Park entrance charges',
      'All Taxes',
      'Purified Drinking water',
      'Professional guide',
      'Game Drives',
    ],
    exclusions: [
      'Tips',
      'Personal expenses',
    ],
    price: {
      basePrice: 424, // Using lowest group price USD 615 for 6 pax
      serviceFee: 0,
      taxes: 0,
      total: 424,
      currency: 'USD',
    },
    images: [
      {
        url: 'https://cdn.pixabay.com/photo/2017/04/21/12/05/hippo-2248550_1280.jpg',
        alt: 'Lake Nakuru & Naivasha Private Safari',
        aspectRatio: '16:9',
        credit: '',
      },
    ],
    highlights: [
      'Lake Nakuru flamingos',
      'Lake Naivasha hippos',
      'All park fees included',
      'Private safari',
    ],
    bestSeasons: ['All Year Round'],
    rating: 4.7,
    reviewCount: 134,
    featured: false,
  },
];
