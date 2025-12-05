import React, { useState, useMemo } from 'react';
import { SURAHS, RECITERS } from './constants';
import { Surah, Reciter } from './types';
import AudioPlayer from './components/AudioPlayer';
import SurahList from './components/SurahList';
import SurahDetail from './components/SurahDetail';
import WelcomePage from './components/WelcomePage';
import { searchQuranWithGemini } from './services/geminiService';

const App: React.FC = () => {
  // Intro State
  const [showWelcome, setShowWelcome] = useState(true);

  // App State
  const [currentSurah, setCurrentSurah] = useState<Surah | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [currentReciter, setCurrentReciter] = useState<Reciter>(RECITERS[0]); // Default: Sudais
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [filteredSurahNumbers, setFilteredSurahNumbers] = useState<number[] | null>(null);
  const [searchReasoning, setSearchReasoning] = useState<string>('');

  // Handle Search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setFilteredSurahNumbers(null);
      return;
    }

    setIsAiSearching(true);
    setSearchReasoning('');

    // Check if simple number
    const num = parseInt(searchQuery);
    if (!isNaN(num) && num >= 1 && num <= 114) {
      setFilteredSurahNumbers([num]);
      setIsAiSearching(false);
      return;
    }

    // AI Search
    const result = await searchQuranWithGemini(searchQuery);
    setFilteredSurahNumbers(result.surahNumbers);
    if (result.reasoning) setSearchReasoning(result.reasoning);
    setIsAiSearching(false);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setFilteredSurahNumbers(null);
    setSearchReasoning('');
  };

  // Filter Logic
  const displaySurahs = useMemo(() => {
    if (filteredSurahNumbers !== null) {
      return SURAHS.filter(s => filteredSurahNumbers.includes(s.number));
    }
    // Fallback local text filter if AI search isn't active/used
    if (searchQuery && !filteredSurahNumbers) {
       return SURAHS.filter(s => 
         s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) || 
         s.englishNameTranslation.toLowerCase().includes(searchQuery.toLowerCase())
       );
    }
    return SURAHS;
  }, [filteredSurahNumbers, searchQuery]);

  const playSurah = (surah: Surah) => {
    setCurrentSurah(surah);
  };

  const openDetail = (surah: Surah) => {
    setCurrentSurah(surah); // Also play it when opening details
    setViewMode('detail');
  };

  const handleNext = () => {
    if (!currentSurah) return;
    const nextNum = currentSurah.number + 1;
    if (nextNum <= 114) {
      const next = SURAHS.find(s => s.number === nextNum);
      if (next) setCurrentSurah(next);
    }
  };

  const handlePrev = () => {
    if (!currentSurah) return;
    const prevNum = currentSurah.number - 1;
    if (prevNum >= 1) {
      const prev = SURAHS.find(s => s.number === prevNum);
      if (prev) setCurrentSurah(prev);
    }
  };

  const handleReciterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = RECITERS.find(r => r.id === e.target.value);
    if (selected) {
      setCurrentReciter(selected);
    }
  };

  // Render Logic
  if (showWelcome) {
    return <WelcomePage onGetStarted={() => setShowWelcome(false)} />;
  }

  return (
    <div className="flex flex-col h-full animate-fadeIn">
      {/* Navbar */}
      <header className="bg-emerald-900 text-white shadow-md z-30">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Logo */}
            <div 
              className="flex items-center gap-3 cursor-pointer shrink-0" 
              onClick={() => { setViewMode('list'); handleClearSearch(); }}
            >
              <div className="w-10 h-10 bg-emerald-700 rounded-full flex items-center justify-center border-2 border-emerald-500">
                <i className="fa-solid fa-quran text-lg"></i>
              </div>
              <div className="flex flex-col">
                <p className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider leading-tight">Rafia Remotejobwali</p>
                <h1 className="text-xl font-bold tracking-tight leading-none">Quran Player</h1>
                <p className="text-[10px] text-emerald-300/80 mt-0.5 hidden md:block">Premium Islamic Audio</p>
              </div>
            </div>

            {/* Controls Row: Search + Reciter Select */}
            <div className="flex-1 flex flex-col md:flex-row items-center gap-3 w-full">
              
              {/* Reciter Selector */}
              <div className="w-full md:w-48 relative shrink-0">
                 <div className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-300 pointer-events-none">
                    <i className="fa-solid fa-microphone-lines"></i>
                 </div>
                 <select 
                    value={currentReciter.id}
                    onChange={handleReciterChange}
                    className="w-full pl-9 pr-4 py-2.5 rounded-full bg-emerald-800 border border-emerald-700 focus:outline-none focus:border-emerald-400 text-xs md:text-sm text-white appearance-none cursor-pointer hover:bg-emerald-700/80 transition-colors"
                 >
                    {RECITERS.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                 </select>
                 <div className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400 pointer-events-none text-xs">
                    <i className="fa-solid fa-chevron-down"></i>
                 </div>
              </div>

              {viewMode === 'list' ? (
                <form onSubmit={handleSearch} className="flex-1 relative w-full">
                  <div className="relative">
                     <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search 'Sipara 1', 'Surah Yasin'..."
                      className="w-full pl-10 pr-10 py-2.5 rounded-full bg-emerald-800 border border-emerald-700 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 placeholder-emerald-400/70 text-sm transition-all text-white"
                    />
                    <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400"></i>
                    {searchQuery && (
                      <button 
                        type="button"
                        onClick={handleClearSearch}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400 hover:text-white"
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    )}
                  </div>
                  <button type="submit" className="hidden">Submit</button>
                </form>
              ) : (
                 <div className="flex-1"></div> // Spacer when in detail view
              )}
            </div>
          </div>

          {/* Search Status / Reasoning */}
          {(isAiSearching || searchReasoning) && viewMode === 'list' && (
            <div className="mt-2 text-xs text-emerald-200 animate-fadeIn">
              {isAiSearching ? (
                <span className="flex items-center gap-2">
                  <i className="fa-solid fa-sparkles fa-spin"></i> AI is finding the best Surahs for you...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <i className="fa-solid fa-check-circle"></i> {searchReasoning}
                </span>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative">
        {viewMode === 'list' ? (
          <div className="h-full overflow-y-auto">
             <div className="max-w-6xl mx-auto py-6">
                <div className="px-4 mb-4 flex items-center justify-between">
                   <h2 className="text-lg font-semibold text-gray-700">
                     {filteredSurahNumbers ? `Search Results (${displaySurahs.length})` : 'All Surahs'}
                   </h2>
                </div>
                <SurahList 
                  surahs={displaySurahs} 
                  onSelectSurah={openDetail} 
                  activeSurah={currentSurah}
                />
             </div>
          </div>
        ) : (
          currentSurah && <SurahDetail surah={currentSurah} onClose={() => setViewMode('list')} />
        )}
      </main>

      {/* Persistent Player */}
      <AudioPlayer 
        surah={currentSurah} 
        reciter={currentReciter}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </div>
  );
};

export default App;