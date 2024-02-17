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
import Footer from './Footer';
import Timer from './Timer';
import questionsData from '../questions.json';

const SECS_PER_QUESTION = 20;

const initialState = {
  questions: [],
  status: 'loading', // 'loading', 'error', 'ready', 'active', 'finished'
  currentQuestionIndex: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsLeft: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'dataReceived':
      return { ...state, questions: action.payload, status: 'ready' };
    case 'dataFailed':
      return { ...state, status: 'error' };
    case 'start':
      return {
        ...state,
        status: 'active',
        secondsLeft: state.questions.length * SECS_PER_QUESTION,
      };
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
    case 'restart':
      return { ...initialState, questions: state.questions, status: 'ready' };
    case 'timerTick':
      return {
        ...state,
        secondsLeft: state.secondsLeft - 1,
        status: state.secondsLeft === 0 ? 'finished' : state.status,
      };
    default:
      throw new Error('Unknown action type');
  }
}

export default function App() {
  const [
    {
      questions,
      status,
      currentQuestionIndex,
      answer,
      points,
      highscore,
      secondsLeft,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const maxPoints = questions.reduce(
    (acc, question) => acc + question.points,
    0
  );

  useEffect(function () {
    dispatch({ type: 'dataReceived', payload: questionsData.questions });
    // fetch(
    //   'https://my-json-server.typicode.com/v1becheck/react-quest-app/questions'
    // )
    //   .then((res) => res.json())
    //   .then((data) => dispatch({ type: 'dataReceived', payload: data }))
    //   .catch((err) => dispatch({ type: 'dataFailed' }));
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
            <Footer>
              <Timer dispatch={dispatch} secondsLeft={secondsLeft} />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                numQuestions={numQuestions}
                currentQuestionIndex={currentQuestionIndex}
              />
            </Footer>
          </>
        )}
        {status === 'finished' && (
          <>
            <FinishScreen
              points={points}
              maxPoints={maxPoints}
              highscore={highscore}
              dispatch={dispatch}
            />
            <button
              className='btn btn-ui'
              onClick={() => dispatch({ type: 'restart' })}
            >
              Restart Quiz
            </button>
          </>
        )}
      </Main>
    </div>
  );
}
