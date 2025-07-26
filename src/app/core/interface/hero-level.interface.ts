import { Difficulty } from "../enums/difficulty.enum";
import { Hero } from "./hero.interface";

export interface HeroLevel {
  id: number;
  name: string;
  hero: Hero;
  difficulty: Difficulty;
  unlocked: boolean;
  questions: number;
  xpReward: number;
  universe?: string;
}