import React from 'react';
import { Surah } from '../types';

interface SurahListProps {
  surahs: Surah[];
  onSelectSurah: (surah: Surah) => void;
  activeSurah: Surah | null;
}

const SurahList: React.FC<SurahListProps> = ({ surahs, onSelectSurah, activeSurah }) => {
  if (surahs.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-gray-400 mb-2 text-4xl">
           <i className="fa-solid fa-book-open"></i>
        </div>
        <p className="text-gray-500">No Surahs found matching your search.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 pb-32">
      {surahs.map((surah) => {
        const isActive = activeSurah?.number === surah.number;
        return (
          <button
            key={surah.number}
            onClick={() => onSelectSurah(surah)}
            className={`
              relative group flex items-center justify-between p-4 rounded-xl border transition-all duration-300 text-left
              ${isActive 
                ? 'bg-emerald-50 border-emerald-500 shadow-md transform scale-[1.02]' 
                : 'bg-white border-gray-100 hover:border-emerald-200 hover:shadow-lg hover:-translate-y-1'
              }
            `}
          >
            <div className="flex items-center gap-4">
              <div className={`
                w-10 h-10 flex items-center justify-center rounded-lg font-bold text-sm transform rotate-45 transition-colors
                ${isActive ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-emerald-100 group-hover:text-emerald-700'}
              `}>
                <span className="-rotate-45">{surah.number}</span>
              </div>
              <div>
                <h3 className={`font-semibold ${isActive ? 'text-emerald-900' : 'text-gray-800'}`}>
                  {surah.englishName}
                </h3>
                <p className="text-xs text-gray-500">{surah.englishNameTranslation} • {surah.numberOfAyahs} Ayahs</p>
              </div>
            </div>
            
            <div className="text-right">
              <span className={`font-amiri text-xl ${isActive ? 'text-emerald-700' : 'text-gray-700'}`}>
                {surah.name}
              </span>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-1">
                {surah.revelationType}
              </p>
            </div>
            
            {isActive && (
               <div className="absolute right-2 bottom-2 text-emerald-500 text-xs animate-pulse">
                  <i className="fa-solid fa-volume-high"></i> Playing
               </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default SurahList;
