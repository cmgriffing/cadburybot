import { Song, SongSource } from 'custom-types';

export default function getBandcampSongName() {
  let bandcampScrapedSong: Partial<Song> = {
    source: 'bandcamp' as SongSource,
  };

  // Bandcamp singles && album pages
  if (document.querySelectorAll('.trackView').length > 0) {
    // Bandcamp album page
    Array.from(document.querySelectorAll('.track_row_view')).map((row) => {
      if (row.querySelector('.playing')) {
        const titleElement = row.querySelector('.title a span') as HTMLElement;
        const trackNumberElement = row.querySelector(
          '.track_number'
        ) as HTMLElement;

        if (titleElement) {
          const songName = titleElement.innerHTML;
          bandcampScrapedSong.songName = songName;
        }

        if (trackNumberElement) {
          const songNumberStr = trackNumberElement.innerHTML.replace('.', '');
          bandcampScrapedSong.songNumber = parseInt(songNumberStr, 10);
        }
      }
    });

    // Bandcamp single/track page
    const trackTitle = document.querySelector(
      '.trackView .trackTitle'
    ) as HTMLElement;

    if (!bandcampScrapedSong.songName && trackTitle) {
      bandcampScrapedSong.songName = trackTitle.innerHTML.trim();
    }

    Array.from(document.querySelectorAll('#name-section h3')).map((row) => {
      const artistNameLink = row.querySelector('span a') as HTMLElement;
      if (artistNameLink) {
        bandcampScrapedSong.artistName = artistNameLink.innerHTML;
      }
    });

    Array.from(document.querySelectorAll('#name-section h2')).map((row) => {
      const trackTitle = row.querySelector('.trackTitle') as HTMLElement;
      if (trackTitle) {
        const album = trackTitle.textContent?.trim();
        if (album) {
          bandcampScrapedSong.albumName = album;
          bandcampScrapedSong.albumUrl = window.location.href;
        }
      }
    });
  }

  return bandcampScrapedSong;
}
