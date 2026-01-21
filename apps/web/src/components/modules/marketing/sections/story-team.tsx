import * as React from 'react';
import { Linkedin } from 'lucide-react';

// X (Twitter) icon component
function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/components/ui/avatar';

import { GridSection } from '@/components/modules/fragments/grid-section';

const DATA = [
  {
    name: 'Kevin Kasaei',
    role: 'Founder & CEO',
    image: 'https://cdn.searchfit.ai/assets/authors/kevin.jpeg',
    previousRole: '2X Founder, Formerly at Deloitte',
    education: 'AGSM MBA, Background in Tech and Product',
    linkedin: 'https://www.linkedin.com/in/kkasaei/',
    twitter: 'https://x.com/kasaei'
  },
  {
    name: 'Herman Asefi',
    role: 'Co-founder & CRO',
    image: 'https://cdn.searchfit.ai/assets/authors/houman.jpg',
    previousRole: 'Formerly at Cisco, Scaled businesses to multi-million dollar',
    education: '',
    linkedin: 'https://www.linkedin.com/company/searchfitai',
    twitter: 'https://x.com/houmanasefi'
  },
];

export function StoryTeam(): React.JSX.Element {
  return (
    <GridSection>
      <div className="container max-w-6xl py-20">
        <h2 className="mb-16 text-sm font-medium uppercase tracking-wider text-muted-foreground ">
          The visionaries
        </h2>
        <div className="flex flex-wrap gap-24">
          {DATA.map((person, index) => (
            <div
              key={index}
              className="space-y-8"
            >
              <Avatar className="size-24 border-4 border-neutral-200 dark:border-neutral-800">
                <AvatarImage
                  src={person.image}
                  alt={person.name}
                  className="object-cover"
                />
                <AvatarFallback className="text-xl">
                  {person.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">{person.name}</h3>
                  <p className="text-primary">{person.role}</p>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>{person.previousRole}</p>
                  {person.education && <p>{person.education}</p>}
                </div>
                {(person.linkedin || person.twitter) && (
                  <div className="flex items-center gap-3">
                    {person.linkedin && (
                      <a
                        href={person.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground transition-colors hover:text-primary"
                      >
                        <Linkedin className="size-5" />
                      </a>
                    )}
                    {person.twitter && (
                      <a
                        href={person.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground transition-colors hover:text-primary"
                      >
                        <XIcon className="size-5" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </GridSection>
  );
}
