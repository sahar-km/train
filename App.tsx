
import React, { useState, useEffect, useCallback } from 'react';
import { FlashcardData } from './types';
import { WORDS } from './constants';
import { generateFlashcardContent } from './services/geminiService';
import Header from './components/Header';
import Flashcard from './components/Flashcard';
import Controls from './components/Controls';
import Loader from './components/Loader';

interface PrefetchedData {
    index: number;
    data: FlashcardData;
}

const CACHE_KEY = 'flashtastic-cache';
const CACHE_VERSION = 1; // Increment to invalidate old caches if schema changes

// Utility to get cached flashcards
const getCache = (): Record<string, FlashcardData> => {
    try {
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
            const parsed = JSON.parse(cachedData);
            if (parsed.version === CACHE_VERSION && parsed.cards) {
                return parsed.cards;
            }
        }
    } catch (e) {
        console.error("Failed to read from cache", e);
    }
    return {};
};

// Utility to save a card to cache
const setCache = (word: string, data: FlashcardData) => {
    try {
        const cache = getCache();
        const updatedCards = { ...cache, [word]: data };
        localStorage.setItem(CACHE_KEY, JSON.stringify({ version: CACHE_VERSION, cards: updatedCards }));
    } catch (e) {
        console.error("Failed to write to cache", e);
    }
};


const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [flashcardData, setFlashcardData] = useState<FlashcardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [progress, setProgress] = useState(0);
  const [prefetchedData, setPrefetchedData] = useState<PrefetchedData | null>(null);


  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const prefetchNextCard = useCallback(async (currentIndex: number) => {
    const nextIndex = (currentIndex + 1) % WORDS.length;
    const nextWord = WORDS[nextIndex];

    if (prefetchedData?.index === nextIndex) return;

    const cache = getCache();
    if (cache[nextWord]) {
        setPrefetchedData({ index: nextIndex, data: cache[nextWord] });
        return;
    }

    try {
        const data = await generateFlashcardContent(nextWord);
        setCache(nextWord, data);
        setPrefetchedData({ index: nextIndex, data: data });
    } catch (err) {
        console.error(`Failed to prefetch ${nextWord}:`, err);
    }
  }, [prefetchedData]);

  const loadFlashcard = useCallback(async (index: number) => {
    setIsFlipped(false);
    setError(null);
    const word = WORDS[index];

    // 1. Use prefetched data if available for instant load
    if (prefetchedData && prefetchedData.index === index) {
        setFlashcardData(prefetchedData.data);
        setProgress(((index + 1) / WORDS.length) * 100);
        setPrefetchedData(null); 
        prefetchNextCard(index);
        return;
    }

    setIsLoading(true);
    setFlashcardData(null);

    // 2. Check cache for offline/fast access
    const cache = getCache();
    if (cache[word]) {
        setFlashcardData(cache[word]);
        setIsLoading(false);
        setProgress(((index + 1) / WORDS.length) * 100);
        prefetchNextCard(index);
        return;
    }

    // 3. Fetch from API as a last resort
    try {
      const data = await generateFlashcardContent(word);
      setCache(word, data);
      setFlashcardData(data);
    } catch (err) {
      console.error(err);
      setError('خطا در تولید محتوای فلش‌کارت. لطفاً دوباره تلاش کنید.');
    } finally {
      setIsLoading(false);
      setProgress(((index + 1) / WORDS.length) * 100);
      prefetchNextCard(index);
    }
  }, [prefetchedData, prefetchNextCard]);

  useEffect(() => {
    loadFlashcard(currentWordIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWordIndex]);

  const handleNextWord = () => {
    setCurrentWordIndex(prevIndex => (prevIndex + 1) % WORDS.length);
  };
  
  const handleUserFeedback = (level: 'easy' | 'good' | 'hard') => {
    console.log(`User marked as: ${level}`);
    handleNextWord();
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100 flex flex-col items-center justify-between p-4 font-vazir transition-colors duration-300">
      <Header theme={theme} toggleTheme={toggleTheme} />
      
      <main className="flex-grow flex flex-col items-center justify-center w-full max-w-2xl px-2">
        {isLoading && <Loader />}
        {error && <div className="text-red-500 text-center bg-red-100 dark:bg-red-900 p-4 rounded-lg">{error}</div>}
        
        {!isLoading && !error && flashcardData && (
          <div className="w-full">
            <Flashcard
              data={flashcardData}
              isFlipped={isFlipped}
              onFlip={() => setIsFlipped(!isFlipped)}
            />
          </div>
        )}
      </main>

      <footer className="w-full max-w-2xl mt-4">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.5s ease-in-out' }}></div>
        </div>
        <Controls onUserFeedback={handleUserFeedback} isFlipped={isFlipped} onFlip={() => setIsFlipped(true)} onNext={handleNextWord}/>
      </footer>
    </div>
  );
};

export default App;
