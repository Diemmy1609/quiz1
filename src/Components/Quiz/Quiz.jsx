import { useEffect, useState } from 'react';
import { FaPause, FaArrowLeft } from 'react-icons/fa';
import Result from '/src/Components/Quiz/Result';
import TopicSelection from '/src/Components/Quiz/TopicSelection';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [skippedQuestions, setSkippedQuestions] = useState(new Set());
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [paused, setPaused] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [topicSelected, setTopicSelected] = useState(null);

  const fetchQuestions = async (topicId) => {
    const topics =[
      { id: 1, name: 'Space Exploration' },
      { id: 2, name: 'Environmental Science' },
      { id: 3, name: 'World History' },
      { id: 4, name: 'Ancient Civilizations' },
      { id: 5, name: 'Modern Technology' },
      { id: 6, name: 'Philosophy' },
      { id: 7, name: 'Mythology' },
      { id: 8, name: 'Popular Culture' },
      { id: 9, name: 'Health and Wellness' },
      { id: 10, name: 'Famous Inventions' },
    ];
  
  
    const selectedTopic = topics[topicId];
    const localStorageKey = `quizQuestions_${topicId}`;
  
    const cachedQuestions = localStorage.getItem(localStorageKey);
    if (cachedQuestions) {
      setQuestions(JSON.parse(cachedQuestions));
      return;
    }
  
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: `Generate 15 quiz questions about ${selectedTopic}. Each question should have four answer options and indicate the correct answer. Please format it as a valid JSON array of objects, where each object has "question", "options", and "answer".`
            },
          ],
          max_tokens: 1000,
        }),
      });
  
      const data = await response.json();
      console.log('API Response:', data);
  
      if (!data.choices || data.choices.length === 0) {
        console.error('No choices returned from the API');
        return; 
      }
  
      const questionsText = data.choices[0].message.content.trim();
      const formattedText = questionsText.replace(/```.*?```/g, '').replace(/`/g, '');
  
      try {
        const questions = JSON.parse(formattedText);
        setQuestions(questions);
        localStorage.setItem(localStorageKey, JSON.stringify(questions));
      } catch (error) {
        console.error('Error parsing questions:', error);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };
  
  useEffect(() => {
    if (topicSelected) {
      setElapsedTime(0); // Reset thời gian khi chọn topic mới
      fetchQuestions(topicSelected);
    }
  }, [topicSelected]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!finished && !paused) {
        setElapsedTime(prev => prev + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [finished, paused]);

  const handleOptionClick = (option) => {
    setSelectedOptions(prev => ({
      ...prev,
      [currentIndex]: option,
    }));
  };

  const handleNext = () => {
    if (!selectedOptions[currentIndex]) {
      setSkippedQuestions(prev => new Set(prev).add(currentIndex));
    }
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prevIndex => prevIndex - 1);
    }
  };

  const handleCircleClick = (index) => {
    setCurrentIndex(index);
  };

  const submitAnswers = () => {
    const correctAnswers = questions.reduce((acc, question, index) => {
      return acc + (selectedOptions[index] === question.answer ? 1 : 0);
    }, 0);
    
    const calculatedScore = (correctAnswers / questions.length) * 10;
    setScore(calculatedScore);
    setFinished(true);
  };

  const formatTime = (time) => {
    const minutes = String(Math.floor(time / 60)).padStart(2, '0');
    const seconds = String(time % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const handleContinue = () => {
    setPaused(false);
    setShowPopup(false);
  };

  const handlePause = () => {
    setPaused(true);
    setShowPopup(true);
  };

  const handleBack = () => {
    setTopicSelected(null); 
    setQuestions([]); 
  };

  if (finished) {
    return (
      <Result 
        score={score} 
        totalQuestions={questions.length} 
        questions={questions}
        selectedOptions={selectedOptions}
        elapsedTime={elapsedTime}
      />
    );
  }

  if (!topicSelected) {
    return <TopicSelection onSelectTopic={setTopicSelected} />;
  }

  if (!questions.length) return <div>Loading...</div>;

  const { question, options } = questions[currentIndex];

  return (
    <div className="flex justify-center items-center relative">
      <button 
        className="absolute top-4 left-4 p-2 flex items-center"
        onClick={handleBack}
      >
        <FaArrowLeft className="mr-2" />
      </button>
      <div className='w-full max-w-2xl text-gray-800 flex flex-col gap-5 rounded-3xl p-5 md:p-10'>
        <h1 className='flex justify-center text-4xl font-bold font-Jost'>Quiz App</h1>
        <hr className='h-[2px] rounded-none bg-gray-700' />
        <h2 className='text-2xl font-bold font-Jost'>{`${currentIndex + 1}. ${question}`}</h2>
        <ul>
          {options.map((option, index) => (
            <li
              key={index}
              className={`flex items-center h-[60px] pl-[15px] bg-white shadow-lg rounded-xl mb-2 text-lg hover:bg-yellow-500 cursor-pointer ${selectedOptions[currentIndex] === option ? 'bg-yellow-500' : ''}`}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </li>
          ))}
        </ul>

        <div className="flex justify-between items-center">
          <div className="flex justify-center gap-4">
            {currentIndex > 0 && (
              <button className="btn btn_outline" onClick={handlePrev}>
                <span>Prev</span>
              </button>
            )}
            <button className="btn btn_outline" onClick={handleNext} disabled={currentIndex === questions.length - 1}>
              <span>Next</span>
            </button>
            {currentIndex > 0 && (
              <button className="btn btn_outline" onClick={submitAnswers}>
                <span>Submit</span>
              </button>
            )}
          </div>
          <div className="flex items-center">
            <div className="lg:text-lg sm:text-sm font-bold hidden sm:block">Time:</div>
            <div className="lg:text-lg sm:text-sm font-bold">{formatTime(elapsedTime)}</div>
            <button onClick={handlePause} className="ml-4">
              <FaPause className="text-2xl cursor-pointer" />
            </button>
          </div>
        </div>

        <div className="index grid grid-cols-5 gap-1 mt-4">
  {questions.slice(0, 15).map((_, index) => {
    const isSelected = currentIndex === index;
    let bgColor = 'bg-gray-300';
    let borderColor = isSelected ? 'border-blue-500' : 'border-transparent';

    if (selectedOptions[index]) {
      bgColor = 'bg-green-500'; 
    } else if (skippedQuestions.has(index)) {
      bgColor = 'bg-red-500'; 
    }

    return (
      <div
        key={index}
        className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center cursor-pointer ${bgColor} text-white border-2 ${borderColor} hover:bg-blue-500`}
        onClick={() => handleCircleClick(index)}
      >
        {index + 1}
      </div>
    );
  })}
</div>


        {showPopup && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-[250px] bg-white p-5 rounded shadow-lg">
              <h3 className="flex justify-center text-lg font-bold mb-4">Paused</h3>
              <div className="flex justify-between">
                <button className="btn btn_outline w-[100px]" onClick={handleContinue}>
                  Continue
                </button>
                <button className="btn btn_outline w-[100px]" onClick={submitAnswers}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
