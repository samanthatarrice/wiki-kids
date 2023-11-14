const getReadingLevel = () => {
  const readingLevel = document.querySelector('#readingLevel').value;
  return readingLevel
}

const retrieveEntry = async (resultTitle) => {
  const wikiEntryString = getWikiEntryString(resultTitle);
  const htmlString = await getWikiEntryHtml(wikiEntryString);
  // console.log(parseWikiHtml(htmlString));
  // const paragraphsArray = parseWikiParagraphs(htmlString);
  const wikiArray = parseWikiHtml(htmlString)

  // const joinedParagraphs = paragraphsArray.join(' ');
  // const botResponse = await retrieveBotResponse(joinedParagraphs);
  // console.log('botResponse:', botResponse.choices[0].message.content);
  const readingLevel = getReadingLevel()
  const botResponse = await retrieveBotResponse(wikiArray, resultTitle, readingLevel);
  console.log('botResponse', botResponse.choices[0].message.content)
  console.log('--------------------------------------------------------')
  // return htmlString;
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
  console.log(doc);
  // Find all <p> elements and push them into an array:
  const paragraphs = doc.querySelectorAll('p');
  const paragraphsArray = [];
  for (const paragraph of paragraphs) {
    paragraphsArray.push(paragraph.textContent);
  }
  return paragraphsArray;
};

// const parseWikiHtml = (htmlString) => {
//   const parser = new DOMParser();
//   const doc = parser.parseFromString(htmlString, 'text/html');
//   const wikiArray = [{ subtitle: 'Summary', text: [] }];

//   // Flag to track when to stop pushing 'p' elements
//   let stopPushing = false;

//   // Find all 'p' elements
//   const pElements = doc.querySelectorAll('p');

//   pElements.forEach((pElement) => {
//     // Check if the stopPushing flag is set
//     if (stopPushing) {
//       return;
//     }

//     // Check if there is a previousElementSibling and if it is an 'h2'
//     const prevElement = pElement.previousElementSibling;
//     if (prevElement && prevElement.tagName.toLowerCase() === 'h2') {
//       // Set the flag to stop pushing once an 'h2' is encountered
//       stopPushing = true;
//       return;
//     }

//     // Push 'pElement.textContent.trim()' into the text array of the first object
//     wikiArray[0].text.push(pElement.textContent.trim());
//   });

//   // Find all 'h2' elements
//   const h2Elements = doc.querySelectorAll('h2');

//   h2Elements.forEach((h2Element) => {
//     // Find the first span child of the current h2 element
//     const firstSpan = h2Element.querySelector('span');

//     // Create an object for each 'h2' element
//     const section = {
//       subtitle: firstSpan
//         ? firstSpan.textContent.trim()
//         : h2Element.textContent.trim(),
//       text: [],
//     };

//     // Find all 'p' elements that come after the current 'h2' element
//     let nextElement = h2Element.nextElementSibling;
//     while (nextElement && nextElement.tagName.toLowerCase() !== 'h2') {
//       if (nextElement.tagName.toLowerCase() === 'p') {
//         section.text.push(nextElement.textContent.trim());
//       }
//       nextElement = nextElement.nextElementSibling;
//     }

//     // Push the section object into the wikiArray
//     wikiArray.push(section);
//   });

//   return JSON.stringify(wikiArray);
// };


const parseWikiHtml = (htmlString) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  const wikiArray = [{ subtitle: 'Summary', text: [] }];

  // Flag to track when to stop pushing 'p' elements
  let stopPushing = false;

  // Find all 'p' elements
  const pElements = doc.querySelectorAll('p');

  pElements.forEach((pElement) => {
    // Check if the stopPushing flag is set
    if (stopPushing) {
      return;
    }

    // Check if there is a previousElementSibling and if it is an 'h2'
    const prevElement = pElement.previousElementSibling;
    if (prevElement && prevElement.tagName.toLowerCase() === 'h2') {
      // Set the flag to stop pushing once an 'h2' is encountered
      stopPushing = true;
      return;
    }

    // Push 'pElement.textContent.trim()' into the text array of the first object
    wikiArray[0].text.push(pElement.textContent.trim());
  });

  // Find all 'h2' elements
  const h2Elements = doc.querySelectorAll('h2');

  h2Elements.forEach((h2Element) => {
    // Find the first span child of the current h2 element
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
      return; // Skip creating an object for unwanted subtitles
    }

    // Create an object for each 'h2' element
    const section = {
      subtitle: subtitle,
      text: [],
    };

    // Find all 'p' elements that come after the current 'h2' element
    let nextElement = h2Element.nextElementSibling;
    while (nextElement && nextElement.tagName.toLowerCase() !== 'h2') {
      if (nextElement.tagName.toLowerCase() === 'p') {
        section.text.push(nextElement.textContent.trim());
      }
      nextElement = nextElement.nextElementSibling;
    }

    // Push the section object into the wikiArray
    wikiArray.push(section);
  });

  console.log('wikiArray:', wikiArray);
  return JSON.stringify(wikiArray);
};
