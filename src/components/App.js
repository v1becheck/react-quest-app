import { useEffect, useReducer } from 'react';
import Header from './Header';
import Loader from './Loader';
import Error from './Error';
import Main from './Main';
import StartScreen from './StartScreen';
import Question from './Question';

const initialState = {
  questions: [],
  status: 'loading', // 'loading', 'error', 'ready', 'active', 'finished'
  currentQuestionIndex: 0,
  userAnswers: [],
};

function reducer(state, action) {
  switch (action.type) {
    case 'dataReceived':
      return { ...state, questions: action.payload, status: 'ready' };
    case 'dataFailed':
      return { ...state, status: 'error' };
    case 'start':
      return { ...state, status: 'active' };
    default:
      throw new Error('Unknown action type');
  }
}

export default function App() {
  const [{ questions, status, currentQuestionIndex }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const numQuestions = questions.length;

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
          <Question question={questions[currentQuestionIndex]} />
        )}
      </Main>
    </div>
  );
}
