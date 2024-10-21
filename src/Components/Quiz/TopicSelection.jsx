import PropTypes from 'prop-types';
import { useState } from 'react';

const defaultTopics = [
      { id: 1, name: 'GIT' },
      { id: 2, name: 'CSS' },
      { id: 3, name: 'HTML' },
      { id: 4, name: 'ReactJS' },
      { id: 5, name: 'JavaScript' },
];

const TopicSelection = ({ onSelectTopic }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectTopic = (topic) => {
    onSelectTopic(topic.id); // Pass the selected topic ID
    setSearchTerm('');
  };

  const filteredTopics = defaultTopics.filter(topic =>
    topic.name.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

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
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
        {filteredTopics.length > 0 ? filteredTopics.map((topic) => (
          <li key={topic.id}>
            <button
              className="btn btn_outline mb-2 w-full max-w-md"
              onClick={() => handleSelectTopic(topic)}
            >
              {topic.name.length > 30 ? `${topic.name.substring(0, 27)}...` : topic.name}
            </button>
          </li>
        )) : (
          <p>No topics found.</p>
        )}
      </ul>
    </div>
  );
};

TopicSelection.propTypes = {
  onSelectTopic: PropTypes.func.isRequired,
};

export default TopicSelection;
