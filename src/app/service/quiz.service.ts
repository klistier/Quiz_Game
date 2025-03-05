import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  #http = inject(HttpClient);
  #url = 'https://opentdb.com/api.php?';

  getEasyQuestions(): Observable<any> {
    return this.#http.get<any>(`${this.#url}amount=4&difficulty=easy`);
  }

  getMediumQuestions(): Observable<any> {
    return this.#http.get<any>(`${this.#url}amount=4&difficulty=medium`);
  }

  getHardQuestions(): Observable<any> {
    return this.#http.get<any>(`${this.#url}amount=4&difficulty=hard`);
  }
}
