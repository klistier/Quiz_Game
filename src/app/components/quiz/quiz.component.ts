import { Component, inject, OnInit } from '@angular/core';
import { QuizStore } from '../../store/quiz.store';

@Component({
  selector: 'app-quiz',
  imports: [],
  templateUrl: './quiz.component.html',
})
export class QuizComponent implements OnInit {
  quizStore = inject(QuizStore);

  ngOnInit(): void {
    this.quizStore.getEasyQuestions();
    console.log(this.quizStore.questions());
  }

  
}
