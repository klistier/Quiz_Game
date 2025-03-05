import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { QuizService } from '../service/quiz.service';

type QuizState = {
  questions: string[];
};

const initialState: QuizState = {
  questions: [],
};

export const QuizStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, quizService = inject(QuizService)) => ({
    getEasyQuestions() {
      quizService.getEasyQuestions().subscribe((questions) => {
        patchState(store, { questions: questions });
      });
    },
  }))
);
