import { Difficulty } from "../enums/difficulty.enum";

export interface Quiz_Level{
  id: number;
  quiz_id: number;
  name: string;
  difficulty: Difficulty;
  unlocked: boolean;
  questions: number;
  xp_reward: number;
}