import { HeroLevel } from "./hero-level.interface";

 export interface Studio {
  id: number;
  name: string;
  logo: string;
  color: string;
  description?: string;
  levels: {
    questionlevel: HeroLevel 
  }[];
}