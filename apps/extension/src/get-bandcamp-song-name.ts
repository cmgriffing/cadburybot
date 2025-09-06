import { Song, SongSource } from "custom-types";

export default function getBandcampSongName() {
  let bandcampScrapedSong: Partial<Song> = {
    source: "bandcamp" as SongSource,
  };

  // Bandcamp singles && album pages
  // example album: https://lorn.bandcamp.com/album/the-maze-to-nowhere
  // example single: https://lorn.bandcamp.com/track/acid-rain
  if (document.querySelectorAll(".trackView").length > 0) {
    // Bandcamp album page
    Array.from(document.querySelectorAll(".track_row_view")).map((row) => {
      if (row.querySelector(".playing")) {
        const songName = (row.querySelector(".title a span") as HTMLElement)
          .innerHTML;
        const songNumber = row
          .querySelector(".track_number")
          ?.innerHTML?.replace(".", "");

        if (songName) {
          bandcampScrapedSong.songName = songName;
        }
        if (songNumber) {
          bandcampScrapedSong.songNumber = Number.parseInt(songNumber, 10);
        }
      }
    });

    // Bandcamp single/track page
    const trackTitle = document.querySelector(".trackView .trackTitle");

    if (!bandcampScrapedSong.songName && trackTitle) {
      bandcampScrapedSong.songName = trackTitle.innerHTML.trim();
    }

    Array.from(document.querySelectorAll("#name-section h3")).map((row) => {
      const artistNameLink = row.querySelector("span a") as HTMLElement;
      if (artistNameLink) {
        bandcampScrapedSong.artistName = artistNameLink.innerHTML;
      }
    });

    if (trackTitle) {
      const album = trackTitle.textContent?.trim();
      bandcampScrapedSong.albumName = album;
      bandcampScrapedSong.albumUrl = window.location.href;
    }
  }

  return bandcampScrapedSong;
}
