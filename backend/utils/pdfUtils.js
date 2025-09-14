const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini client with your free API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Store PDF content in memory
let pdfContent = "";

// Function to store PDF content
const storePdfContent = (content) => {
  pdfContent = content;
};

// Function to generate chat response using Google Gemini (FREE)
const generateChatResponse = async (question) => {
  try {
    if (!pdfContent) {
      return "No PDF content available. Please upload a PDF first.";
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Truncate content to avoid token limits
    const truncatedContent =
      pdfContent.length > 3000
        ? pdfContent.substring(0, 3000) + "..."
        : pdfContent;

    const prompt = `Based on the following PDF content, please answer the user's question accurately:

PDF Content:
${truncatedContent}

User Question: ${question}

Please provide a helpful and concise answer based only on the information available in the PDF content. If the answer cannot be found in the PDF, please state that clearly.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating chat response:", error);

    // Handle specific Gemini errors
    if (error.message?.includes("API_KEY")) {
      return "Invalid API key. Please check your GEMINI_API_KEY in .env file.";
    } else if (error.message?.includes("quota")) {
      return "API quota exceeded. Please wait and try again.";
    } else if (error.message?.includes("SAFETY")) {
      return "Content was blocked for safety reasons. Please try rephrasing your question.";
    } else {
      return `Sorry, I encountered an error: ${error.message}`;
    }
  }
};

module.exports = {
  generateChatResponse,
  storePdfContent,
};
