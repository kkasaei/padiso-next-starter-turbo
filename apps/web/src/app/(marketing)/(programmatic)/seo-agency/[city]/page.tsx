import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ComingSoon } from '@/components/marketing/ComingSoon';

const cities: Record<string, { name: string; country: string }> = {
  // USA
  'new-york': { name: 'New York', country: 'USA' },
  'los-angeles': { name: 'Los Angeles', country: 'USA' },
  'chicago': { name: 'Chicago', country: 'USA' },
  'houston': { name: 'Houston', country: 'USA' },
  'phoenix': { name: 'Phoenix', country: 'USA' },
  'philadelphia': { name: 'Philadelphia', country: 'USA' },
  'san-antonio': { name: 'San Antonio', country: 'USA' },
  'san-diego': { name: 'San Diego', country: 'USA' },
  'dallas': { name: 'Dallas', country: 'USA' },
  'san-jose': { name: 'San Jose', country: 'USA' },
  'austin': { name: 'Austin', country: 'USA' },
  'san-francisco': { name: 'San Francisco', country: 'USA' },
  'seattle': { name: 'Seattle', country: 'USA' },
  'denver': { name: 'Denver', country: 'USA' },
  'boston': { name: 'Boston', country: 'USA' },
  'miami': { name: 'Miami', country: 'USA' },
  'atlanta': { name: 'Atlanta', country: 'USA' },
  'portland': { name: 'Portland', country: 'USA' },
  'las-vegas': { name: 'Las Vegas', country: 'USA' },
  'detroit': { name: 'Detroit', country: 'USA' },
  // UK
  'london': { name: 'London', country: 'UK' },
  'manchester': { name: 'Manchester', country: 'UK' },
  'birmingham': { name: 'Birmingham', country: 'UK' },
  'leeds': { name: 'Leeds', country: 'UK' },
  'glasgow': { name: 'Glasgow', country: 'UK' },
  'liverpool': { name: 'Liverpool', country: 'UK' },
  'edinburgh': { name: 'Edinburgh', country: 'UK' },
  'bristol': { name: 'Bristol', country: 'UK' },
  // Europe
  'berlin': { name: 'Berlin', country: 'Germany' },
  'munich': { name: 'Munich', country: 'Germany' },
  'paris': { name: 'Paris', country: 'France' },
  'amsterdam': { name: 'Amsterdam', country: 'Netherlands' },
  'barcelona': { name: 'Barcelona', country: 'Spain' },
  'madrid': { name: 'Madrid', country: 'Spain' },
  'rome': { name: 'Rome', country: 'Italy' },
  'milan': { name: 'Milan', country: 'Italy' },
  'dublin': { name: 'Dublin', country: 'Ireland' },
  'stockholm': { name: 'Stockholm', country: 'Sweden' },
  // Australia
  'sydney': { name: 'Sydney', country: 'Australia' },
  'melbourne': { name: 'Melbourne', country: 'Australia' },
  'brisbane': { name: 'Brisbane', country: 'Australia' },
  'perth': { name: 'Perth', country: 'Australia' },
  'adelaide': { name: 'Adelaide', country: 'Australia' },
  'gold-coast': { name: 'Gold Coast', country: 'Australia' },
  'newcastle': { name: 'Newcastle', country: 'Australia' },
  'canberra': { name: 'Canberra', country: 'Australia' },
  'wollongong': { name: 'Wollongong', country: 'Australia' },
  'hobart': { name: 'Hobart', country: 'Australia' },
  'geelong': { name: 'Geelong', country: 'Australia' },
  'townsville': { name: 'Townsville', country: 'Australia' },
  'cairns': { name: 'Cairns', country: 'Australia' },
  'darwin': { name: 'Darwin', country: 'Australia' },
  'toowoomba': { name: 'Toowoomba', country: 'Australia' },
  'ballarat': { name: 'Ballarat', country: 'Australia' },
  'bendigo': { name: 'Bendigo', country: 'Australia' },
  'launceston': { name: 'Launceston', country: 'Australia' },
  'sunshine-coast': { name: 'Sunshine Coast', country: 'Australia' },
  'central-coast': { name: 'Central Coast', country: 'Australia' },
  'mackay': { name: 'Mackay', country: 'Australia' },
  'rockhampton': { name: 'Rockhampton', country: 'Australia' },
  'bunbury': { name: 'Bunbury', country: 'Australia' },
  'bundaberg': { name: 'Bundaberg', country: 'Australia' },
  'hervey-bay': { name: 'Hervey Bay', country: 'Australia' },
  'wagga-wagga': { name: 'Wagga Wagga', country: 'Australia' },
  'albury': { name: 'Albury', country: 'Australia' },
  'mildura': { name: 'Mildura', country: 'Australia' },
  'shepparton': { name: 'Shepparton', country: 'Australia' },
  'tamworth': { name: 'Tamworth', country: 'Australia' },
  'port-macquarie': { name: 'Port Macquarie', country: 'Australia' },
  'orange': { name: 'Orange', country: 'Australia' },
  'dubbo': { name: 'Dubbo', country: 'Australia' },
  'geraldton': { name: 'Geraldton', country: 'Australia' },
  'kalgoorlie': { name: 'Kalgoorlie', country: 'Australia' },
  'alice-springs': { name: 'Alice Springs', country: 'Australia' },
  // Canada
  'toronto': { name: 'Toronto', country: 'Canada' },
  'vancouver': { name: 'Vancouver', country: 'Canada' },
  'montreal': { name: 'Montreal', country: 'Canada' },
  // Asia
  'singapore': { name: 'Singapore', country: 'Singapore' },
  'hong-kong': { name: 'Hong Kong', country: 'China' },
  'tokyo': { name: 'Tokyo', country: 'Japan' },
  'dubai': { name: 'Dubai', country: 'UAE' },
};

interface PageProps {
  params: Promise<{ city: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city } = await params;
  const data = cities[city];

  if (!data) {
    return { title: 'City Not Found | SearchFIT' };
  }

  return {
    title: `SEO Agency ${data.name} | SearchFIT`,
    description: `Looking for an SEO agency in ${data.name}, ${data.country}? SearchFIT provides AI-powered SEO tools and visibility tracking.`,
  };
}

export function generateStaticParams() {
  return Object.keys(cities).map((city) => ({ city }));
}

export default async function CityPage({ params }: PageProps) {
  const { city } = await params;
  const data = cities[city];

  if (!data) {
    notFound();
  }

  return (
    <ComingSoon
      title={`SEO Agency ${data.name}`}
      description={`AI-powered SEO tools for businesses in ${data.name}, ${data.country}.`}
    />
  );
}
