import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { QuizStore } from '../../store/quiz.store';
import { QuizQuestionComponentComponent } from '../quiz-question-component/quiz-question-component.component';
import { QuizScoreboardComponentComponent } from '../quiz-scoreboard-component/quiz-scoreboard-component.component';

@Component({
  selector: 'app-quiz',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [QuizQuestionComponentComponent, QuizScoreboardComponentComponent],
  templateUrl: '././quiz.component.html',
})
export class QuizComponent implements OnInit {
  quizStore = inject(QuizStore);

  ngOnInit(): void {
    this.quizStore.getEasyQuestions();
    this.quizStore.getMediumQuestions();
    this.quizStore.getHardQuestions();
    this.quizStore.setCurrentQuestion();
  }
}
