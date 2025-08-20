import { QuizLevel } from "./quiz";

export const StudioQuiz = [
    {
        id: 1,
        name: 'Marvel', 
        logo: 'assets/img/homemAranha_cover.png', 
        color: '#FFF', 
        levels: [
            {questionlevel: QuizLevel[0]}, 
            {questionlevel: QuizLevel[1]},
            {questionlevel: QuizLevel[2]},
            {questionlevel: QuizLevel[3]}
        ]
    },
    {
        id: 2,
        name: 'DC Comics', 
        logo: 'assets/dc-logo.png', 
        color: '#0078F0', 
        levels: [
            {questionlevel: QuizLevel[0]}, 
            {questionlevel: QuizLevel[1]},
            {questionlevel: QuizLevel[2]},
            {questionlevel: QuizLevel[3]}
        ]
    },
    {
        id: 3,
        name: 'Dark Horse', 
        logo: 'assets/darkhorse-logo.png', 
        color: '#000000', 
        levels: [
            {questionlevel: QuizLevel[0]}, 
            {questionlevel: QuizLevel[1]},
            {questionlevel: QuizLevel[2]},
            {questionlevel: QuizLevel[3]}
        ]
    },
    {
        id: 4,
        name: 'Image Comics', 
        logo: 'assets/image-logo.png', 
        color: '#FFFFFF', 
        levels: [
            {questionlevel: QuizLevel[0]}, 
            {questionlevel: QuizLevel[1]},
            {questionlevel: QuizLevel[2]},
            {questionlevel: QuizLevel[3]}
        ]
    }
]