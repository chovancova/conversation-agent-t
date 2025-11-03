type DiffPart = {
  text: string
  type: 'added' | 'removed' | 'unchanged'
}

export function calculateWordDiff(textA: string, textB: string): { partsA: DiffPart[]; partsB: DiffPart[] } {
  const wordsA = textA.split(/\s+/)
  const wordsB = textB.split(/\s+/)

  const dp: number[][] = Array(wordsA.length + 1)
    .fill(0)
    .map(() => Array(wordsB.length + 1).fill(0))

  for (let i = 1; i <= wordsA.length; i++) {
    for (let j = 1; j <= wordsB.length; j++) {
      if (wordsA[i - 1] === wordsB[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }

  const partsA: DiffPart[] = []
  const partsB: DiffPart[] = []

  let i = wordsA.length
  let j = wordsB.length

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && wordsA[i - 1] === wordsB[j - 1]) {
      partsA.unshift({ text: wordsA[i - 1], type: 'unchanged' })
      partsB.unshift({ text: wordsB[j - 1], type: 'unchanged' })
      i--
      j--
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      partsB.unshift({ text: wordsB[j - 1], type: 'added' })
      j--
    } else if (i > 0) {
      partsA.unshift({ text: wordsA[i - 1], type: 'removed' })
      i--
    }
  }

  return { partsA, partsB }
}

export function extractKeyPhrases(text: string, topN: number = 5): string[] {
  const commonWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
    'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should',
    'could', 'may', 'might', 'can', 'this', 'that', 'these', 'those', 'i',
    'you', 'he', 'she', 'it', 'we', 'they', 'what', 'which', 'who', 'when',
    'where', 'why', 'how', 'please', 'thank', 'thanks'
  ])

  const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || []
  const filtered = words.filter(w => !commonWords.has(w))
  
  const frequency: Record<string, number> = {}
  filtered.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1
  })

  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([word]) => word)
}

export function analyzeResponseTone(text: string): {
  sentiment: 'positive' | 'neutral' | 'negative'
  confidence: number
  indicators: string[]
} {
  const positiveWords = [
    'success', 'successful', 'complete', 'completed', 'approved', 'confirmed',
    'great', 'excellent', 'good', 'perfect', 'wonderful', 'happy', 'pleased',
    'thank', 'thanks', 'welcome', 'help', 'support', 'yes', 'absolutely'
  ]
  
  const negativeWords = [
    'error', 'fail', 'failed', 'failure', 'reject', 'rejected', 'denied',
    'unable', 'cannot', 'can\'t', 'won\'t', 'issue', 'problem', 'incorrect',
    'invalid', 'missing', 'sorry', 'apologize', 'unfortunately', 'no'
  ]

  const lowerText = text.toLowerCase()
  const words = lowerText.match(/\b[a-z']+\b/g) || []

  const foundPositive = positiveWords.filter(word => lowerText.includes(word))
  const foundNegative = negativeWords.filter(word => lowerText.includes(word))

  const positiveCount = foundPositive.length
  const negativeCount = foundNegative.length
  const totalSentiment = positiveCount + negativeCount

  if (totalSentiment === 0) {
    return { sentiment: 'neutral', confidence: 50, indicators: [] }
  }

  const positiveRatio = positiveCount / totalSentiment

  if (positiveRatio > 0.6) {
    return {
      sentiment: 'positive',
      confidence: Math.min(95, 60 + positiveRatio * 35),
      indicators: foundPositive.slice(0, 3)
    }
  } else if (positiveRatio < 0.4) {
    return {
      sentiment: 'negative',
      confidence: Math.min(95, 60 + (1 - positiveRatio) * 35),
      indicators: foundNegative.slice(0, 3)
    }
  } else {
    return {
      sentiment: 'neutral',
      confidence: 50 + Math.abs(0.5 - positiveRatio) * 40,
      indicators: []
    }
  }
}

export function compareResponseMetrics(textA: string, textB: string): {
  lengthDiff: number
  lengthDiffPercent: number
  wordCountA: number
  wordCountB: number
  sentenceCountA: number
  sentenceCountB: number
} {
  const wordCountA = textA.split(/\s+/).filter(w => w.length > 0).length
  const wordCountB = textB.split(/\s+/).filter(w => w.length > 0).length
  
  const sentenceCountA = textA.split(/[.!?]+/).filter(s => s.trim().length > 0).length
  const sentenceCountB = textB.split(/[.!?]+/).filter(s => s.trim().length > 0).length

  const lengthDiff = textB.length - textA.length
  const lengthDiffPercent = textA.length > 0 
    ? Math.round((lengthDiff / textA.length) * 100)
    : 0

  return {
    lengthDiff,
    lengthDiffPercent,
    wordCountA,
    wordCountB,
    sentenceCountA,
    sentenceCountB
  }
}

export function calculateSimilarityPercentage(textA: string, textB: string): number {
  if (textA === textB) return 100
  
  const wordsA = textA.toLowerCase().split(/\s+/)
  const wordsB = textB.toLowerCase().split(/\s+/)
  
  const setA = new Set(wordsA)
  const setB = new Set(wordsB)
  
  const intersection = new Set([...setA].filter(x => setB.has(x)))
  const union = new Set([...setA, ...setB])
  
  return Math.round((intersection.size / union.size) * 100)
}

export function highlightDifferences(textA: string, textB: string): {
  highlightedA: Array<{ text: string; highlight: boolean }>
  highlightedB: Array<{ text: string; highlight: boolean }>
} {
  const { partsA, partsB } = calculateWordDiff(textA, textB)

  const highlightedA = partsA.map(part => ({
    text: part.text,
    highlight: part.type === 'removed'
  }))

  const highlightedB = partsB.map(part => ({
    text: part.text,
    highlight: part.type === 'added'
  }))

  return { highlightedA, highlightedB }
}
