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
import { map, pipe, switchMap, tap, timer } from 'rxjs';
import { tapResponse } from '@ngrx/operators';

type QuizState = {
  playerScore: number;
  questions: {
    easy: IQuestion[];
    medium: IQuestion[];
    hard: IQuestion[];
  };
  currentQuestion: IQuestion | null;
  isLoading: boolean;
  isError: boolean;
  isGameOver: boolean;
  hasDroppedOut: boolean;
  isGamePaused: boolean;
  isFiftyFiftyUsed: boolean;
  prizes: string[];
};

const initialState: QuizState = {
  playerScore: 0,
  questions: {
    easy: [],
    medium: [],
    hard: [],
  },
  currentQuestion: null,
  isLoading: false,
  isError: false,
  isGameOver: false,
  isFiftyFiftyUsed: false,
  prizes: [
    '1 000 0000',
    '500 000',
    '250 000',
    '125 000',
    '64 000',
    '32 000',
    '16 000',
    '8000',
    '4000',
    '2000',
    '1000',
    '500',
    '300',
    '200',
    '100',
    '0',
  ],
  isGamePaused: false,
  hasDroppedOut: false,
};

export const QuizStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    currentPrize: computed(() => {
      const prize =
        store.prizes()[store.prizes().length - 1 - store.playerScore()];
      console.log(prize);
      return prize;
    }),

    // reversedPrizes: computed(() => {
    //   return store.prizes().reverse();
    // }),
  })),
  withMethods((store, quizService = inject(QuizService)) => ({
    getEasyQuestions: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),

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
          next: (easyQuestions: IQuestion[]) => {
            console.log('easyquestions0: ', easyQuestions[0]);

            const firstQuestionOptions = [
              easyQuestions[0].correct_answer,
              ...easyQuestions[0].incorrect_answers,
            ];
            shuffleArray(firstQuestionOptions);
            // console.log(easyQuestions);
            patchState(store, {
              isLoading: false,
              questions: { ...store.questions(), easy: easyQuestions },
              currentQuestion: {
                ...easyQuestions[0],
                shuffledOptions: firstQuestionOptions,
              },
            });

            console.log(
              store.questions(),
              store.currentQuestion(),
              'firstOptions:',
              firstQuestionOptions
            );
          },
          error: (err) => {
            patchState(store, { isLoading: false, isError: true });
          },
        })
      )
    ),

    getMediumQuestions: rxMethod<void>(
      pipe(
        switchMap(() => timer(5000)), //wait 5 seconds before to avoid block from api
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
            console.log(store.questions());
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
        switchMap(() => timer(10000)), //wait 10 seconds before to avoid block from api
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
              questions: { ...store.questions(), hard: hardQuestions },
            });
            console.log(store.questions());
          },
          error: (err) => {
            console.log(err);
            patchState(store, { isError: true, isLoading: false });
          },
        })
      )
    ),

    evaluateAnswer(answer: string) {
      console.log(store.questions());
      if (store.currentQuestion()?.correct_answer === answer) {
        patchState(store, {
          playerScore: store.playerScore() + 1,
          isGamePaused: true,
        });
      } else {
        patchState(store, { isGameOver: true });
      }
      console.log(store.playerScore());
      console.log(store.currentPrize());
      console.log(store.prizes());
    },

    setCurrentQuestion() {
      let question = store.currentQuestion();

      const index = store.playerScore();

      if (question) {
        if (index === 0) {
          question = store.questions().easy[0];
        }
        if (index < 5) {
          question = store.questions().easy[index];
        } else if (index < 10) {
          question = store.questions().medium[index - 5];
        } else if (index < 15) {
          question = store.questions().hard[index - 10];
        }

        const options = [
          ...question.incorrect_answers,
          question.correct_answer,
        ];
        question.shuffledOptions = shuffleArray(options);
      }

      console.log('question: ', question, 'playerscore', store.playerScore());

      patchState(store, { currentQuestion: question, isGamePaused: false });
    },

    fiftyFifty() {
      const currentQuestion = store.currentQuestion();
      if (currentQuestion) {
        currentQuestion.incorrect_answers.splice(0, 2);
        const options = [
          ...currentQuestion.incorrect_answers,
          currentQuestion.correct_answer,
        ];
        currentQuestion.shuffledOptions = shuffleArray(options);
      }
      patchState(store, {
        currentQuestion: currentQuestion,
        isFiftyFiftyUsed: true,
      });
      console.log(currentQuestion);
    },

    // nextQuestion() {

    // },

    dropOut() {
      patchState(store, { hasDroppedOut: true });
    },
  }))
);

function shuffleArray(array: string[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
