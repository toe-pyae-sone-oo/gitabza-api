const { v4: uuid } = require('uuid')
const SongView = require('../models/songviews')

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

const recordSongVisit = async song_uuid => {
  const songView = new SongView({ uuid: uuid(), song: song_uuid })
  const view = await songView.save()
  return view.toJSON()
}

const getTopSongs = async () => {
  return await SongView.aggregate([
    {
      $group: {
        _id: '$song',
        count: { $sum: 1 }
      }
    },
    {
      $sort: {
        count: -1
      }
    },
    {
      $limit: 20
    },
  ])
    .exec()
}

module.exports = {
  getYoutubeImage,
  recordSongVisit,
  getTopSongs,
}