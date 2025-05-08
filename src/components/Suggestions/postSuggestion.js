export default function postSuggestion(suggestionData) {
  console.log(suggestionData);

  return new Promise((resolve) => {
    console.log('asynchronous stuff...')
    setTimeout(() => resolve({ ok: Math.random() > 0.5 }), 2000);
  });
  
  // const functionUrl = "Environmental Variable";
  
  // const response = fetch(functionUrl, {
  //     method: "POST",
  //     headers: { "Content-Type": "text/plain" },
  //     body: JSON.stringify(suggestionData)
  // });

  // return response;
}