import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IQuizResponse } from '../interface/IQuizResponse';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  #http = inject(HttpClient);
  #url = 'https://opentdb.com/api.php?';

  getEasyQuestions(): Observable<IQuizResponse> {
    return this.#http.get<IQuizResponse>(
      `${this.#url}amount=5&difficulty=easy`
    );
  }

  getMediumQuestions(): Observable<IQuizResponse> {
    return this.#http.get<IQuizResponse>(
      `${this.#url}amount=5&difficulty=medium`
    );
  }

  getHardQuestions(): Observable<IQuizResponse> {
    return this.#http.get<IQuizResponse>(
      `${this.#url}amount=5&difficulty=hard`
    );
  }
}
