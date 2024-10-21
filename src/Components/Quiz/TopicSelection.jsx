import PropTypes from 'prop-types';
import { useState } from 'react';

const defaultTopics = [
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

const TopicSelection = ({ onSelectTopic }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [fetchedTopics, setFetchedTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTopicsFromApi = async (query) => {
    setLoading(true);
    setError('');
    const apiKey = import.meta.env.VITE_API_KEY;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: `Suggest general quiz topics related to "${query}".`,
            },
          ],
        }),
      });

      const data = await response.json();
      if (data.choices && data.choices.length > 0) {
        const topics = data.choices[0].message.content.split('\n').map((topic) => ({
          id: Date.now() + Math.random(), 
          name: topic.trim(), 
        })).filter(topic => topic.name); 
        setFetchedTopics(topics);
      } else {
        setFetchedTopics([]);
      }
    } catch (error) {
      console.error('Error fetching topics:', error);
      setError('Failed to fetch topics. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value) {
      fetchTopicsFromApi(value);
    } else {
      setFetchedTopics([]);
    }
  };

  const handleSelectTopic = (topic) => {
    onSelectTopic(topic.id);
    setSearchTerm('');
    setFetchedTopics([]);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen mx-auto px-4 py-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Select a Topic</h1>
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Search for a topic..."
        className="mb-4 p-3 border rounded w-full max-w-xs md:max-w-md lg:max-w-lg"
      />
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
        {fetchedTopics.length > 0 ? (
          fetchedTopics.map((topic) => (
            <li key={topic.id}>
              <button
                className="btn btn_outline mb-2 w-full max-w-md"
                onClick={() => handleSelectTopic(topic)}
              >
                {topic.name.length > 30 ? `${topic.name.substring(0, 27)}...` : topic.name}
              </button>
            </li>
          ))
        ) : (
          defaultTopics.map((topic) => (
            <li key={topic.id}>
              <button
                className="btn btn_outline mb-2 w-full max-w-md"
                onClick={() => handleSelectTopic(topic)}
              >
                {topic.name.length > 30 ? `${topic.name.substring(0, 27)}...` : topic.name}
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

TopicSelection.propTypes = {
  onSelectTopic: PropTypes.func.isRequired,
};

export default TopicSelection;
