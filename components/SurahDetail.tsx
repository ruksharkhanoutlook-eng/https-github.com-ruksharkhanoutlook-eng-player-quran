import React, { useEffect, useState } from 'react';
import { Surah, SurahDetailData } from '../types';

interface SurahDetailProps {
  surah: Surah;
  onClose: () => void;
}

const SurahDetail: React.FC<SurahDetailProps> = ({ surah, onClose }) => {
  const [arabicData, setArabicData] = useState<SurahDetailData | null>(null);
  const [translationData, setTranslationData] = useState<SurahDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchSurahText = async () => {
      setLoading(true);
      setError(false);
      try {
        // Fetch both Uthmani Script (Arabic) and Urdu Translation (Junagarhi)
        const res = await fetch(`https://api.alquran.cloud/v1/surah/${surah.number}/editions/quran-uthmani,ur.junagarhi`);
        const json = await res.json();
        
        if (json.code === 200 && Array.isArray(json.data) && json.data.length >= 2) {
          setArabicData(json.data[0]);
          setTranslationData(json.data[1]);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchSurahText();
  }, [surah]);

  return (
    <div className="flex flex-col h-full bg-white animate-fadeIn">
      {/* Header for reading mode */}
      <div className="flex items-center justify-between p-4 border-b bg-white/95 backdrop-blur-sm sticky top-0 z-20 shadow-sm">
        <button 
          onClick={onClose}
          className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition group"
        >
          <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
          <span className="font-medium">Back</span>
        </button>
        <div className="text-center">
          <h2 className="font-bold text-lg text-emerald-950">{surah.englishName}</h2>
          <p className="text-xs text-gray-500">{surah.englishNameTranslation}</p>
        </div>
        <div className="w-16"></div> {/* Spacer for center alignment */}
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-32 bg-[#fffbf2]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4 text-emerald-600">
             <i className="fa-solid fa-circle-notch fa-spin text-4xl"></i>
             <p className="text-sm font-medium animate-pulse">Loading Surah & Translation...</p>
          </div>
        ) : error ? (
           <div className="flex flex-col items-center justify-center mt-20 text-red-500 gap-2">
             <i className="fa-solid fa-triangle-exclamation text-3xl"></i>
             <p>Failed to load Surah data. Please check your connection.</p>
           </div>
        ) : arabicData && translationData ? (
          <div className="max-w-3xl mx-auto space-y-8 mt-4">
             {/* Bismillah */}
             {surah.number !== 1 && surah.number !== 9 && (
               <div className="text-center mb-12 mt-4 space-y-4">
                 <p className="font-amiri text-3xl md:text-4xl text-emerald-950 leading-relaxed">بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</p>
                 <p className="font-urdu text-lg text-emerald-700/80">شروع اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے</p>
               </div>
             )}

             {arabicData.ayahs.map((ayah, index) => {
                const translation = translationData.ayahs[index];
                return (
                <div key={ayah.number} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-amber-100 relative hover:shadow-md transition-shadow group">
                   <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-xs font-bold text-amber-800 font-sans shadow-inner group-hover:bg-emerald-100 group-hover:text-emerald-800 transition-colors">
                     {ayah.numberInSurah}
                   </div>
                   
                   {/* Arabic Text */}
                   <p className="font-amiri text-2xl md:text-4xl leading-[2.4] text-right text-gray-800 w-full mb-6" dir="rtl">
                      {ayah.text.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ', '')}
                   </p>

                   {/* Divider */}
                   <div className="h-px bg-gradient-to-r from-transparent via-emerald-100 to-transparent mb-6 opacity-50"></div>

                   {/* Urdu Translation */}
                   <p className="font-urdu text-lg md:text-2xl leading-[2.2] text-right text-emerald-800/90 w-full" dir="rtl">
                      {translation?.text}
                   </p>
                </div>
             )})}
             
             <div className="text-center text-gray-400 text-sm mt-10 mb-4">
                End of Surah {surah.englishName}
             </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SurahDetail;