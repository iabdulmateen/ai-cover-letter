export interface ReadabilityMetrics {
  readingEase: number;
  gradeLevel: number;
  levelLabel: string;
  levelColor: string;
  sentenceCount: number;
  avgSentenceLength: number;
  avgSyllablesPerWord: number;
  qualitySummary: string;
}

export function countSyllables(word: string): number {
  const clean = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!clean) return 0;
  if (clean.length <= 3) return 1;

  // Standard English syllable heuristics
  const formatted = clean
    .replace(/(?:[^laeiouy]|ed|es|e)$/, "")
    .replace(/^y/, "");

  const matches = formatted.match(/[aeiouy]{1,2}/g);
  return matches ? Math.max(1, matches.length) : 1;
}

export function calculateReadability(text: string): ReadabilityMetrics {
  const trimmed = text.trim();
  if (!trimmed) {
    return {
      readingEase: 0,
      gradeLevel: 0,
      levelLabel: "N/A",
      levelColor: "#8f8faa",
      sentenceCount: 0,
      avgSentenceLength: 0,
      avgSyllablesPerWord: 0,
      qualitySummary: "Enter or generate text to evaluate readability.",
    };
  }

  const sentences = trimmed
    .split(/[.!?]+(?:\s+|$)/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  const sentenceCount = Math.max(1, sentences.length);

  const words = trimmed.match(/\b[a-zA-Z0-9'-]+\b/g) || [];
  const wordCount = Math.max(1, words.length);

  let totalSyllables = 0;
  for (const w of words) {
    totalSyllables += countSyllables(w);
  }

  const avgWordsPerSentence = wordCount / sentenceCount;
  const avgSyllablesPerWord = totalSyllables / wordCount;

  // Flesch Reading Ease Formula: 206.835 - (1.015 * ASL) - (84.6 * ASW)
  let readingEase = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;
  readingEase = Math.round(Math.max(0, Math.min(100, readingEase)));

  // Flesch-Kincaid Grade Level Formula: (0.39 * ASL) + (11.8 * ASW) - 15.59
  let gradeLevel = 0.39 * avgWordsPerSentence + 11.8 * avgSyllablesPerWord - 15.59;
  gradeLevel = Math.max(1, Math.round(gradeLevel * 10) / 10);

  let levelLabel = "Standard";
  let levelColor = "#5046e4";
  let qualitySummary = "Clear and professional — ideal for recruiter scanning.";

  if (readingEase >= 80) {
    levelLabel = "Very Easy";
    levelColor = "#059669";
    qualitySummary = "Very simple and quick to digest.";
  } else if (readingEase >= 70) {
    levelLabel = "Easy";
    levelColor = "#10b981";
    qualitySummary = "Crisp, concise and easy to read.";
  } else if (readingEase >= 60) {
    levelLabel = "Standard (Ideal)";
    levelColor = "#5046e4";
    qualitySummary = "Optimal professional balance for hiring managers.";
  } else if (readingEase >= 50) {
    levelLabel = "Moderately Complex";
    levelColor = "#d97706";
    qualitySummary = "Slightly dense vocabulary, suitable for specialized roles.";
  } else if (readingEase >= 30) {
    levelLabel = "Complex";
    levelColor = "#ea580c";
    qualitySummary = "Long sentences or academic tone. Consider simplifying.";
  } else {
    levelLabel = "Very Complex";
    levelColor = "#dc2626";
    qualitySummary = "Heavy syntactic complexity. Recommend breaking down sentences.";
  }

  return {
    readingEase,
    gradeLevel,
    levelLabel,
    levelColor,
    sentenceCount,
    avgSentenceLength: Math.round(avgWordsPerSentence * 10) / 10,
    avgSyllablesPerWord: Math.round(avgSyllablesPerWord * 100) / 100,
    qualitySummary,
  };
}
