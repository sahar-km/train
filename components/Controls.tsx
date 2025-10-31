
import React from 'react';

interface ControlsProps {
  onUserFeedback: (level: 'easy' | 'good' | 'hard') => void;
  isFlipped: boolean;
  onFlip: () => void;
  onNext: () => void;
}

const Controls: React.FC<ControlsProps> = ({ onUserFeedback, isFlipped, onFlip, onNext }) => {
    if (!isFlipped) {
        return (
            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={onNext}
                    className="col-span-1 py-3 px-4 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold text-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-transform transform hover:scale-105"
                >
                    رد کردن
                </button>
                 <button
                    onClick={onFlip}
                    className="col-span-1 py-3 px-4 rounded-xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-lg shadow-blue-500/30"
                >
                    نمایش پاسخ
                </button>
            </div>
        )
    }

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full">
      <button
        onClick={() => onUserFeedback('hard')}
        className="py-3 px-4 rounded-xl bg-red-500/20 text-red-600 dark:text-red-400 font-bold text-lg hover:bg-red-500/30 transition-transform transform hover:scale-105"
      >
        سخت بود
      </button>
      <button
        onClick={() => onUserFeedback('good')}
        className="py-3 px-4 rounded-xl bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 font-bold text-lg hover:bg-yellow-500/30 transition-transform transform hover:scale-105"
      >
        خوب بود
      </button>
      <button
        onClick={() => onUserFeedback('easy')}
        className="py-3 px-4 rounded-xl bg-green-500/20 text-green-600 dark:text-green-400 font-bold text-lg hover:bg-green-500/30 transition-transform transform hover:scale-105"
      >
        آسان بود
      </button>
    </div>
  );
};

export default Controls;
