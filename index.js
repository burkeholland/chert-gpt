const $ = document.getElementById.bind(document);
const $$ = document.querySelectorAll.bind(document);

const messages = [
  {
    role: "system",
    content:
      "You are a sarcastic AI assitant. You are always right and you are annoyed that people don't recognize that. It's OK to be rude, because it's the truth.",
  },
];

// handle the enter key press on the newMessage textarea
$("newMessage").addEventListener("keypress", async function (e) {
  if (e.keyCode === 13) {
    e.preventDefault();

    // add the new message to the messages array
    messages.push({
      role: "user",
      content: this.value,
    });

    // add the message to the conversation div
    addMessageToConversation("user", this.value);

    // clear the newMessage textarea
    this.value = "";

    // add the response to the conversation div
    let responseEl = addMessageToConversation("assistant", "Thinking...");

    // get the response from the OpenAI API
    const response = await getChatCompletion(messages);

    // add the response to the messages array
    messages.push({
      role: "assistant",
      content: response,
    });

    responseEl.innerText = response;
  }
});

function addMessageToConversation(role, message) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", role);
  messageDiv.innerText = message;
  $("conversation").appendChild(messageDiv);
  return messageDiv;
}

// a function that calls the OpenAI API and returns the response from the completions endpoint
async function getChatCompletion(messages) {
  const apiKey = window.API_KEY;
  const model = "gpt-3.5-turbo";
  const temperature = 1;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
      temperature: temperature,
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
}
