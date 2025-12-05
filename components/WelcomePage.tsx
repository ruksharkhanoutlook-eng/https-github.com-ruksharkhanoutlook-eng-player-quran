import React from 'react';

interface WelcomePageProps {
  onGetStarted: () => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-900 to-emerald-950 text-white p-6 relative overflow-hidden font-sans">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      
      <div className="z-10 max-w-lg w-full text-center space-y-8 animate-fadeIn">
         {/* Branding */}
         <div className="flex flex-col items-center gap-3">
            <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl rotate-45 flex items-center justify-center border border-white/20 shadow-2xl mb-6 group transition-transform hover:scale-110 duration-500">
               <div className="-rotate-45">
                 <i className="fa-solid fa-quran text-5xl text-emerald-100 drop-shadow-md"></i>
               </div>
            </div>
            
            <div className="space-y-1">
                <p className="text-emerald-400 uppercase tracking-[0.25em] text-[10px] font-bold animate-pulse">Rafia Remotejobwali Presents</p>
                <h1 className="text-4xl md:text-6xl font-bold font-amiri tracking-wide text-white drop-shadow-xl">
                Al-Quran Player
                </h1>
            </div>
         </div>

         <div className="space-y-6 px-4">
           <p className="text-lg text-emerald-100/90 leading-relaxed font-light">
             Immerse yourself in the divine words with the voices of <span className="font-semibold text-white">Sudais</span>, <span className="font-semibold text-white">Mishary</span>, <span className="font-semibold text-white">Ghamdi</span> and <span className="font-semibold text-white">Abdul Basit</span>.
           </p>
           
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-emerald-200/80 mt-8">
             <div className="flex flex-col items-center gap-2 p-3 bg-white/5 rounded-lg border border-white/5">
               <i className="fa-solid fa-wand-magic-sparkles text-xl text-emerald-400"></i>
               <span>AI Powered Search</span>
             </div>
             <div className="flex flex-col items-center gap-2 p-3 bg-white/5 rounded-lg border border-white/5">
               <i className="fa-solid fa-microphone-lines text-xl text-emerald-400"></i>
               <span>4 Famous Reciters</span>
             </div>
             <div className="flex flex-col items-center gap-2 p-3 bg-white/5 rounded-lg border border-white/5">
               <i className="fa-solid fa-language text-xl text-emerald-400"></i>
               <span>Urdu Translation</span>
             </div>
           </div>
         </div>

         <div className="pt-8">
            <button 
            onClick={onGetStarted}
            className="group relative inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-emerald-950 transition-all duration-200 bg-white font-pj rounded-full focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-emerald-900 hover:bg-emerald-50 hover:scale-105 shadow-[0_0_30px_rgba(16,185,129,0.3)] w-full sm:w-auto overflow-hidden"
            >
            <span className="relative z-10 flex items-center gap-2">
                Start Listening
                <i className="fa-solid fa-arrow-right-long transition-transform group-hover:translate-x-1"></i>
            </span>
            <div className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-emerald-100/30"></div>
            </button>
         </div>
      </div>

      <div className="absolute bottom-6 text-[10px] text-emerald-500/60 uppercase tracking-widest">
        Premium Islamic Audio Experience
      </div>
    </div>
  );
};

export default WelcomePage;