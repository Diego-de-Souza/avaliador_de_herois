import { Difficulty } from "../core/enums/difficulty.enum";

export const QuizLevel = [
    {
        id: 1,
        name: 'Treino de Recruta',
        hero: {
        name: 'Homem-Aranha',
        image: 'assets/heroes/spiderman.png',
        quote: '"Com grandes poderes vêm grandes responsabilidades!"'
        },
        difficulty: Difficulty.RECRUIT, // Use o enum aqui
        unlocked: true,
        questions: 10,
        xpReward: 500
    },
    {
        id: 2,
        name: 'Treino de Recruta',
        hero: {
        name: 'Homem-Aranha',
        image: 'assets/heroes/spiderman.png',
        quote: '"Com grandes poderes vêm grandes responsabilidades!"'
        },
        difficulty: Difficulty.AVENGER, // Use o enum aqui
        unlocked: true,
        questions: 10,
        xpReward: 500
    },
    {
        id: 3,
        name: 'Treino de Recruta',
        hero: {
        name: 'Homem-Aranha',
        image: 'assets/heroes/spiderman.png',
        quote: '"Com grandes poderes vêm grandes responsabilidades!"'
        },
        difficulty: Difficulty.LEGENDARY, // Use o enum aqui
        unlocked: true,
        questions: 10,
        xpReward: 500
    },
    {
        id: 4,
        name: 'Treino de Recruta',
        hero: {
        name: 'Homem-Aranha',
        image: 'assets/heroes/spiderman.png',
        quote: '"Com grandes poderes vêm grandes responsabilidades!"'
        },
        difficulty: Difficulty.COSMIC, // Use o enum aqui
        unlocked: true,
        questions: 10,
        xpReward: 500
    }
]