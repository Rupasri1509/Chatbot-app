document.addEventListener("DOMContentLoaded", function() {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");

    const delay = ms => new Promise(res => setTimeout(res, ms));

   const welcomeMessages = [
    "Welcome to the Synonym & Antonym Chatbot! How can I assist you today?",
    "Hello there! I'm your Synonym & Antonym Chatbot. Feel free to ask me for synonyms and antonyms!",
    "Hi! I'm here to help you with synonyms and antonyms. What word would you like to explore?"
];

    async function displayWelcomeMessage(messages) {
        const randomIndex = Math.floor(Math.random() * messages.length);
        displayBotMessage(messages[randomIndex]);
    }

    displayWelcomeMessage(welcomeMessages);

    sendBtn.addEventListener("click", function() {
        const message = userInput.value.trim();
        if (message !== "") {
            displayUserMessage(message); // Display user message
            handleUserInput(message); // Handle user input
            userInput.value = "";
        }
    });

    function displayUserMessage(message) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message-container", "user-message-container");
        const userMessage = document.createElement("div");
        userMessage.classList.add("message", "user-message");
        userMessage.innerText = message; // User message
        messageElement.appendChild(userMessage);
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to bottom
    }

    async function displayBotMessage(message) {
        const typingIndicator = document.createElement("div");
        typingIndicator.classList.add("message", "bot-message", "typing");
        typingIndicator.innerText = "AI is typing...";
        chatBox.appendChild(typingIndicator);
        chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to bottom

        await delay(2000); // Simulate typing delay

        // Remove typing indicator
        typingIndicator.remove();

        const messageElement = document.createElement("div");
        messageElement.classList.add("message-container", "bot-message-container");
        const botMessage = document.createElement("div");
        botMessage.classList.add("message", "bot-message");
        botMessage.innerText = message; // Bot message
        messageElement.appendChild(botMessage);
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to bottom
    }

    function handleUserInput(word) {
        getSynonymsAndAntonyms(word);
    }

    async function getSynonymsAndAntonyms(word) {
        try {
            const synonymResponse = await fetch(`https://api.datamuse.com/words?rel_syn=${word}&max=1`);
            const synonymData = await synonymResponse.json();
            const antonymResponse = await fetch(`https://api.datamuse.com/words?rel_ant=${word}&max=1`);
            const antonymData = await antonymResponse.json();

            const synonym = synonymData.length > 0 ? synonymData[0].word : "No synonym found";
            const antonym = antonymData.length > 0 ? antonymData[0].word : "No antonym found";

            const meaningResponse = await fetch(`https://api.datamuse.com/words?sp=${word}&md=d`);
            const meaningData = await meaningResponse.json();
            const meaning = meaningData.length > 0 && meaningData[0].defs ? meaningData[0].defs[0] : "No meaning found";

            const message = `SYNONYM: ${synonym} (Meaning: ${meaning})\nANTONYM: ${antonym}`;
            displayBotMessage(message);
        } catch (error) {
            displayBotMessage("Sorry, something went wrong.");
        }
    }
});
