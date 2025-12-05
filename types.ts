export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
}

export interface SurahDetailData {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
  ayahs: Ayah[];
}

export interface SearchResult {
  surahNumbers: number[];
  reasoning?: string;
}

export interface Reciter {
  id: string;
  name: string;
  folder: string; // Folder name for QuranicAudio API
  fallbackServer?: string; // Backup server URL (e.g. mp3quran)
  fallbackFolder?: string; // Folder name on backup server
}