import {
  Award,
  BadgeCheck,
  Briefcase,
  CalendarHeart,
  Clock,
  CreditCard,
  Crown,
  Gem,
  Globe,
  Handshake,
  Heart,
  Leaf,
  Map,
  Plane,
  Route,
  ShieldCheck,
  Star,
  Timer,
  Users,
} from 'lucide-react'
import type { VehicleKey } from '../types'

export const BRAND = {
  name: 'Secure Transportation Service',
  shortName: 'Secure Transportation',
  tagline: 'Luxury & Reliable Transportation Across Miami, FL',
  city: 'Miami, FL',
  phone: '+1 (305) 555-0182',
  phoneHref: 'tel:+13055550182',
  email: 'reservations@securetransportation.com',
  address: '1248 NW 7th Ave, Miami, FL 33127',
  hours: 'Available 24/7',
  usdot: 'USDOT 4123456',
  license: 'Florida TNC · FL-TN 88912',
  insurance: '$2M fully insured fleet',
  googleRating: '4.9',
}

export const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Fleet', to: '/fleet' },
  { label: 'Chauffeurs', to: '/chauffeurs' },
  { label: 'Services', to: '/services' },
]

export const HERO = {
  title: 'Luxury & Reliable Transportation Across Miami, FL',
  subtitle:
    'Book your ride in minutes — airport transfers, corporate travel and special events with professional chauffeurs and a modern fleet.',
}

export const QUICK_BOOK = {
  title: 'Book in minutes',
  button: 'Get a Quote',
  note: 'No payment required. Our team confirms availability by email.',
}

const u = (id: string, w = 1600, q = 80) =>
  `https://images.unsplash.com/${id}?w=${w}&q=${q}`

export const IMAGES = {
  hero: u('photo-1549317661-bd32c8ce0db2', 2000),
  heroCar: u('photo-1503376780353-7e6692767b70', 2000),
  miami: u('photo-1514214246283-d427a95c5d2f', 1600),
  aboutTeam: u('photo-1521737711867-e3b97375f902', 1600),
  aboutBuilding: u('photo-1486406146926-c627a92ad1ab', 1600),
  garage: u('photo-1494976388531-d1058494cdd8', 1600),
  airport: u('photo-1445019980597-93fa8acb246c', 1600),
  hourly: u('photo-1502134249126-9f3755a50d78', 1600),
  corporate: u('photo-1531482615713-2afd69097998', 1600),
  event: u('photo-1465495976277-4387d4b0b4c6', 1600),
  longDistance: u('photo-1449034446853-66c86144b0ad', 1600),
  tours: u('photo-1502602898657-3e91760cbb34', 1600),
}

export const TRUST_BADGES = [
  { icon: Star, title: `${BRAND.googleRating} Google Rating`, text: 'Rated by hundreds of riders' },
  { icon: ShieldCheck, title: 'USDOT Registered', text: BRAND.usdot },
  { icon: BadgeCheck, title: 'Fully Insured', text: BRAND.insurance },
  { icon: Award, title: 'BBB A+ Accredited', text: 'Better Business Bureau member' },
  { icon: Clock, title: 'Available 24/7', text: 'Reservations & support any time' },
]

export const FEATURED_SERVICES = [
  {
    id: 'airport',
    icon: Plane,
    title: 'Airport Transfers',
    text: 'Flight tracking, meet & greet and on-time pickups at MIA, FLL and PBI.',
  },
  {
    id: 'corporate',
    icon: Briefcase,
    title: 'Corporate Travel',
    text: 'Direct billing, corporate accounts and discreet, professional service.',
  },
  {
    id: 'hourly',
    icon: Clock,
    title: 'Hourly / As Directed',
    text: 'A chauffeur at your disposal by the hour for meetings, shopping or touring.',
  },
  {
    id: 'events',
    icon: CalendarHeart,
    title: 'Special Events',
    text: 'Weddings, proms, graduations and group celebrations, handled elegantly.',
  },
]

export const USPS = [
  { icon: Gem, title: 'Modern Luxury Fleet', text: 'Newer-model sedans, SUVs and vans, spotless inside and out.' },
  { icon: Users, title: 'Professional Chauffeurs', text: 'Background-checked, uniformed and trained in courteous service.' },
  { icon: CreditCard, title: 'Fixed, Transparent Pricing', text: 'The quote you see is the price you pay. No surprises, ever.' },
  { icon: Clock, title: '24/7 Support', text: 'Real people answer the phone, day or night.' },
  { icon: Globe, title: 'Easy Online Booking', text: 'Reserve in minutes from any device and get email confirmation.' },
  { icon: ShieldCheck, title: 'Safety First', text: 'Insured fleet, vetted drivers and rigorous maintenance.' },
]

export interface FleetItem {
  id: string
  name: string
  category: 'Sedan' | 'SUV' | 'Van' | 'Minibus' | 'Bus' | 'Executive'
  image: string
  passengers: number
  luggage: number
  amenities: string[]
  specs: Array<{ label: string; value: string }>
  description: string
  quote?: { text: string; author: string }
  bookable: boolean
  vehicle: VehicleKey
  price?: number
}

export const FLEET: FleetItem[] = [
  {
    id: 'luxury-sedan',
    name: 'Luxury Sedan — Mercedes-Benz E-Class',
    category: 'Sedan',
    image: u('photo-1555215695-3004980ad54e', 1200),
    passengers: 4,
    luggage: 3,
    amenities: ['Leather seating', 'Complimentary water', 'USB charging', 'Dual-zone climate'],
    specs: [
      { label: 'Seats', value: '4 passengers' },
      { label: 'Suitcases', value: '3 full-size' },
      { label: 'Transmission', value: 'Automatic' },
      { label: 'Accessibility', value: 'Easy entry' },
    ],
    description:
      'Our signature executive sedan for business travel, airport pickups and a polished first impression anywhere in Miami.',
    bookable: true,
    vehicle: 'sedan' as const,
    price: 50,
  },
  {
    id: 'executive-sedan',
    name: 'Executive Sedan — Lincoln Continental',
    category: 'Executive',
    image: u('photo-1502161254066-6c74afbf07aa', 1200),
    passengers: 4,
    luggage: 3,
    amenities: ['Premium leather', 'Bottled water', 'Wi-Fi hotspot', 'Privacy divider'],
    specs: [
      { label: 'Seats', value: '4 passengers' },
      { label: 'Suitcases', value: '3 full-size' },
      { label: 'Amenities', value: 'Wi-Fi, water' },
      { label: 'Style', value: 'Black-tie events' },
    ],
    description:
      'A timeless American luxury icon, perfect for red-carpet arrivals, weddings and VIP corporate guests.',
    quote: {
      text: 'Our VIP board members ride with Secure on every Miami visit. Flawless every time.',
      author: 'Director of Travel, Fortress Holdings',
    },
    bookable: false,
    vehicle: 'sedan' as const,
  },
  {
    id: 'executive-suv',
    name: 'Executive SUV — Cadillac Escalade',
    category: 'SUV',
    image: u('photo-1533473359331-0135ef1b58bf', 1200),
    passengers: 6,
    luggage: 5,
    amenities: ['Spacious 3rd row', 'Leather captains chairs', 'USB-C charging', 'Climate control'],
    specs: [
      { label: 'Seats', value: '6 passengers' },
      { label: 'Suitcases', value: '5 full-size' },
      { label: 'Fuel', value: 'Premium gas' },
      { label: 'A/C', value: 'Tri-zone climate' },
    ],
    description:
      'Commanding presence with room to spare — ideal for families, executive groups and long-distance comfort.',
    bookable: true,
    vehicle: 'suv' as const,
    price: 75,
  },
  {
    id: 'premium-van',
    name: 'Premium Van — Mercedes-Benz Sprinter',
    category: 'Van',
    image: u('photo-1625246333195-78d9c38ad449', 1200),
    passengers: 12,
    luggage: 12,
    amenities: ['High roof', 'Lounge seating', 'Wi-Fi', 'Overhead lighting'],
    specs: [
      { label: 'Seats', value: '12 passengers' },
      { label: 'Suitcases', value: '12 carry-ons' },
      { label: 'Height', value: 'Stand-up cabin' },
      { label: 'Accessibility', value: 'Low step-in' },
    ],
    description:
      'Stand-up comfort for groups, event parties and airport transfers that keep everyone together.',
    bookable: true,
    vehicle: 'van' as const,
    price: 110,
  },
  {
    id: 'minibus',
    name: 'Mini Bus — 15-Passenger',
    category: 'Minibus',
    image: u('photo-1544620347-c4fd4a3d5957', 1200),
    passengers: 15,
    luggage: 15,
    amenities: ['Reclining seats', 'A/C', 'Overhead bins', 'PA system'],
    specs: [
      { label: 'Seats', value: '15 passengers' },
      { label: 'Suitcases', value: '15 carry-ons' },
      { label: 'Amenities', value: 'A/C, PA' },
      { label: 'Ideal for', value: 'Sport teams, tours' },
    ],
    description:
      'The smart middle ground for sports teams, school groups and sightseeing parties of up to 15.',
    bookable: false,
    vehicle: 'van' as const,
  },
  {
    id: 'coach-bus',
    name: 'Coach Bus — 30-Passenger Motorcoach',
    category: 'Bus',
    image: u('photo-1531482615713-2afd69097998', 1200),
    passengers: 30,
    luggage: 30,
    amenities: ['Reclining seats', 'Restroom option', 'Wi-Fi', 'Onboard A/C'],
    specs: [
      { label: 'Seats', value: '30 passengers' },
      { label: 'Suitcases', value: '30 full-size' },
      { label: 'Amenities', value: 'Wi-Fi, A/C' },
      { label: 'Ideal for', value: 'Conventions, festivals' },
    ],
    description:
      'Full-size motorcoach comfort for conferences, festivals, church outings and city-to-city trips.',
    bookable: true,
    vehicle: 'bus' as const,
    price: 220,
  },
]

export interface ServiceItem {
  id: string
  icon: typeof Plane
  title: string
  tagline: string
  description: string
  howItWorks: string[]
  coverage?: string
  image: string
  suggestedVehicle: VehicleKey
}

export const SERVICES: ServiceItem[] = [
  {
    id: 'airport',
    icon: Plane,
    title: 'Airport Transfers',
    tagline: 'On-time, every time — we watch your flight.',
    description:
      'Reliable pickups and drop-offs at Miami International (MIA), Fort Lauderdale (FLL) and Palm Beach (PBI) airports.',
    howItWorks: [
      'We track your flight in real time and adjust pickup time to actual arrival.',
      'Your chauffeur waits with a name sign in the arrivals hall (meet & greet).',
      'One hour of wait time is included after touchdown for domestic flights.',
      'Your ride to the curb is confirmed by email and text.',
    ],
    coverage: 'MIA · FLL · PBI and all Miami-area airports.',
    image: IMAGES.airport,
    suggestedVehicle: 'sedan',
  },
  {
    id: 'hourly',
    icon: Clock,
    title: 'Hourly / As-Directed Service',
    tagline: 'Your chauffeur, your schedule.',
    description:
      'A professional driver at your disposal by the hour for business meetings, errands, shopping or a night out.',
    howItWorks: [
      'Rates are per hour with a three-hour minimum.',
      'Multiple stops are welcome — the vehicle waits for you.',
      'No hidden mileage charges within Miami-Dade County.',
      'Extend your time on the go with one quick call.',
    ],
    image: IMAGES.hourly,
    suggestedVehicle: 'sedan',
  },
  {
    id: 'corporate',
    icon: Briefcase,
    title: 'Corporate Travel',
    tagline: 'Discreet, consistent service for business.',
    description:
      'Reliable ground transportation for executives, teams and clients, with invoicing that fits your finance team.',
    howItWorks: [
      'Corporate accounts with direct billing and monthly statements.',
      'Uniformed chauffeurs trained in confidentiality and etiquette.',
      'Fixed rates by route or by hour for easy budgeting.',
      'Dedicated account manager for recurring reservations.',
    ],
    coverage: 'On-site for Miami’s largest business districts and hotels.',
    image: IMAGES.corporate,
    suggestedVehicle: 'sedan',
  },
  {
    id: 'events',
    icon: CalendarHeart,
    title: 'Event Transportation',
    tagline: 'Weddings, proms, graduations and celebrations.',
    description:
      'Elegant arrival and group logistics for the moments that matter most.',
    howItWorks: [
      'Decorations, signage and red-carpet service available on request.',
      'Coordinated multi-vehicle arrivals so everyone is on time.',
      'Champagne / drink service options for adult celebrations.',
      'Day-of event coordinator on call throughout your event.',
    ],
    coverage: 'Venues across Miami, the Keys and Palm Beach.',
    image: IMAGES.event,
    suggestedVehicle: 'van',
  },
  {
    id: 'long-distance',
    icon: Route,
    title: 'Long Distance & Interstate',
    tagline: 'City to city, comfortably and safely.',
    description:
      'Intercity transfers to Orlando, Tampa, Naples, Key West and beyond in comfort and style.',
    howItWorks: [
      'Flat-rate quotes for common routes — no meter surprises.',
      'Stretch breaks and stops scheduled to your preference.',
      'Fresh water and Wi-Fi onboard for the whole trip.',
      'Two-driver rotation automatically arranged for very long hauls.',
    ],
    coverage: 'Throughout Florida and beyond on request.',
    image: IMAGES.longDistance,
    suggestedVehicle: 'suv',
  },
  {
    id: 'tours',
    icon: Map,
    title: 'Tours & Sightseeing',
    tagline: 'See Miami like a local, without the driving.',
    description:
      'Private, customizable tours of Miami Beach, Wynwood, Little Havana, the Keys and more.',
    howItWorks: [
      'Build your own itinerary or choose one of our curated tours.',
      'Bilingual chauffeur-guides share local stories and recommendations.',
      'Flexible timing — stop for photos, food or shopping.',
      'Perfect for small groups, couples and families.',
    ],
    coverage: 'Miami, Miami Beach, Coral Gables, Wynwood, Key Biscayne.',
    image: IMAGES.tours,
    suggestedVehicle: 'van',
  },
]

export const SERVICE_SUGGESTION: Record<string, VehicleKey> = {
  airport: 'sedan',
  hourly: 'sedan',
  corporate: 'sedan',
  events: 'van',
  'long-distance': 'suv',
  tours: 'van',
}

export const CHAUFFEURS = [
  {
    name: 'Alejandro Reyes',
    photo: u('photo-1507003211169-0a1dd7228f2d', 600),
    years: 12,
    languages: ['English', 'Spanish'],
    licenses: ['CDL Class A', 'Florida TNC'],
    specialty: 'Executive sedans & corporate clients',
    quote: 'Tu safety and comfort are my priority — you arrive calm, you arrive on time.',
    rating: 5.0,
  },
  {
    name: 'James Carter',
    photo: u('photo-1472099645785-5658abf4ff4e', 600),
    years: 9,
    languages: ['English'],
    licenses: ['CDL Class B', 'Florida TNC'],
    specialty: 'Airport transfers & VIP arrivals',
    quote: 'I track every flight and greet every client with a sign and a smile.',
    rating: 4.9,
  },
  {
    name: 'Maria Delgado',
    photo: u('photo-1494790108377-be9c29b29330', 600),
    years: 8,
    languages: ['English', 'Spanish', 'Portuguese'],
    licenses: ['Florida TNC', 'Defensive Driving Certified'],
    specialty: 'Tours & bilingual guided sightseeing',
    quote: 'Every ride is a chance to show Miami at its best — with a story to tell.',
    rating: 4.9,
  },
  {
    name: 'David Okafor',
    photo: u('photo-1500648767791-00dcc994a43e', 600),
    years: 11,
    languages: ['English', 'French'],
    licenses: ['CDL Class A', 'Florida TNC'],
    specialty: 'Group events & motorcoach operations',
    quote: 'For groups, timing is everything. I keep every party on schedule.',
    rating: 5.0,
  },
]

export const CHAUFFEUR_VALUES = [
  { icon: ShieldCheck, title: 'Background Checks', text: 'Every chauffeur passes a nationwide background and driving-record review.' },
  { icon: Timer, title: 'Defensive Driving Tests', text: 'Certified road exams and ongoing safety training throughout the year.' },
  { icon: Handshake, title: 'Service Training', text: 'Hospitality and etiquette training so every ride feels first-class.' },
]

export const TESTIMONIALS = [
  {
    text: 'The chauffeur tracked my delayed flight and was still waiting with a sign when I landed. Impeccable.',
    name: 'Sandra Mitchell',
    location: 'Business traveler · MIA',
    rating: 5,
  },
  {
    text: 'They handled our entire wedding party — three vans, on time, beautifully dressed. Guests are still talking about it.',
    name: 'Elena & Marcus Reed',
    location: 'Wedding clients · Coral Gables',
    rating: 5,
  },
  {
    text: 'Our company books Secure for every executive visit. Fixed pricing and zero surprises on the invoice.',
    name: 'Robert Chen',
    location: 'Travel Manager, Fortress Holdings',
    rating: 5,
  },
  {
    text: 'Booked online in two minutes, confirmed by email, and the driver arrived ten minutes early. Easy as it gets.',
    name: 'Amanda Foster',
    location: 'Private client · Miami Beach',
    rating: 5,
  },
  {
    text: 'The airport transfer with Maria was the highlight — great stories, cold water, total comfort.',
    name: 'Thomas Garcia',
    location: 'Tour client · Wynwood',
    rating: 4,
  },
]

export const TIMELINE = [
  {
    year: '2015',
    title: 'Founded in Miami',
    text: 'Secure Transportation Service opens with a single executive sedan and a promise: punctuality above all.',
  },
  {
    year: '2018',
    title: 'Fleet Expansion',
    text: 'We grow to a mixed fleet of sedans, SUVs and vans, adding luxury SUV and group vehicles.',
  },
  {
    year: '2021',
    title: 'Corporate Division',
    text: 'Launch of the corporate accounts program with direct billing for hotels and businesses across South Florida.',
  },
  {
    year: '2024',
    title: '24/7 & 50+ Vehicles',
    text: 'Around-the-clock availability, a fleet of over 50 vehicles and a 4.9-star Google rating.',
  },
]

export const MISSION =
  'To deliver safe, punctual and genuinely warm transportation that makes every rider feel like our only client.'

export const VISION =
  'To be the most trusted chauffeured transportation company in Florida — measured by the minutes we save our clients and the smiles we earn.'

export const VALUES = [
  { icon: Clock, title: 'Punctuality', text: 'We arrive early so you never wait.' },
  { icon: ShieldCheck, title: 'Safety', text: 'Every ride protected by insurance, training and care.' },
  { icon: Heart, title: 'Personal Touch', text: 'Names, preferences and details — remembered.' },
  { icon: Leaf, title: 'Responsibility', text: 'Cleaner, newer vehicles and considerate driving.' },
]

export const CERTIFICATIONS = [
  { icon: ShieldCheck, title: 'USDOT Registered', text: BRAND.usdot },
  { icon: BadgeCheck, title: 'Licensed & Insured', text: `${BRAND.license} · ${BRAND.insurance}` },
  { icon: Award, title: 'BBB A+ Accredited', text: 'Member of the Better Business Bureau since 2016' },
  { icon: Crown, title: 'Industry Memberships', text: 'National Limousine Association & Florida Limousine Association' },
]

export const LEADERSHIP = {
  quote:
    'We started with one car and one rule: the client’s time is sacred. Fifteen years later, the rule hasn’t changed.',
  name: 'Roberto Fernández',
  role: 'Founder & General Manager',
}

export const LEGAL_UPDATED = 'Last updated: January 2026'
