scrapedSong = {
  source: "youtube",
};

// Bandcamp singles && album pages
// example album: https://lorn.bandcamp.com/album/the-maze-to-nowhere
// example single: https://lorn.bandcamp.com/track/acid-rain
if (document.querySelectorAll("#player-container.ytd-watch-flexy").length > 0) {
  // timeline analysis for song number
  Array.from(document.querySelectorAll(".ytp-chapter-hover-container")).map(
    (section, index) => {
      const progressIndicator = section.querySelector(".ytp-play-progress");

      const transform = window
        .getComputedStyle(progressIndicator, null)
        .getPropertyValue("transform");

      const scaleX = transform.match(new RegExp("matrix\\(([\\d\\.]+),"));
      const parsedScaleX = parseFloat(scaleX);
      if (!isNaN(parsedScaleX) && parsedScaleX > 0 && parsedScaleX < 1) {
        scrapedSong.songNumber = index;
      }
    }
  );

  // song name
  const songTitleElement = document.querySelector(".ytp-chapter-title-content");
  if (songTitleElement) {
    scrapedSong.songName = songTitleElement.innerText;
  }

  const playlistTitleElement = document.querySelector(
    "h1.ytd-video-primary-info-renderer"
  );

  scrapedSong.albumName = playlistTitleElement.innerText;

  const channelNameElement = document.querySelector("#channel-name");

  const channelNameLinkElement = channelNameElement.querySelector(
    "a.yt-simple-endpoint.style-scope.yt-formatted-string"
  );

  if (channelNameLinkElement) {
    scrapedSong.artistName = channelNameLinkElement.innerText;
  }

  scrapedSong.albumURL = window.location.href;

  if (!scrapedSong.songName) {
    scrapedSong.songName = scrapedSong.albumName;
  }
}
scrapedSong;
