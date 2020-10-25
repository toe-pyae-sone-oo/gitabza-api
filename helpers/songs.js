const getYoutubeImage = url => {
  try {
    const _url = new URL(url)
    const q = _url.searchParams
    return q.has('v') ? `https://img.youtube.com/vi/${q.get('v')}/hqdefault.jpg` : undefined
  } catch (err) {
    console.log(err)
    return undefined
  }
}

module.exports = {
  getYoutubeImage,
}