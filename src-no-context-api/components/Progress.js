function Progress({
  currentQuestionIndex,
  numQuestions,
  points,
  maxPoints,
  answer,
}) {
  return (
    <header className='progress'>
      <progress
        max={numQuestions}
        value={currentQuestionIndex + Number(answer !== null)}
      />

      <p>
        Question <strong>{currentQuestionIndex + 1}</strong> / {numQuestions}
      </p>

      <p>
        <strong>{points}</strong> / {maxPoints}
      </p>
    </header>
  );
}

export default Progress;
