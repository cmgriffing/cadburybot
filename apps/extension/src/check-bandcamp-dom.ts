interface CustomDomainMetaData {
  isBandcamp: boolean;
}

export function checkBandcampDom() {
  let customDomainMetaData: CustomDomainMetaData = { isBandcamp: false };

  const generatorMeta = document.querySelector(
    'meta[name="generator"]'
  ) as HTMLMetaElement;
  const twitterSiteMeta = document.querySelector(
    'meta[name="twitter:site"]'
  ) as HTMLMetaElement;

  if (generatorMeta && generatorMeta.content === 'Bandcamp') {
    customDomainMetaData.isBandcamp = true;
  }

  if (twitterSiteMeta && twitterSiteMeta.content === '@bandcamp') {
    customDomainMetaData.isBandcamp = true;
  }

  return customDomainMetaData;
}
