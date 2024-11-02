async function sendMessageToGemini(message) {
    try {
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CONFIG.GEMINI_API_KEY}`
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: message }] }]
            })
        });

        if (!response.ok) {
            throw new Error('Failed to get chatbot response');
        }

        const data = await response.json();
        console.log(data);
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Error getting chatbot response:', error);
        throw error;
    }
}

// //////////
// async function sendMessageToGemini(message) {
//     try {
//         const token = await getOAuthToken(); // Function to retrieve OAuth token
//         const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`  // OAuth 2.0 token
//             },
//             body: JSON.stringify({
//                 contents: [{ parts: [{ text: message }] }]
//             })
//         });

//         if (!response.ok) {
//             const errorText = await response.text();
//             console.error("Error response text:", errorText);
//             throw new Error('Failed to get chatbot response');
//         }

//         const data = await response.json();
//         console.log("Received data from Gemini:", data);
//         return data.candidates[0].content.parts[0].text;
//     } catch (error) {
//         console.error('Error getting chatbot response:', error);
//         throw error;
//     }
// }




/////////

function displayChatbotMessage(message) {
    const chatbox = document.getElementById('chatbox');
    const messageElement = document.createElement('p');
    messageElement.innerHTML = `<strong>Chatbot:</strong> ${message}`;
    chatbox.appendChild(messageElement);
    chatbox.scrollTop = chatbox.scrollHeight;
}

async function handleUserMessage() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();
    if (message) {
        const chatbox = document.getElementById('chatbox');
        const userMessageElement = document.createElement('p');
        userMessageElement.innerHTML = `<strong>You:</strong> ${message}`;
        chatbox.appendChild(userMessageElement);

        userInput.value = '';
        
        try {
            const response = await sendMessageToGemini(message);
            displayChatbotMessage(response);
        } catch (error) {
            displayChatbotMessage("I'm sorry, I couldn't process your request at the moment.");
        }
    }
}