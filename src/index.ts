async function getMangaListByLatest(page: any, pageSize: any) {
  const comicsIdUrl = 'https://api.mangadex.org/chapter';
  const url = 'https://api.mangadex.org/manga';

  // @ts-ignore TS(2339) FIXME: Property 'Rulia' does not exist on type 'Window & ... Remove this comment to see the full error message
  const userConfig = window.Rulia.getUserConfig();
  let language = userConfig.Language;
  if (!language) {
    language = '';
  } else {
    language = '&translatedLanguage[]=' + language
  }
  try {
    
    // @ts-ignore TS(2339) FIXME: Property 'Rulia' does not exist on type 'Window & ... Remove this comment to see the full error message
    const comicsIdRawResponse = await window.Rulia.httpRequest({
      url: comicsIdUrl,
      method: 'GET',
      payload: 'limit=' + pageSize +
        '&offset=' + ((page - 1) * pageSize) +
        '&includes[]=user&includes[]=scanlation_group&includes[]=manga&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&order[readableAt]=desc' +
        language
    });
    const comicsIdResponse = JSON.parse(comicsIdRawResponse);
    var comicsIdList = [];
    for (var x of comicsIdResponse.data) {
      comicsIdList.push(x.relationships[1].id);
    }
    var payload = '';

    for (var i = 0; i < comicsIdList.length; i++) {
      payload += 'ids[]=' + comicsIdList[i];
      if (i < (comicsIdList.length - 1)) {
        payload += '&';
      } else {
        payload += '&includes[]=cover_art';
      }
    }

    // @ts-ignore TS(2339) FIXME: Property 'Rulia' does not exist on type 'Window & ... Remove this comment to see the full error message
    const rawResponse = await window.Rulia.httpRequest({
      url: url,
      method: 'GET',
      payload: payload
    });
    const response = JSON.parse(rawResponse);
    var result = {
      list: []
    }


    for (var manga of response.data) {
      var comicTitle = '';


      for (var comic in manga.attributes.title) {


        comicTitle = manga.attributes.title[comic];
        break;
      }


      const mangaDetailString = JSON.stringify(manga.relationships);
      const regex = /"fileName":\s*"(.*?)"/;
      const match = mangaDetailString.match(regex);

      // @ts-ignore TS(2531) FIXME: Object is possibly 'null'.
      let fileName = match[1];

      // @ts-ignore TS(2403) FIXME: Subsequent variable declarations must have the sam... Remove this comment to see the full error message
      var comic = {
        title: comicTitle,


        url: 'https://www.mangadex.org/title/' + manga.id,


        coverUrl: 'https://mangadex.org/covers/' + manga.id + '/' + fileName + '.256.jpg'
      }

      // @ts-ignore TS(2345) FIXME: Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
      result.list.push(comic)
    }

    // @ts-ignore TS(2339) FIXME: Property 'Rulia' does not exist on type 'Window & ... Remove this comment to see the full error message
    window.Rulia.endWithResult(result);
  } catch (error) {

    // @ts-ignore TS(2339) FIXME: Property 'Rulia' does not exist on type 'Window & ... Remove this comment to see the full error message
    window.Rulia.endWithException(error.message);
  }
}

async function getMangaListBySearching(page: any, pageSize: any, keyword: any) {
  const comicsIdUrl = 'https://api.mangadex.org/manga';
  const url = 'https://api.mangadex.org/manga';
  try {

    // @ts-ignore TS(2339) FIXME: Property 'Rulia' does not exist on type 'Window & ... Remove this comment to see the full error message
    const comicsIdRawResponse = await window.Rulia.httpRequest({
      url: comicsIdUrl,
      method: 'GET',
      payload: 'limit=' + pageSize + '&offset=' + ((page - 1) * pageSize) +
        '&includes[]=cover_art&includes[]=artist&includes[]=author&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&title=' +
        keyword + '&includedTagsMode=AND&excludedTagsMode=OR'
    });
    const comicsIdResponse = JSON.parse(comicsIdRawResponse);
    var comicsIdList = [];
    for (var x of comicsIdResponse.data) {
      comicsIdList.push(x.id);
    }
    var payload = '';

    for (var i = 0; i < comicsIdList.length; i++) {
      payload += 'ids[]=' + comicsIdList[i];
      if (i < (comicsIdList.length - 1)) {
        payload += '&';
      } else {
        payload += '&includes[]=cover_art';
      }
    }

    // @ts-ignore TS(2339) FIXME: Property 'Rulia' does not exist on type 'Window & ... Remove this comment to see the full error message
    const rawResponse = await window.Rulia.httpRequest({
      url: url,
      method: 'GET',
      payload: payload
    });
    const response = JSON.parse(rawResponse);
    var result = {
      list: []
    }


    for (var manga of response.data) {
      var comicTitle = '';


      for (var comic in manga.attributes.title) {


        comicTitle = manga.attributes.title[comic];
        break;
      }


      const mangaDetailString = JSON.stringify(manga.relationships);
      const regex = /"fileName":\s*"(.*?)"/;
      const match = mangaDetailString.match(regex);

      // @ts-ignore TS(2531) FIXME: Object is possibly 'null'.
      let fileName = match[1];

      // @ts-ignore TS(2403) FIXME: Subsequent variable declarations must have the sam... Remove this comment to see the full error message
      var comic = {
        title: comicTitle,


        url: 'https://www.mangadex.org/title/' + manga.id,


        coverUrl: 'https://mangadex.org/covers/' + manga.id + '/' + fileName + '.256.jpg'
      }

      // @ts-ignore TS(2345) FIXME: Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
      result.list.push(comic)
    }

    // @ts-ignore TS(2339) FIXME: Property 'Rulia' does not exist on type 'Window & ... Remove this comment to see the full error message
    window.Rulia.endWithResult(result);
  } catch (error) {

    // @ts-ignore TS(2339) FIXME: Property 'Rulia' does not exist on type 'Window & ... Remove this comment to see the full error message
    window.Rulia.endWithException(error.message);
  }
}


// @ts-ignore TS(7006) FIXME: Parameter 'page' implicitly has an 'any' type.
async function getMangaList(page, pageSize, keyword) {
  if (keyword) {
    return await getMangaListBySearching(page, pageSize, keyword);
  } else {
    return await getMangaListByLatest(page, pageSize);
  }
}


// @ts-ignore TS(7006) FIXME: Parameter 'dataPageUrl' implicitly has an 'any' ty... Remove this comment to see the full error message
async function getMangaData(dataPageUrl) {
  const seasonIdMatchExp = /\/([0-9a-fA-F-]+)(\/|$|\?)/;
  const seasonIdMatch = dataPageUrl.match(seasonIdMatchExp);
  const detailUrl = 'https://api.mangadex.org/manga/' + seasonIdMatch[1];
  const chapterListUrl = 'https://api.mangadex.org/manga/' + seasonIdMatch[1] + '/feed';
  const comicsIdUrl = 'https://api.mangadex.org/manga';
  const url = 'https://api.mangadex.org/manga';

  // @ts-ignore TS(2339) FIXME: Property 'Rulia' does not exist on type 'Window & ... Remove this comment to see the full error message
  const userConfig = window.Rulia.getUserConfig();
  let language = userConfig.Language;
  if (!language) {
    language = '';
  } else {
    language = '&translatedLanguage[]=' + language
  }
  try {

    // @ts-ignore TS(2339) FIXME: Property 'Rulia' does not exist on type 'Window & ... Remove this comment to see the full error message
    const detailRawResponse = await window.Rulia.httpRequest({
      url: detailUrl,
      method: 'GET',
      payload: 'includes[]=artist&includes[]=author&includes[]=cover_art' + language
    })
    const detailResponse = JSON.parse(detailRawResponse);
    let comicTitle = '';
    let comicDescription = '';
    for (var comic in detailResponse.data.attributes.title) {
      comicTitle = detailResponse.data.attributes.title[comic];
      break;
    }
    for (var comic in detailResponse.data.attributes.description) {
      comicDescription = detailResponse.data.attributes.description[comic];
      break;
    }
    const mangaDetailString = JSON.stringify(detailResponse.data.relationships);
    const regex = /"fileName":\s*"(.*?)"/;
    const match = mangaDetailString.match(regex);

    // @ts-ignore TS(2531) FIXME: Object is possibly 'null'.
    let comicCover = 'https://mangadex.org/covers/' + seasonIdMatch[1] + '/' + match[1] + '.256.jpg';
    var result = {
      title: comicTitle,
      description: comicDescription,
      coverUrl: comicCover,
      chapterList: []
    }

    // @ts-ignore TS(2339) FIXME: Property 'Rulia' does not exist on type 'Window & ... Remove this comment to see the full error message
    const chapterListRawResponse = await window.Rulia.httpRequest({
      url: chapterListUrl,
      method: 'GET',
      payload: 'limit=500&includes[]=scanlation_group&includes[]=user&order[volume]=desc&order[chapter]=desc&offset=0&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&contentRating[]=pornographic' +
        language
    });
    const chapterListResponse = JSON.parse(chapterListRawResponse);
    for (var manga of chapterListResponse.data) {
      let translatedLanguage = manga.attributes.translatedLanguage.charAt(0).toUpperCase() + manga.attributes
        .translatedLanguage.slice(1);
      let title = manga.attributes.title ? '[' + manga.attributes.title + ']' : '';
      let chapter = manga.attributes.chapter.length === 1 ? '0' + manga.attributes.chapter : manga.attributes
        .chapter;
      let updatedAt = new Date(manga.attributes.updatedAt).toISOString().split('T')[0].replace(/-/g, '/');

      // @ts-ignore TS(2403) FIXME: Subsequent variable declarations must have the sam... Remove this comment to see the full error message
      var comic = {
        title: '[' + translatedLanguage + '][' + chapter + ']' + title + '[' +
          updatedAt + ']',
        url: 'https://mangadex.org/chapter/' + manga.id
      }

      // @ts-ignore TS(2345) FIXME: Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
      result.chapterList.push(comic);
    }

    // @ts-ignore TS(2339) FIXME: Property 'Rulia' does not exist on type 'Window & ... Remove this comment to see the full error message
    window.Rulia.endWithResult(result);
  } catch (error) {

    // @ts-ignore TS(2339) FIXME: Property 'Rulia' does not exist on type 'Window & ... Remove this comment to see the full error message
    window.Rulia.endWithException(error.message);
  }
}


// @ts-ignore TS(7006) FIXME: Parameter 'chapterUrl' implicitly has an 'any' typ... Remove this comment to see the full error message
async function getChapterImageList(chapterUrl) {
  const episodeIdMatchExp = /\/chapter\/([0-9a-fA-F-]+)(\/|$|\?)/;
  const episodeIdMatch = chapterUrl.match(episodeIdMatchExp);
  const url = 'https://api.mangadex.org/at-home/server/' + episodeIdMatch[1];

  // @ts-ignore TS(2339) FIXME: Property 'Rulia' does not exist on type 'Window & ... Remove this comment to see the full error message
  const rawResponse = await window.Rulia.httpRequest({
    url: url,
    method: 'GET',
    payload: 'forcePort443=false'
  });
  const response = JSON.parse(rawResponse);
  var result = [];



  for (var manga of response.chapter.data) {
    result.push({


      url: 'https://uploads.mangadex.org/data/' + response.chapter.hash + '/' + manga,
      width: 1,
      height: 1
    });
  }

  // @ts-ignore TS(2339) FIXME: Property 'Rulia' does not exist on type 'Window & ... Remove this comment to see the full error message
  window.Rulia.endWithResult(result);
}

// @ts-ignore TS(7006) FIXME: Parameter 'path' implicitly has an 'any' type.
async function getImageUrl(path) {

  // @ts-ignore TS(2339) FIXME: Property 'Rulia' does not exist on type 'Window & ... Remove this comment to see the full error message
  window.Rulia.endWithResult(path);
}
