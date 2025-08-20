import { Difficulty } from "../core/enums/difficulty.enum";

export const QuizLevel = [
    {
        id: 1,
        name: 'Treino de Recruta',
        hero: {
        name: 'Homem-Aranha',
        image: '../img/cards_quiz/marvel-basic.jpg',
        quote: '"Com grandes poderes vêm grandes responsabilidades!"'
        },
        difficulty: Difficulty.RECRUIT, 
        unlocked: true,
        questions: 10,
        xpReward: 500
    },
    {
        id: 2,
        name: 'Treino de Recruta',
        hero: {
        name: 'Homem-Aranha',
        image: '../img/cards_quiz/marvel-basic.jpg',
        quote: '"Com grandes poderes vêm grandes responsabilidades!"'
        },
        difficulty: Difficulty.AVENGER,
        unlocked: true,
        questions: 10,
        xpReward: 500
    },
    {
        id: 3,
        name: 'Treino de Recruta',
        hero: {
        name: 'Homem-Aranha',
        image: '../img/cards_quiz/marvel-basic.jpg',
        quote: '"Com grandes poderes vêm grandes responsabilidades!"'
        },
        difficulty: Difficulty.LEGENDARY, 
        unlocked: true,
        questions: 10,
        xpReward: 500
    },
    {
        id: 4,
        name: 'Treino de Recruta',
        hero: {
        name: 'Homem-Aranha',
        image: '../img/cards_quiz/marvel-basic.jpg',
        quote: '"Com grandes poderes vêm grandes responsabilidades!"'
        },
        difficulty: Difficulty.COSMIC, 
        unlocked: false,
        questions: 10,
        xpReward: 500
    }
]