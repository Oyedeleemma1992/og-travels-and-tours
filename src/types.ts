export interface VacationPackage {
  id: string;
  title: string;
  destination: string;
  image: string;
  images?: string[];
  overview: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  price: string;
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}
