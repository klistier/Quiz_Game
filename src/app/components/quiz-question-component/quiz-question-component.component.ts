import { Component, EventEmitter, input, output } from '@angular/core';
import { IQuestion } from '../../interface/IQuestion';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quiz-question-component',
  imports: [CommonModule],
  templateUrl: './quiz-question-component.component.html',
})
export class QuizQuestionComponentComponent {
  question = input<string>();

  shortLineLeft = input<boolean>(false);

  shortLineRight = input<boolean>(false);

  options = input<string[]>();

  onClick = output<string>();

  isEvenIndex(index: number) {
    if (index % 2 === 0) {
      return true;
    } else {
      return false;
    }
  }
}
