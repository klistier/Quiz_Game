import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { QuizStore } from '../../store/quiz.store';

@Component({
  selector: 'app-quiz-scoreboard-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './quiz-scoreboard-component.component.html',
})
export class QuizScoreboardComponentComponent {
  quizStore = inject(QuizStore);

  levels = signal<number[]>(
    Array.from({ length: 15 }, (_, i) => i + 1).reverse()
  );

  prizes = signal(
    [
      '100',
      '200',
      '300',
      '500',
      '1000',
      '2000',
      '4000',
      '8000',
      '16 000',
      '32 000',
      '64 000',
      '125 000',
      '250 000',
      '500 000',
      '1 000 0000',
    ].reverse()
  );
}
