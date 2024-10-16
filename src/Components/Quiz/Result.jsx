import  { useState } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import Answers from './Answers'

const Result = ({ score, questions, selectedOptions, elapsedTime }) => {
  const [showAnswers, setShowAnswers] = useState(false);

  const handleCheckAnswers = () => {
    setShowAnswers(true);
  };

  const formatTime = (time) => {
    const minutes = String(Math.floor(time / 60)).padStart(2, '0');
    const seconds = String(time % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  if (showAnswers) {
    return (
      <Answers 
        questions={questions} 
        selectedOptions={selectedOptions} 
        close={() => setShowAnswers(false)} 
      />
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className='w-full max-w-md bg-white text-gray-800 flex flex-col gap-5 rounded-3xl p-10'>
        <h1 className='flex justify-center text-2xl font-Jost'>Quiz Result</h1>
        <hr className='h-[2px] rounded-none bg-gray-700'/>
        <div className='flex flex-col items-center p-4'>
          <h2 className='text-xl font-bold font-Jost p-2'>Your Score</h2>
          <div className='text-4xl font-bold p-2'>{score.toFixed(1)} / 10</div>
          <div className='text-lg font-bold mt-5'>{`Total Time: ${formatTime(elapsedTime)}`}</div> 
        </div>
        <div className='flex flex-col justify-center gap-2 sm:flex-row md:gap-4 lg:pt-5 xl:pt-10 pt-3'>
          <button className="btn btn_outline" onClick={() => window.location.reload()}>
            <span>Retry</span>
          </button>
          <button className="btn btn_outline" onClick={handleCheckAnswers}>
            <span>Check your answers</span>
          </button>
        </div>
      </div>
    </div>
  );
}


Result.propTypes = {
  score: PropTypes.number.isRequired,
  totalQuestions: PropTypes.number.isRequired,
  questions: PropTypes.array.isRequired,
  selectedOptions: PropTypes.object.isRequired,
  elapsedTime: PropTypes.number.isRequired,
};

export default Result;