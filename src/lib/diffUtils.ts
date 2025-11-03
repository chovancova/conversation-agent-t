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
