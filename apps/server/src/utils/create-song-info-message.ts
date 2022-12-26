import { Song, SongSource } from "custom-types";
export function createSongInfoMessage(song: Song) {
  let message = ``;

  if (song.source === SongSource.Bandcamp) {
    if (song.artistName) {
      message += `cmgriffing is currently listening to ${song.songName} by ${song.artistName}.`;
    } else {
      message += `cmgriffing is currently listening to ${song.songName}.`;
    }

    if (song.songNumber && song.albumName) {
      message += ` It is track #${song.songNumber} on ${song.albumName}.`;
    } else if (song.songName !== song.albumName) {
      message += ` It is a track from the album ${song.albumName}.`;
    }

    if (song.albumUrl) {
      message += ` You can find the album here: ${song.albumUrl}`;
    }
  } else if (song.source === SongSource.Youtube) {
    if (song.artistName) {
      message += `cmgriffing is currently listening to ${song.songName} by ${song.artistName}.`;
    } else {
      message += `cmgriffing is currently listening to ${song.songName}.`;
    }

    if (song.songNumber && song.albumName) {
      message += ` It is track #${song.songNumber} on ${song.albumName}.`;
    } else if (song.songName !== song.albumName) {
      message += ` It is a track from the playlist ${song.albumName}.`;
    }

    if (song.albumUrl) {
      message += ` You can find the playlist here: ${song.albumUrl}`;
    }

    if (song.timestamp) {
      let prefix = "?";
      if (song.albumUrl.indexOf("?") > -1) {
        prefix = "&";
      }
      message += `${prefix}t=${song.timestamp}`;
    }
  }

  return message;
}
