import { Routes } from "@angular/router";

export const routesWebMainQuiz: Routes = [
    {
        path: '',
        title: 'Quiz',
        loadComponent: () => import('./quiz.component').then(q => q.QuizComponent)
    },
    {
        path: 'first-alert',
        title: 'Alert Quiz',
        loadComponent: () => import('./first-alert-quiz/first-alert-quiz.component').then(q => q.FirstAlertQuizComponent)
    },
    {
        path: 'question',
        title: 'Questions Quiz',
        loadComponent: () => import('./question-quiz/question-quiz.component').then(q => q.QuestionQuizComponent)
    }
]