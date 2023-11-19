async function getMangaListByLatest(page: number, pageSize: number) {
  const comicsIdUrl = 'https://api.mangadex.org/chapter';
  const url = 'https://api.mangadex.org/manga';
  const userConfig = window.Rulia.getUserConfig();
  let language = userConfig.Language;
  if (!language) {
    language = '';
  } else {
    language = '&translatedLanguage[]=' + language
  }
  try {
    const comicsIdRawResponse = await window.Rulia.httpRequest({
      url: comicsIdUrl,
      method: 'GET',
      payload: 'limit=' + pageSize +
        '&offset=' + ((page - 1) * pageSize) +
        '&includes[]=user&includes[]=scanlation_group&includes[]=manga&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&order[readableAt]=desc' +
        language
    });
    const comicsIdResponse = JSON.parse(comicsIdRawResponse);
    let comicsIdList = [];
    for (let x of comicsIdResponse.data) {
      comicsIdList.push(x.relationships[1].id);
    }
    let payload = '';
    for (let i = 0; i < comicsIdList.length; i++) {
      payload += 'ids[]=' + comicsIdList[i];
      if (i < (comicsIdList.length - 1)) {
        payload += '&';
      } else {
        payload += '&includes[]=cover_art';
      }
    }
    const rawResponse = await window.Rulia.httpRequest({
      url: url,
      method: 'GET',
      payload: payload
    });
    const response = JSON.parse(rawResponse);
    let result = {
      list: []
    }
    for (let manga of response.data) {
      let comicTitle = '';
      for (let comic in manga.attributes.title) {
        comicTitle = manga.attributes.title[comic];
        break;
      }
      const mangaDetailString = JSON.stringify(manga.relationships);
      const regex = /"fileName":\s*"(.*?)"/;
      const match: RegExpMatchArray | any = mangaDetailString.match(regex);

      let fileName = match[1];

      // @ts-ignore TS(2403) FIXME: Subsequent variable declarations must have the sam... Remove this comment to see the full error message
      let comic = {
        title: comicTitle,
        url: 'https://www.mangadex.org/title/' + manga.id,
        coverUrl: 'https://mangadex.org/covers/' + manga.id + '/' + fileName + '.256.jpg'
      }
      // @ts-ignore TS(2345) FIXME: Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
      result.list.push(comic)
    }
    window.Rulia.endWithResult(result);
  } catch (error: any) {
    window.Rulia.endWithException(error.message);
  }
}

async function getMangaListBySearching(page: number, pageSize: number, keyword: string) {
  const comicsIdUrl = 'https://api.mangadex.org/manga';
  const url = 'https://api.mangadex.org/manga';
  try {
    const comicsIdRawResponse = await window.Rulia.httpRequest({
      url: comicsIdUrl,
      method: 'GET',
      payload: 'limit=' + pageSize + '&offset=' + ((page - 1) * pageSize) +
        '&includes[]=cover_art&includes[]=artist&includes[]=author&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&title=' +
        keyword + '&includedTagsMode=AND&excludedTagsMode=OR'
    });
    const comicsIdResponse = JSON.parse(comicsIdRawResponse);
    let comicsIdList = [];
    for (let x of comicsIdResponse.data) {
      comicsIdList.push(x.id);
    }
    let payload = '';
    for (let i = 0; i < comicsIdList.length; i++) {
      payload += 'ids[]=' + comicsIdList[i];
      if (i < (comicsIdList.length - 1)) {
        payload += '&';
      } else {
        payload += '&includes[]=cover_art';
      }
    }
    const rawResponse = await window.Rulia.httpRequest({
      url: url,
      method: 'GET',
      payload: payload
    });
    const response = JSON.parse(rawResponse);
    let result = {
      list: []
    }
    for (let manga of response.data) {
      let comicTitle = '';
      for (let comic in manga.attributes.title) {
        comicTitle = manga.attributes.title[comic];
        break;
      }
      const mangaDetailString = JSON.stringify(manga.relationships);
      const regex = /"fileName":\s*"(.*?)"/;
      const match: RegExpMatchArray | any = mangaDetailString.match(regex);
      let fileName = match[1];
      // @ts-ignore TS(2403) FIXME: Subsequent variable declarations must have the sam... Remove this comment to see the full error message
      let comic = {
        title: comicTitle,
        url: 'https://www.mangadex.org/title/' + manga.id,
        coverUrl: 'https://mangadex.org/covers/' + manga.id + '/' + fileName + '.256.jpg'
      }
      // @ts-ignore TS(2345) FIXME: Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
      result.list.push(comic)
    }
    window.Rulia.endWithResult(result);
  } catch (error: any) {
    window.Rulia.endWithException(error.message);
  }
}

async function getMangaList(page: number, pageSize: number, keyword: string) {
  if (keyword) {
    return await getMangaListBySearching(page, pageSize, keyword);
  } else {
    return await getMangaListByLatest(page, pageSize);
  }
}

async function getMangaData(dataPageUrl: any) {
  const seasonIdMatchExp = /\/([0-9a-fA-F-]+)(\/|$|\?)/;
  const seasonIdMatch = dataPageUrl.match(seasonIdMatchExp);
  const detailUrl = 'https://api.mangadex.org/manga/' + seasonIdMatch[1];
  const chapterListUrl = 'https://api.mangadex.org/manga/' + seasonIdMatch[1] + '/feed';
  const comicsIdUrl = 'https://api.mangadex.org/manga';
  const url = 'https://api.mangadex.org/manga';
  const userConfig = window.Rulia.getUserConfig();
  let language = userConfig.Language;
  if (!language) {
    language = '';
  } else {
    language = '&translatedLanguage[]=' + language
  }
  try {
    const detailRawResponse = await window.Rulia.httpRequest({
      url: detailUrl,
      method: 'GET',
      payload: 'includes[]=artist&includes[]=author&includes[]=cover_art' + language
    })
    const detailResponse = JSON.parse(detailRawResponse);
    let comicTitle = '';
    let comicDescription = '';
    for (let comic in detailResponse.data.attributes.title) {
      comicTitle = detailResponse.data.attributes.title[comic];
      break;
    }
    for (let comic in detailResponse.data.attributes.description) {
      comicDescription = detailResponse.data.attributes.description[comic];
      break;
    }
    const mangaDetailString = JSON.stringify(detailResponse.data.relationships);
    const regex = /"fileName":\s*"(.*?)"/;
    const match: RegExpMatchArray | any = mangaDetailString.match(regex);
    let comicCover = 'https://mangadex.org/covers/' + seasonIdMatch[1] + '/' + match[1] + '.256.jpg';
    let result = {
      title: comicTitle,
      description: comicDescription,
      coverUrl: comicCover,
      chapterList: []
    }
    const chapterListRawResponse = await window.Rulia.httpRequest({
      url: chapterListUrl,
      method: 'GET',
      payload: 'limit=500&includes[]=scanlation_group&includes[]=user&order[volume]=desc&order[chapter]=desc&offset=0&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&contentRating[]=pornographic' +
        language
    });
    const chapterListResponse = JSON.parse(chapterListRawResponse);
    for (let manga of chapterListResponse.data) {
      let translatedLanguage = manga.attributes.translatedLanguage.charAt(0).toUpperCase() + manga.attributes
        .translatedLanguage.slice(1);
      let title = manga.attributes.title ? '[' + manga.attributes.title + ']' : '';
      let chapter = manga.attributes.chapter.length === 1 ? '0' + manga.attributes.chapter : manga.attributes
        .chapter;
      let updatedAt = new Date(manga.attributes.updatedAt).toISOString().split('T')[0].replace(/-/g, '/');
      // @ts-ignore TS(2403) FIXME: Subsequent variable declarations must have the sam... Remove this comment to see the full error message
      let comic = {
        title: '[' + translatedLanguage + '][' + chapter + ']' + title + '[' +
          updatedAt + ']',
        url: 'https://mangadex.org/chapter/' + manga.id
      }
      // @ts-ignore TS(2345) FIXME: Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
      result.chapterList.push(comic);
    }
    window.Rulia.endWithResult(result);
  } catch (error: any) {
    window.Rulia.endWithException(error.message);
  }
}

async function getChapterImageList(chapterUrl: any) {
  const episodeIdMatchExp = /\/chapter\/([0-9a-fA-F-]+)(\/|$|\?)/;
  const episodeIdMatch = chapterUrl.match(episodeIdMatchExp);
  const url = 'https://api.mangadex.org/at-home/server/' + episodeIdMatch[1];
  const rawResponse = await window.Rulia.httpRequest({
    url: url,
    method: 'GET',
    payload: 'forcePort443=false'
  });
  const response = JSON.parse(rawResponse);
  let result = [];
  for (let manga of response.chapter.data) {
    result.push({
      url: 'https://uploads.mangadex.org/data/' + response.chapter.hash + '/' + manga,
      width: 1,
      height: 1
    });
  }
  window.Rulia.endWithResult(result);
}

async function getImageUrl(path: string) {
  window.Rulia.endWithResult(path);
}
