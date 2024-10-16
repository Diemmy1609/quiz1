
import PropTypes from 'prop-types'; 
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; 

const Answers = ({ questions, selectedOptions, close }) => {
  return (
    <div className="container">
      <div className='w-full bg-white text-gray-800 flex flex-col gap-5 rounded-3xl p-10'>
        <h1 className='flex justify-center text-2xl font-Jost'>Your Answers</h1>
        <hr className='h-[2px] rounded-none bg-gray-700'/>

        {questions.map((question, index) => (
          <div key={index} className="border p-4 mb-4 rounded-lg shadow">
            <h2 className='text-lg font-bold'>{`${index + 1}. ${question.question}`}</h2>
            <ul className="list-disc pl-5">
              {question.options.map((option, optionIndex) => {
                const isSelected = selectedOptions[index] === option;
                const isCorrect = option === question.answer;

                return (
                  <li key={optionIndex} className={`text-md flex justify-between items-center ${
                    isSelected ? 'font-semibold' : ''
                  } ${isCorrect ? 'text-green-600 font-bold' : ''}`}>
                    {option}
                    {isCorrect && isSelected ? (
                      <FaCheckCircle className="text-green-600 ml-2" />
                    ) : isSelected ? (
                      <FaTimesCircle className="text-red-600 ml-2" />
                    ) : isCorrect ? (
                      <FaCheckCircle className="text-green-600 ml-2" />
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        <button className="btn btn_outline mt-5" onClick={close}>
          <span>Back to Results</span>
        </button>
      </div>
    </div>
  );
}


Answers.propTypes = {
  questions: PropTypes.arrayOf(
    PropTypes.shape({
      question: PropTypes.string.isRequired,
      options: PropTypes.arrayOf(PropTypes.string).isRequired,
      answer: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedOptions: PropTypes.object.isRequired,
  close: PropTypes.func.isRequired,
};

export default Answers;