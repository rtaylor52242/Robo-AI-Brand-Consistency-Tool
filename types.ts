
export interface BusinessDNA {
  name: string;
  logoUrl: string;
  images: string[];
  colors: string[];
  tagline: string;
  tone: string;
  websiteUrl: string;
}

export interface CampaignIdea {
  headline: string;
  description: string;
}

export interface Creative {
  id: string;
  imageUrl: string;
  headline: string;
  sizePreset: 'Square' | 'Story' | 'Banner';
}
