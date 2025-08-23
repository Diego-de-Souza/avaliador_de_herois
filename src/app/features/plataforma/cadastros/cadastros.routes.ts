import { Routes } from "@angular/router";



export const routesCadastros: Routes = [
    {
        path: 'artigos',
        title: 'Cadastro de Artigos',
        loadComponent: () => import('./cadastro-artigos/cadastro-artigos.component').then(m => m.CadastroArtigosComponent)
    },
    {
        path: 'curiosidades',
        title: 'Cadastro de Curiosidades',
        loadComponent: () => import('./cadastro-curiosidades/cadastro-curiosidades.component').then(m => m.CadastroCuriosidadesComponent)
    },
    {
        path: 'heroi',
        title: 'Cadastro de Herói',
        loadComponent: () => import('./cadastro-dados/cadastro-dados.component').then(m => m.CadastroDadosComponent)
    },
    {
        path: 'heroi/:id',
        title: 'Atualizacao de Herói',
        loadComponent: () => import('./cadastro-dados/cadastro-dados.component').then(m => m.CadastroDadosComponent)
    },
    {
        path: 'studio',
        title: 'Cadastro de Studio',
        loadComponent: () => import('./cadastro-studio/cadastro-studio.component').then(m => m.CadastroStudioComponent)
    },
    {
        path: 'studio/:id',
        title: 'Atualizacao de Studio',
        loadComponent: () => import('./cadastro-studio/cadastro-studio.component').then(m => m.CadastroStudioComponent)
    },
    {
        path: 'team',
        title: 'Cadastro de Team',
        loadComponent: () => import('./cadastro-team/cadastro-team.component').then(m => m.CadastroTeamComponent)
    },
    {
        path: 'team/:id',
        title: 'Atualizacao de Team',
        loadComponent: () => import('./cadastro-team/cadastro-team.component').then(m => m.CadastroTeamComponent)
    },
    {
        path: 'quiz-cadastro',
        title: 'Cadastro de Quiz',
        loadComponent: () => import('./cadastro-quiz/cadastro-quiz.component').then(m => m.CadastroQuizComponent)
    },
    {
        path: 'quiz-cadastro/:id/:level_id',
        title: 'Atualizacao de Quiz',
        loadComponent: () => import('./cadastro-quiz/cadastro-quiz.component').then(m => m.CadastroQuizComponent)
    },
    {
        path: 'question-cadastro',
        title: 'Cadastro de Perguntas',
        loadComponent: () => import('./cadastro-quiz/questions/questions.component').then(m => m.QuestionsComponent)
    },
    {
        path: 'question-cadastro/:quiz_level_id',
        title: 'Atualizacao de Perguntas',
        loadComponent: () => import('./cadastro-quiz/questions/questions.component').then(m => m.QuestionsComponent)
    },
]