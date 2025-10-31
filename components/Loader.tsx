
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
      <div className="w-16 h-16 border-4 border-blue-400 border-solid rounded-full animate-spin border-t-transparent"></div>
      <p className="text-gray-600 dark:text-gray-300 font-vazir text-lg">در حال آماده‌سازی کارت بعدی...</p>
    </div>
  );
};

export default Loader;
