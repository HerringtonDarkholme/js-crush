export function* chunkTwo<T>(array: T[]) {
  for (let i = 0; i < array.length - 1; i++) {
    yield [array[i], array[i + 1]]
  }
}

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export function shareToTwitter(message: string) {
  // Encode the url and message as query parameters
  const encodedUrl = encodeURIComponent(location.href)
  const encodedMessage = encodeURIComponent(
    message
  )
  // Construct the Twitter share url with the query parameters
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedMessage}`
  // Open a new window with the Twitter share url
  window.open(twitterUrl, "_blank")
}

