import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { QuizService } from '../service/quiz.service';
import { IQuestion } from '../interface/IQuestion';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { delay, forkJoin, map, pipe, switchMap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';

type QuizState = {
  playerScore: number;
  questions: {
    easy: IQuestion[];
    medium: IQuestion[];
    hard: IQuestion[];
  };
  isLoading: boolean;
  isError: boolean;
  isGameOver: boolean;
};

const initialState: QuizState = {
  playerScore: 0,
  questions: {
    easy: [],
    medium: [],
    hard: [],
  },
  isLoading: false,
  isError: false,
  isGameOver: false,
};

export const QuizStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    currentQuestion: computed(() => {
      let question: IQuestion;
      const index = store.playerScore();
      if (store.playerScore() < 4) {
        question = store.questions().easy[index];
      } else if (store.playerScore() >= 4 && store.playerScore() < 8) {
        question = store.questions().medium[index - 4];
      } else {
        question = store.questions().hard[index - 8];
      }

      const answers = [...question.incorrect_answers, question.correct_answer];
      const shuffledAnswers = shuffleArray(answers);

      return { question, shuffledAnswers };
    }),
  })),
  withMethods((store, quizService = inject(QuizService)) => ({
    getEasyQuestions: rxMethod<void>(
      pipe(
        switchMap(() => quizService.getEasyQuestions()),
        map((res) =>
          res.results.map((question) => ({
            type: question.type,
            difficulty: question.difficulty,
            category: question.category,
            question: question.question,
            correct_answer: question.correct_answer,
            incorrect_answers: question.incorrect_answers,
          }))
        ),
        tapResponse({
          next: (easyQuestions) => {
            console.log(easyQuestions);
            patchState(store, {
              isLoading: false,
              questions: { ...store.questions(), easy: easyQuestions },
            });
          },
          error: (err) => {
            patchState(store, { isLoading: false, isError: true });
          },
        })
      )
    ),

    getMediumQuestions: rxMethod<void>(
      pipe(
        switchMap(() => quizService.getMediumQuestions()),
        map((res) =>
          res.results.map((question) => ({
            type: question.type,
            difficulty: question.difficulty,
            category: question.category,
            question: question.question,
            correct_answer: question.correct_answer,
            incorrect_answers: question.incorrect_answers,
          }))
        ),
        tapResponse({
          next: (mediumQuestions) => {
            patchState(store, {
              questions: { ...store.questions(), medium: mediumQuestions },
            });
          },
          error: (err) => {
            console.log(err);
            patchState(store, { isError: true, isLoading: false });
          },
        })
      )
    ),

    getHardQuestions: rxMethod<void>(
      pipe(
        switchMap(() => quizService.getHardQuestions()),
        map((res) =>
          res.results.map((question) => ({
            type: question.type,
            difficulty: question.difficulty,
            category: question.category,
            question: question.question,
            correct_answer: question.correct_answer,
            incorrect_answers: question.incorrect_answers,
          }))
        ),
        tapResponse({
          next: (hardQuestions) => {
            patchState(store, {
              questions: { ...store.questions(), medium: hardQuestions },
            });
          },
          error: (err) => {
            console.log(err);
            patchState(store, { isError: true, isLoading: false });
          },
        })
      )
    ),
  }))
);

function shuffleArray(array: string[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
