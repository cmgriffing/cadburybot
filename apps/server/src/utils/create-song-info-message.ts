import { Song } from "custom-types";
export function createSongInfoMessage(song: Song) {
  let message = ``;

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
  return message;
}
