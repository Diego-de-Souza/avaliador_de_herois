export interface MemoryCard {
  id: number;
  uuid: string;
  url: string;
  provider?: string;
  flipped: boolean;
  matched: boolean;
}