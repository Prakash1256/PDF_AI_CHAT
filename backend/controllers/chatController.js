const pdfService = require('../services/pdfService');
const { generateChatResponse, storePdfContent } = require('../utils/pdfUtils');

// Handle PDF upload
const uploadPdf = async (req, res) => {
  try {
    const file = req.file;
    const pdfData = await pdfService.extractText(file.path);
    
    // Store the PDF content for chat responses
    storePdfContent(pdfData.text);
    
    res.json({ 
      numPages: pdfData.numPages, 
      text: pdfData.text,
      message: "PDF uploaded successfully and ready for questions!"
    });
  } catch (error) {
    console.error('Error processing PDF:', error);
    res.status(500).json({ 
      error: 'Error processing PDF',
      details: error.message 
    });
  }
};

// Handle chat responses - now async since we're calling OpenAI
const getChatResponse = async (req, res) => {
  try {
    const { question } = req.body;
    
    // Validate input
    if (!question || question.trim() === '') {
      return res.status(400).json({ 
        error: 'Question is required' 
      });
    }
    
    // Generate AI response based on PDF content
    const answer = await generateChatResponse(question.trim());
    
    res.json({ 
      answer,
      question: question.trim()
    });
  } catch (error) {
    console.error('Error getting chat response:', error);
    res.status(500).json({ 
      error: 'Error generating response',
      details: error.message 
    });
  }
};

module.exports = { uploadPdf, getChatResponse };