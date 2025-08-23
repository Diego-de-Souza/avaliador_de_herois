import { Quiz_Level } from "./hero-level.interface";

export interface Quiz {
  id: number;
  name: string;
  logo: { url: string }; 
  theme: string;
  quiz_levels: Quiz_Level[];
}