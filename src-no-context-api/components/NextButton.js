function NextButton({ dispatch, answer, numQuestions, currentQuestionIndex }) {
  if (answer === null) return null;

  if (currentQuestionIndex < numQuestions - 1)
    return (
      <button
        className='btn btn-ui'
        onClick={() => dispatch({ type: 'nextQuestion' })}
      >
        Next
      </button>
    );

  if (currentQuestionIndex === numQuestions - 1)
    return (
      <button
        className='btn btn-ui'
        onClick={() => dispatch({ type: 'finish' })}
      >
        Finish
      </button>
    );
}

export default NextButton;
