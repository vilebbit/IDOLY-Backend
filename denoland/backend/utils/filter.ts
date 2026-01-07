export function filterByReleaseDate() {
  return {
    $expr: {
      $lte: [{ $toDate: { $toLong: '$releaseDate' } }, new Date()],
    },
  }
}

export function filterByReleaseTime() {
  return {
    $expr: {
      $lte: [{ $toDate: { $toLong: '$releaseTime' } }, new Date()],
    },
  }
}
