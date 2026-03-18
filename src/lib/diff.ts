export interface DiffSegment {
  type: 'added' | 'removed' | 'unchanged'
  text: string
}

export interface ListDiffItem {
  name: string
  type: 'added' | 'removed' | 'unchanged'
}

/**
 * Compute a word-level diff between two strings using LCS.
 */
export function computeWordDiff(original: string, tailored: string): DiffSegment[] {
  if (!original && !tailored) return []
  if (!original) return [{ type: 'added', text: tailored }]
  if (!tailored) return [{ type: 'removed', text: original }]
  if (original === tailored) return [{ type: 'unchanged', text: original }]

  const origWords = original.split(/(\s+)/)
  const tailWords = tailored.split(/(\s+)/)

  const lcs = computeLCS(origWords, tailWords)
  const segments: DiffSegment[] = []

  let oi = 0
  let ti = 0
  let li = 0

  while (oi < origWords.length || ti < tailWords.length) {
    if (li < lcs.length && oi < origWords.length && ti < tailWords.length && origWords[oi] === lcs[li] && tailWords[ti] === lcs[li]) {
      segments.push({ type: 'unchanged', text: origWords[oi] })
      oi++
      ti++
      li++
    } else if (li < lcs.length && oi < origWords.length && origWords[oi] !== lcs[li]) {
      segments.push({ type: 'removed', text: origWords[oi] })
      oi++
    } else if (li < lcs.length && ti < tailWords.length && tailWords[ti] !== lcs[li]) {
      segments.push({ type: 'added', text: tailWords[ti] })
      ti++
    } else if (li >= lcs.length && oi < origWords.length) {
      segments.push({ type: 'removed', text: origWords[oi] })
      oi++
    } else if (li >= lcs.length && ti < tailWords.length) {
      segments.push({ type: 'added', text: tailWords[ti] })
      ti++
    } else {
      break
    }
  }

  return mergeSegments(segments)
}

/**
 * Compute list diff for skills (case-insensitive).
 */
export function computeListDiff(original: string[], tailored: string[]): ListDiffItem[] {
  const origLower = new Set(original.map(s => s.toLowerCase()))
  const tailLower = new Set(tailored.map(s => s.toLowerCase()))

  const items: ListDiffItem[] = []

  // Show tailored items first (in their order), marking added/unchanged
  for (const skill of tailored) {
    items.push({
      name: skill,
      type: origLower.has(skill.toLowerCase()) ? 'unchanged' : 'added',
    })
  }

  // Then show removed items
  for (const skill of original) {
    if (!tailLower.has(skill.toLowerCase())) {
      items.push({ name: skill, type: 'removed' })
    }
  }

  return items
}

function computeLCS(a: string[], b: string[]): string[] {
  const m = a.length
  const n = b.length
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }

  const result: string[] = []
  let i = m
  let j = n
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      result.unshift(a[i - 1])
      i--
      j--
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--
    } else {
      j--
    }
  }

  return result
}

function mergeSegments(segments: DiffSegment[]): DiffSegment[] {
  if (segments.length === 0) return segments

  const merged: DiffSegment[] = [segments[0]]
  for (let i = 1; i < segments.length; i++) {
    const last = merged[merged.length - 1]
    if (last.type === segments[i].type) {
      last.text += segments[i].text
    } else {
      merged.push({ ...segments[i] })
    }
  }
  return merged
}
