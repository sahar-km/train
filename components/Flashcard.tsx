
import React from 'react';
import { FlashcardData } from '../types';

interface FlashcardProps {
  data: FlashcardData;
  isFlipped: boolean;
  onFlip: () => void;
}

const VolumeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
);

const Flashcard: React.FC<FlashcardProps> = ({ data, isFlipped, onFlip }) => {
  
  const playAudio = () => {
    try {
      const utterance = new SpeechSynthesisUtterance(data.word);
      utterance.lang = 'en-US';
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error("Text-to-speech not supported or failed.", error);
    }
  };

  const CardFace: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
    <div className={`absolute w-full h-full p-6 md:p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex flex-col overflow-y-auto ${className}`}>
        {children}
    </div>
  );

  return (
    <div className={`perspective w-full aspect-[3/4] sm:aspect-video max-w-md mx-auto cursor-pointer ${isFlipped ? 'card-flipped' : ''}`} onClick={onFlip}>
      <div className="relative w-full h-full card-inner">
        {/* Front of the card */}
        <CardFace className="card-front">
          <div className="flex-grow flex flex-col justify-center items-center text-center">
            <h2 className="font-sans font-bold text-4xl md:text-5xl text-blue-600 dark:text-blue-400">{data.word}</h2>
            <div className="flex items-center gap-2 mt-2">
                <p className="font-sans text-lg text-gray-500 dark:text-gray-400">{data.ipa}</p>
                <button onClick={(e) => { e.stopPropagation(); playAudio(); }} className="text-gray-500 hover:text-blue-500 transition-colors dark:text-gray-400 dark:hover:text-blue-400" aria-label="Play pronunciation">
                    <VolumeIcon className="w-6 h-6" />
                </button>
            </div>
          </div>
          <div className="text-left font-sans text-sm md:text-base">
            <p className="text-gray-700 dark:text-gray-300">{data.englishDefinition}</p>
            <div className="mt-4 space-y-2">
              {data.englishExamples.map((ex, i) => <p key={i} className="italic text-gray-600 dark:text-gray-400">"{ex}"</p>)}
            </div>
          </div>
          <div className="mt-auto pt-4 text-center text-sm text-gray-400">برای دیدن ترجمه کلیک کنید</div>
        </CardFace>
        
        {/* Back of the card */}
        <CardFace className="card-back text-right" dir="rtl">
            <div className="space-y-4 text-sm md:text-base">
                <div className="text-center mb-6">
                    <h2 className="font-vazir font-bold text-4xl md:text-5xl text-emerald-600 dark:text-emerald-400">{data.persianTranslation}</h2>
                    <p className="font-vazir text-lg text-gray-500 dark:text-gray-400 mt-2">{data.persianPhonetic}</p>
                </div>
                
                <div className="space-y-2">
                    <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">مثال‌ها</h3>
                    {data.persianExamples.map((ex, i) => <p key={i} className="text-gray-600 dark:text-gray-400">{ex}</p>)}
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-2">
                    {(data.persianSynonyms.length > 0 || data.englishSynonyms.length > 0) && (
                        <div>
                            <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-1">مترادف‌ها</h4>
                            <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                                {data.persianSynonyms.map((s, i) => <li key={`ps-${i}`}>{s}</li>)}
                                {data.englishSynonyms.map((s, i) => <li key={`es-${i}`} className="font-sans" dir="ltr">{s}</li>)}
                            </ul>
                        </div>
                    )}
                    {(data.persianAntonyms.length > 0 || data.englishAntonyms.length > 0) && (
                        <div>
                            <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-1">متضادها</h4>
                            <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                                {data.persianAntonyms.map((a, i) => <li key={`pa-${i}`}>{a}</li>)}
                                {data.englishAntonyms.map((a, i) => <li key={`ea-${i}`} className="font-sans" dir="ltr">{a}</li>)}
                            </ul>
                        </div>
                    )}
                </div>

                {data.extraNote && (
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-gray-700 rounded-lg">
                        <h4 className="font-bold text-blue-800 dark:text-blue-300">نکته:</h4>
                        <p className="text-blue-700 dark:text-blue-200">{data.extraNote}</p>
                    </div>
                )}
            </div>
        </CardFace>
      </div>
    </div>
  );
};

export default Flashcard;
