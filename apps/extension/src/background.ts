import { checkBandcampDom } from './check-bandcamp-dom';
import getBandcampSongName from './get-bandcamp-song-name';
import getYouTubeSongName from './get-youtube-song-name';

// Use chrome.alarms instead of setInterval for service workers
chrome.alarms.create('checkSong', { periodInMinutes: 5 / 60 }); // 5 seconds

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'checkSong') {
    console.log('checking for song');
    try {
      const tab = await findTab();

      // Inject the appropriate scraping function directly
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id! },
        func: /youtube\.com/.test(tab.url!)
          ? getYouTubeSongName
          : getBandcampSongName,
      });

      console.log('scrapedSong', results[0].result);
      if (results[0].result) {
        await postData('http://localhost:4242/api/song', results[0].result);
      }
    } catch (error) {
      console.log('something has gone terribly wrong', error);
    }
  }
});

interface Tab {
  id?: number;
  url?: string;
  title?: string;
  audible?: boolean;
}

function findTab(): Promise<Tab> {
  return new Promise((resolve, reject) => {
    chrome.tabs.query(
      {
        audible: true,
      },
      async (tabs) => {
        console.log('query result: ', tabs);

        if (!tabs.length) {
          reject('Error: No audible tabs were found.');
          console.log('Error: No audible tabs were found.');
          return;
        }

        // Create promise array
        const promises = tabs.map(async (tab) => {
          console.log('tabUrl', tab.url);
          if (/youtube\.com/.test(tab.url!)) {
            console.log('youtube link?');
            return tab;
          } else if (/bandcamp\.com/.test(tab.url!)) {
            return tab;
          } else {
            // Check for bandcamp generated custom domains
            return await customDomain(tab);
          }
        });

        // Check promises for allowed domains and resolve tab if found or alert/reject if none
        try {
          const results = await Promise.all(promises);
          const validTab = results.find((element) => element !== false);
          if (validTab) {
            resolve(validTab as Tab);
          } else {
            reject('Error: No bandcamp tabs were found.');
            console.log('Error: No bandcamp tabs were found.');
          }
        } catch (error) {
          reject(error);
        }
      }
    );
  });
}

// Setup bandcamp custom domains checker
const customDomain = async (tab: Tab): Promise<Tab | false> => {
  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id! },
      func: checkBandcampDom,
    });

    console.log(results[0].result);
    const customDomainResult = results[0].result as { isBandcamp?: boolean };
    const isBandcamp = customDomainResult?.isBandcamp;
    if (isBandcamp) {
      console.log('bandcamp custom:', tab.title);
      return tab;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error checking custom domain:', error);
    return false;
  }
};

// From: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
const postData = async (url: string = ``, data: any = {}) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      redirect: 'follow',
      referrer: 'no-referrer',
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    console.error(`Fetch Error =\n`, error);
  }
};
