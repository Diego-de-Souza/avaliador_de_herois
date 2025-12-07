import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { Observable, of } from "rxjs";
import { Router } from "@angular/router";
import { AuthService } from "../auth/auth.service";
import { ThemeService } from "../theme/theme.service";

@Injectable({
  providedIn: 'root',
})
export class QuizService {
    private readonly http = inject(HttpClient);
    private apiUrl = environment.apiURL;
    private router = inject(Router);
    private authService = inject(AuthService);
    private themeService = inject(ThemeService);

    public _currentQuestionIndex = 0;
    private _questions: any;
    public _nextLevel: boolean = false;
    private title: string = '';
    private message: string = '';
    public _themeAll: string = 'dark';

    getProgressQuiz(): Observable<any>  {
        const accessToken = sessionStorage.getItem('access_token')
        if (!accessToken) {
            this.router.navigate(['/login']);
            return of(null);
        }

        const teste = this.authService.getUser()

        return this.http.get<any>(`${this.apiUrl}/quiz/get-progress-quiz/${teste.sub}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    getQuestion(dataQuestion: any): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/quiz/find-question-quiz/${dataQuestion.id}`);
    }

    processQuestion(questions: any){
        const question = this.currentQuestion(questions)
        this._questions = questions;

        return {
            question,
            index: this._currentQuestionIndex,
            nextLevel: this._nextLevel
        }
    }

    async reprocessQuestion(){
        await this.nextQuestion();

        const question = this.currentQuestion(this._questions);
        
        return {
            question,
            index: this._currentQuestionIndex,
            nextLevel: this._nextLevel
        }
    }

    currentQuestion(questions: any) {
        return questions[this._currentQuestionIndex];
    }

    async nextQuestion() {
        if (this._currentQuestionIndex < this._questions.length - 1) {
            this._currentQuestionIndex++;
        } else {
            this.themeService.theme$.subscribe(theme => {
            this._themeAll = theme;
            });
            this.title = 'Fim do Quiz';
            this.message = 'Parabéns! Você completou o quiz.';
            // Exiba o modal de sucesso via variável de controle no componente pai
            this._currentQuestionIndex = 0;
            this._nextLevel = true;
        }
    }

    sendAnswer(data: any): Observable<any> {
        const accessToken = sessionStorage.getItem('access_token');
        if (!accessToken) {
            this.router.navigate(['/login']);
            return of(null);
        }

        const _dataUser = this.authService.getUser()
        data.user_id = _dataUser.sub;

        return this.http.post<any>(`${this.apiUrl}/quiz/answer-quiz`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    createQuiz(dataQuiz: any): Observable<any>{
        return this.http.post<any>(`${this.apiUrl}/quiz`, dataQuiz, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    createQuestions(dataQuestions: any): Observable<any>{
        return this.http.post<any>(`${this.apiUrl}/quiz/create-questions`, dataQuestions, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    getAllQuiz(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/quiz/find-All-quiz`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    getAllQuizLevelById(id: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/quiz/find-All-quiz-levels/${id}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    getAllQuizWithLevels(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/quiz/find-All-quiz-with-levels`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    getQuizWithLevelsById(id: number, levelId: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/quiz/find-quiz-with-levels/${id}/level/${levelId}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    getQuestionsByQuizLevel(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/quiz/${id}/questions`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    deleteAllQuiz(id:number, level_id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/quiz/${id}/level_id/${level_id}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    deleteQuizQuestion(quiz_level_id: number, question_number: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/quiz/${quiz_level_id}/questions/${question_number}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    deleteAllQuestions(quiz_id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/quiz/${quiz_id}/questions`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    updateQuiz(id: number, id_quiz_level:number , data: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/quiz/${id}/level/${id_quiz_level}`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    updateQuestions(data: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/quiz/update-questions`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
