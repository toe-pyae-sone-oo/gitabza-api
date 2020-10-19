const getYoutubeImage = url => {
  const _url = new URL(url)
  const q = _url.searchParams
  return q.has('v') ? `https://img.youtube.com/vi/${q.get('v')}/hqdefault.jpg` : undefined
}

module.exports = {
  getYoutubeImage,
}