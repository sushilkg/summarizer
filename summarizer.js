import {getMaxLengthToSummarize, getOpenAIKey, getPromptQuestion} from "./background.js";

const getSummaryFromArticle = async (article) => {
    if (!article) {
        return "Article not found. Please wait for the page to finish loading, or try reloading the page."
    }

    const openAIKey = await getOpenAIKey();
    if (!openAIKey) {
        return "No OpenAI key provided. Please provide a valid OpenAI API key from the options page."
    }

    let question = await getPromptQuestion();
    if (!question) {
        return "Summarize this article"
    }

    let maxLength = await getMaxLengthToSummarize();
    if (!maxLength) {
        maxLength = 5000;
    }

    if (article.length > maxLength) {
        article = article.substring(0, parseInt(maxLength));
    }

    return await generateSummary(article, question, openAIKey);
}

const generateSummary = async (article, question, token) => {
    const body = {
        messages: [{
            role: "system", content: "You are a helpful assistant.",
        }, {
            role: "user", content: `${question}: ${article}`,
        },], model: "gpt-3.5-turbo",
    };

    const reqBodyBytes = JSON.stringify(body);
    const url = `https://api.openai.com/v1/chat/completions`;

    const requestOptions = {
        method: "POST", headers: {
            "Content-Type": "application/json", "Authorization": `Bearer ${token}`,
        }, body: reqBodyBytes,
    };

    try {
        const response = await fetch(url, requestOptions);
        const responseBody = await response.json();

        if (response.ok) {
            if (responseBody && responseBody.choices && responseBody.choices.length > 0) {
                return responseBody.choices[0].message.content.trim();
            } else {
                return "No choices available in the response.";
            }
        } else {
            if (responseBody.error && responseBody.error.code) {
                return responseBody.error.code;
            } else {
                return "Unexpected error occurred.";
            }
        }
    } catch (error) {
        return `Error during the generating summary: ${error.message}`;
    }
}

export {
    getSummaryFromArticle,
}