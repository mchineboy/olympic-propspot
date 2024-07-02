import { Timestamp } from 'firebase/firestore';

export interface PropAttribute {
  name: string;
  value: string;
}

export interface Prop {
  id: string;
  assetTag: string;
  name: string;
  category: string;
  imageUrl: string;
  lastUsed: Timestamp;
  location?: string;
  
  // Specific fields for common attributes
  color?: string;
  size?: string;
  material?: string;
  
  // For clothing
  type?: string; // e.g., "blouse", "pants", "hat"
  
  // For wigs
  hairColor?: string;
  hairLength?: string;
  hairStyle?: string;

  // Dynamic attributes for additional searchable properties
  attributes: PropAttribute[];

  // Keep a general description field for any additional notes
  notes?: string;
  timestamp: Timestamp;
}