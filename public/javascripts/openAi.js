// const retrieveBotResponse = async (paragraphsArray) => {
//   try {
//     const response = await fetch('http://localhost:3000/search', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ paragraphsArray }),
//     });

//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }

//     const result = await response.json();
//     console.log(result.openaiResponse);
//     // Handle the OpenAI response as needed
//   } catch (error) {
//     console.error('Error:', error);
//   }
// };

const retrieveBotResponse = async (paragraphsArray) => {
  try {
    const response = await fetch('http://localhost:3000/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paragraphsArray }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const result = await response.json();
    // Handle the OpenAI response as needed

    return result.openaiResponse; // Return the OpenAI response if needed in your application
  } catch (error) {
    console.error('Error:', error);
    return null; // Return null or handle the error as needed
  }
};
