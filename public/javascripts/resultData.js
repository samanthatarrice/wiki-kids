const getReadingLevel = () => {
  const readingLevel = document.querySelector('#readingLevel').value;
  return readingLevel
}

const retrieveEntry = async (resultTitle) => {
  const wikiEntryString = getWikiEntryString(resultTitle);
  const htmlString = await getWikiEntryHtml(wikiEntryString);
  const wikiArray = parseWikiHtml(htmlString)
  const botResponse = await retrieveBotResponse(wikiArray, resultTitle, getReadingLevel());
  return botResponse.choices[0].message.content;
};

const getWikiEntryString = (resultTitle) => {
  return 'https://en.wikipedia.org/w/api.php?' +
    new URLSearchParams({
      origin: '*',
      action: 'parse',
      page: resultTitle,
      format: 'json',
    });
};

const getWikiEntryHtml = async (url) => {
  try {
    const req = await fetch(url);
    const json = await req.json();

    if (json.parse && json.parse.text) {
      const htmlString = json.parse.text['*'];
      return htmlString;
    } else {
      console.error('Invalid JSON structure:', json);
    }
  } catch (e) {
    console.error(e);
  }
};

const parseWikiParagraphs = (htmlString) => {
  // Convert html into object:
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  const paragraphs = doc.querySelectorAll('p');
  const paragraphsArray = [];
  for (const paragraph of paragraphs) {
    paragraphsArray.push(paragraph.textContent);
  }
  return paragraphsArray;
};

const parseWikiHtml = (htmlString) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  const wikiArray = [{ subtitle: 'Summary', text: [] }];

  // Flag to track when to stop pushing 'p' elements
  let stopPushing = false;

  const pElements = doc.querySelectorAll('p');

  pElements.forEach((pElement) => {
    if (stopPushing) {
      return;
    }

    // Check if there is a previousElementSibling and if it is an 'h2'
    const prevElement = pElement.previousElementSibling;
    if (prevElement && prevElement.tagName.toLowerCase() === 'h2') {
      stopPushing = true;
      return;
    }

    wikiArray[0].text.push(pElement.textContent.trim());
  });

  const h2Elements = doc.querySelectorAll('h2');

  h2Elements.forEach((h2Element) => {
    const firstSpan = h2Element.querySelector('span');

    // Exclude subtitles like 'See Also', 'Notes', and 'References'
    const subtitle = firstSpan
      ? firstSpan.textContent.trim()
      : h2Element.textContent.trim();

    if (
      subtitle.includes('See also') ||
      subtitle.includes('Notes') ||
      subtitle.includes('References')
    ) {
      return;
    }

    const section = {
      subtitle: subtitle,
      text: [],
    };

    let nextElement = h2Element.nextElementSibling;
    while (nextElement && nextElement.tagName.toLowerCase() !== 'h2') {
      if (nextElement.tagName.toLowerCase() === 'p') {
        section.text.push(nextElement.textContent.trim());
      }
      nextElement = nextElement.nextElementSibling;
    }

    wikiArray.push(section);
  });

  console.log('wikiArray:', wikiArray);
  console.log(typeof wikiArray)
  return wikiArray;
};
