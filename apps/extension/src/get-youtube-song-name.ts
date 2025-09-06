import { Song, SongSource } from 'custom-types';

export default function getYouTubeSongName() {
  let youtubeScrapedSong: Partial<Song> = {
    source: 'youtube' as SongSource,
  };

  // YouTube video page
  if (
    document.querySelectorAll('#player-container.ytd-watch-flexy').length > 0
  ) {
    // Timeline analysis for song number
    Array.from(document.querySelectorAll('.ytp-chapter-hover-container')).map(
      (section, index) => {
        const progressIndicator = section.querySelector(
          '.ytp-play-progress'
        ) as HTMLElement;

        if (progressIndicator) {
          const transform = window
            .getComputedStyle(progressIndicator, null)
            .getPropertyValue('transform');

          const scaleXMatch = transform.match(
            new RegExp('matrix\\([\\d\\.]+\\),')
          );
          if (scaleXMatch) {
            const parsedScaleX = parseFloat(scaleXMatch[1]);
            if (!isNaN(parsedScaleX) && parsedScaleX > 0 && parsedScaleX < 1) {
              youtubeScrapedSong.songNumber = index;
            }
          }
        }
      }
    );

    // Song name
    const songTitleElement = document.querySelector(
      '.ytp-chapter-title-content'
    ) as HTMLElement;
    if (songTitleElement) {
      youtubeScrapedSong.songName = songTitleElement.innerText;
    }

    // Album name
    const playlistTitleElement = document.querySelector(
      'h1.ytd-video-primary-info-renderer'
    ) as HTMLElement;

    if (playlistTitleElement) {
      youtubeScrapedSong.albumName = playlistTitleElement.innerText;
    }

    // Artist name
    const channelNameElement = document.querySelector(
      '#channel-name'
    ) as HTMLElement;

    if (channelNameElement) {
      const channelNameLinkElement = channelNameElement.querySelector(
        'a.yt-simple-endpoint.style-scope.yt-formatted-string'
      ) as HTMLElement;

      if (channelNameLinkElement) {
        youtubeScrapedSong.artistName = channelNameLinkElement.innerText;
      }
    }

    youtubeScrapedSong.albumUrl = window.location.href;

    if (!youtubeScrapedSong.songName) {
      youtubeScrapedSong.songName = youtubeScrapedSong.albumName;
    }

    // Timestamp
    const timestampElement = document.querySelector(
      '.ytp-time-current'
    ) as HTMLElement;

    if (timestampElement) {
      const timeLabel = timestampElement.innerText;
      const timeLabelParts = timeLabel.split(':');

      const [hoursOrMinutes, minutesOrSeconds, seconds] = timeLabelParts.map(
        (part) => parseInt(part, 10)
      );
      let timestamp: number | undefined = undefined;

      console.log({ timeLabel, seconds, timeLabelParts });

      if ((seconds || seconds === 0) && !isNaN(seconds)) {
        timestamp = seconds + minutesOrSeconds * 60 + hoursOrMinutes * 60 * 60;
      } else {
        timestamp = minutesOrSeconds + hoursOrMinutes * 60;
      }

      youtubeScrapedSong.timestamp = timestamp;
    }
  }

  return youtubeScrapedSong;
}
