import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root',
})
export class QuizService {
    private readonly http = inject(HttpClient);
    private apiUrl = environment.apiURL;
    private router = inject(Router);

    _currentQuestionIndex = 0;
    _questions: any;
    _nextLevel: boolean = false;

    getQuestion(dataQuestion: string): Observable<any>{
        const data = dataQuestion;
        return this.http.get<any>(`${this.apiUrl}/quiz/find-question-quiz`, {
          headers: {
            'Content-Type': 'application/json'
          },
          params: {
            question: data
          }
        })
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
            alert('Quiz finalizado!');
            this._currentQuestionIndex = 0;
            this._nextLevel = true;
        }
    }


}
