import { VacationPackage, Testimonial, FAQ } from './types';

export const mockPackages: VacationPackage[] = [
  {
    id: 'pkg-zanzibar',
    title: 'Zanzibar Island Retreat',
    destination: 'Zanzibar',
    image: 'https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?q=80&w=2000&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=2000&auto=format&fit=crop'
    ],
    overview: 'Experience the pristine beaches and rich culture of Zanzibar.',
    highlights: ['Stone Town Tour', 'Spice Farm Visit', 'Safari Blue'],
    inclusions: ['Flight', '5-Star Hotel', 'Breakfast', 'Airport Transfer'],
    exclusions: ['Visa Fees', 'Personal Expenses'],
    price: '$1,200',
  },
  {
    id: 'pkg-dubai',
    title: 'Dubai Luxury Escape',
    destination: 'Dubai',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1000&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop',
      'https://upload.wikimedia.org/wikipedia/en/c/c7/Burj_Khalifa_2021.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/e/e6/Dubai_Marina_Skyline.jpg'
    ],
    overview: 'Discover the futuristic skyline and luxurious lifestyle of Dubai.',
    highlights: ['Burj Khalifa', 'Desert Safari', 'Dubai Mall'],
    inclusions: ['Flight', 'Luxury Hotel', 'Breakfast', 'Desert Safari'],
    exclusions: ['Tourism Dirham Fee'],
    price: '$1,500',
  },
  {
    id: 'pkg-egypt',
    title: 'Mysteries of Egypt',
    destination: 'Egypt',
    image: 'https://images.unsplash.com/photo-1539667468225-eebb663053e6?q=80&w=1000&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1539667468225-eebb663053e6?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=1000&auto=format&fit=crop',
      'https://upload.wikimedia.org/wikipedia/commons/e/e7/Great_Pyramid_of_Giza_-_Pyramid_of_Khufu.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/6/69/Pyramid_of_Khafre_and_Sphinx%2C_Giza%2C_Greater_Cairo%2C_Egypt.jpg'
    ],
    overview: 'Uncover the ancient secrets of the pharaohs and cruise the Nile.',
    highlights: ['Pyramids of Giza', 'Nile Cruise', 'Egyptian Museum'],
    inclusions: ['Flight', 'Premium Hotel', 'Guided Tours', 'Nile Cruise'],
    exclusions: ['Visa Fees', 'Optional excursions'],
    price: '$1,750',
  },
  {
    id: 'pkg-skorea',
    title: 'South Korea Cultural Tour',
    destination: 'South Korea',
    image: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=1000&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1538681105587-85640961bf8b?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1546874177-9e664107314e?q=80&w=1000&auto=format&fit=crop',
      'https://upload.wikimedia.org/wikipedia/en/a/a6/NamsanTower_%28Cropped%29.jpeg',
      'https://upload.wikimedia.org/wikipedia/commons/9/98/Seoul_Aerial_Shot_01.jpg'
    ],
    overview: 'Immerse yourself in the vibrant culture and history of South Korea.',
    highlights: ['Gyeongbokgung Palace', 'Bukchon Hanok Village', 'Myeongdong'],
    inclusions: ['Flight', '4-Star Hotel', 'Guided Tours'],
    exclusions: ['Meals not specified'],
    price: '$2,100',
  },
  {
    id: 'pkg-qatar',
    title: 'Discover Qatar',
    destination: 'Qatar',
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/16/Doha_Skyline_Nacht_night.jpg',
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/1/16/Doha_Skyline_Nacht_night.jpg',
      'https://upload.wikimedia.org/wikipedia/en/c/c7/Museum_of_Islamic_Art_in_Doha%2C_Qatar_%2832673171432%29.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/e/ed/DOha_corniche_view1.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/2/26/The_Pearl_Marina_in_Nov_2013.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/0/0a/Doha_skyline_in_the_morning_%2812544910974%29_%28cropped%29.jpg'
    ],
    overview: 'Explore the modern marvels and traditional souqs of Doha.',
    highlights: ['Souq Waqif', 'Museum of Islamic Art', 'The Pearl'],
    inclusions: ['Flight', 'Hotel', 'Transfers'],
    exclusions: ['Visa Fees'],
    price: '$1,800',
  },
  {
    id: 'pkg-china',
    title: 'Wonders of China',
    destination: 'China',
    image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=1000&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1543097692-fa13c6cd8595?q=80&w=1000&auto=format&fit=crop',
      'https://upload.wikimedia.org/wikipedia/commons/9/9d/Map_of_the_Great_Wall_of_China.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/2/23/The_Great_Wall_of_China_at_Jinshanling-edit.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/a/a3/Great_Green_Wall_of_China_Topography.jpg'
    ],
    overview: 'Journey through the ancient history and breathtaking landscapes of China.',
    highlights: ['Great Wall', 'Forbidden City', 'Terracotta Army'],
    inclusions: ['Flight', 'Hotel', 'Bullet Train', 'Guided Tours'],
    exclusions: ['Visa'],
    price: '$2,500',
  },
  {
    id: 'pkg-canton',
    title: 'China Canton Fair Business Trip',
    destination: 'Guangzhou, China',
    image: 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Pazhou_Station_Platform_1_202011.jpg',
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/6/6c/Pazhou_Station_Platform_1_202011.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/f/f6/Canton_Trade_Fair_%28tarotastic%29.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/2/24/Canton_Tower_20241027.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/a/af/MWC_2019_%2846487932494%29.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/7/7e/Aerial_View%2C_Zone_B%2C_Canton_Fair_Complex_20230701-C.jpg'
    ],
    overview: 'All-inclusive travel package for the China Import and Export Fair.',
    highlights: ['Canton Fair Access', 'Business Networking', 'Factory Tours'],
    inclusions: ['Flight', 'Hotel near Fair', 'Interpreter', 'Transfers'],
    exclusions: ['Personal purchases'],
    price: '$2,800',
  }
];

export const mockTestimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Sarah Johnson',
    text: 'OG Travels made our honeymoon to Zanzibar absolutely perfect. Every detail was taken care of.',
    rating: 5,
  },
  {
    id: 't2',
    name: 'Michael Chen',
    text: 'The Canton Fair package was a game-changer for my business. Very professional service.',
    rating: 5,
  },
  {
    id: 't3',
    name: 'Amina Bello',
    text: 'Their visa assistance for my study abroad in the UK was incredibly helpful and stress-free.',
    rating: 5,
  }
];

export const mockFAQs: FAQ[] = [
  {
    id: 'f1',
    question: 'How do I book a flight with OG Travels?',
    answer: 'You can book a flight by visiting our Flight Booking page, filling out the inquiry form, or contacting us directly via phone or WhatsApp.'
  },
  {
    id: 'f2',
    question: 'Do you guarantee visa approvals?',
    answer: 'While we provide expert guidance and ensure your application is perfect, visa decisions are ultimately made by the respective embassies.'
  },
  {
    id: 'f3',
    question: 'Can I customize my vacation package?',
    answer: 'Absolutely! Our vacation packages can be fully customized to meet your specific preferences, schedule, and budget.'
  }
];
