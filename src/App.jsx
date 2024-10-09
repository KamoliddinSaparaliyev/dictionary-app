import { useState } from 'react';
import './App.css';
import valomeOn from './assets/volume-on.svg';

function App() {
  const [word, setWord] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const sound = new Audio();

  async function getDefinition(word) {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      const result = await response.json();
      if (response.ok) {
        setData(result);
      } else {
        setError(result.title || 'No Definitions Found');
        setData(null);
      }
    } catch (err) {
      setError('An error occurred while fetching data.' + err.message);
    }
    setIsLoading(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (word) {
      await getDefinition(word);
    }
  };

  function checkAudio(audio) {
    if (audio.includes('uk.mp3')) {
      return 'uk'
    }
    if (audio.includes('us.mp3')) {
      return 'us'
    }

  }

  const playSound = (audioSrc) => {
    if (audioSrc) {
      sound.src = audioSrc;
      sound.play();
    }
  };

  const joinWithHTML = (arr) => {
    return arr.map((item, index) => (
      <p key={index} className="synonym">{item}</p>
    ));
  }

  return (
    <div className="container">
      <div className="box">
        <h2 className="hero-title">Dictionary</h2>
        <form id="form" onSubmit={handleSubmit}>
          <input
            className="input-search"
            type="text"
            name="search"
            id="search"
            placeholder="Search something..."
            value={word}
            onChange={(e) => setWord(e.target.value)}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </form>
        <div id="description-box" className="description-box">
          {error && <h2 className="error">{error}</h2>}
          {!error && data && data.length > 0 &&
            <>
              {data.map((item, i) => (
                <div key={i} className="description">
                  <div className="word-card">
                    <div className='word-box'>
                      <h3 className="word">
                        {item.word}
                      </h3>
                      <i className='phonetic'>{item.phonetic}</i>
                    </div>
                    {
                      item.phonetics.map((phonetic, i) => (
                        <div className='phonetic-box' key={i}>
                          {phonetic.text && phonetic.audio && <span>{phonetic.text} <b>{checkAudio(phonetic?.audio)}</b></span>}
                          {phonetic.audio && (
                            <button onClick={() => playSound(phonetic.audio)}>
                              <img src={valomeOn} className='valome' alt="Play sound" />
                            </button>
                          )}
                        </div>
                      ))
                    }
                    {item.meanings.map((meaning, i) => (
                      <div key={i}>
                        <h3 className="partOfSpeech">{meaning.partOfSpeech}</h3>
                        {meaning.definitions.map((definition, defIndex) => (
                          <div key={defIndex}>
                            <p className="example-title">{definition.definition}</p>
                            {definition.example && (
                              <p className="example">{definition.example}</p>
                            )}
                          </div>
                        ))}
                        {meaning.synonyms.length > 0 && (
                          <div className='synonyms-box'>
                            <p className="synonym-title">Synonyms:</p>
                            {joinWithHTML(meaning.synonyms)}
                          </div>
                        )}
                        {meaning.antonyms.length > 0 && (
                          <div className='synonyms-box'>
                            <p className="synonym-title">Antonyms:</p>
                            {joinWithHTML(meaning.antonyms)}
                          </div>
                        )}
                      </div>

                    ))}

                  </div>
                </div>
              ))}
            </>
          }
        </div>
      </div>
    </div>
  );
}

export default App;
