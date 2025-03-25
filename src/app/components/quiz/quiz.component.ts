import { Component, inject, OnInit } from '@angular/core';
import { QuizStore } from '../../store/quiz.store';
import { QuizQuestionComponentComponent } from "../quiz-question-component/quiz-question-component.component";

@Component({
  selector: 'app-quiz',
  imports: [QuizQuestionComponentComponent],
  templateUrl: './quiz.component.html',
})
export class QuizComponent implements OnInit {
  quizStore = inject(QuizStore);

  ngOnInit(): void {
    this.quizStore.getEasyQuestions();
    console.log(this.quizStore.questions());
  }

  
}
