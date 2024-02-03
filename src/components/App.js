import { useEffect, useReducer } from 'react';
import Header from './Header';
import Loader from './Loader';
import Error from './Error';
import Main from './Main';
import StartScreen from './StartScreen';
import Question from './Question';
import NextButton from './NextButton';
import Progress from './Progress';
import FinishScreen from './FinishScreen';

const initialState = {
  questions: [],
  status: 'loading', // 'loading', 'error', 'ready', 'active', 'finished'
  currentQuestionIndex: 14,
  answer: null,
  points: 0,
  highscore: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case 'dataReceived':
      return { ...state, questions: action.payload, status: 'ready' };
    case 'dataFailed':
      return { ...state, status: 'error' };
    case 'start':
      return { ...state, status: 'active' };
    case 'newAnswer':
      const question = state.questions[state.currentQuestionIndex];

      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case 'nextQuestion':
      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1,
        answer: null,
      };
    case 'finish':
      return {
        ...state,
        status: 'finished',
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    default:
      throw new Error('Unknown action type');
  }
}

export default function App() {
  const [
    { questions, status, currentQuestionIndex, answer, points, highscore },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const maxPoints = questions.reduce(
    (acc, question) => acc + question.points,
    0
  );

  useEffect(function () {
    fetch('http://localhost:3001/questions')
      .then((res) => res.json())
      .then((data) => dispatch({ type: 'dataReceived', payload: data }))
      .catch((err) => dispatch({ type: 'dataFailed' }));
  }, []);

  return (
    <div className='app'>
      <Header />
      <Main>
        {status === 'loading' && <Loader />}
        {status === 'error' && <Error />}
        {status === 'ready' && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === 'active' && (
          <>
            <Progress
              currentQuestionIndex={currentQuestionIndex}
              numQuestions={numQuestions}
              points={points}
              maxPoints={maxPoints}
              answer={answer}
            />
            <Question
              question={questions[currentQuestionIndex]}
              dispatch={dispatch}
              answer={answer}
            />
            <NextButton
              dispatch={dispatch}
              answer={answer}
              numQuestions={numQuestions}
              currentQuestionIndex={currentQuestionIndex}
            />
          </>
        )}
        {status === 'finished' && (
          <FinishScreen
            points={points}
            maxPoints={maxPoints}
            highscore={highscore}
          />
        )}
      </Main>
    </div>
  );
}
