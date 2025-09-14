# PDF Chat Application

A full-stack web application that allows users to upload PDF documents and chat with them using AI. The application extracts text from PDFs and uses Google's Gemini AI to answer questions based on the document content.

## Features

- **PDF Upload & Viewing**: Drag & drop or click to upload PDF files with real-time progress tracking
- **Interactive PDF Viewer**: Built with react-pdf, supports multi-page navigation
- **AI-Powered Chat**: Ask questions about your PDF content using Google's Gemini AI
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Messaging**: Instant chat responses with typing indicators
- **Session Persistence**: PDF content persists during browser session

## Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **Tailwind CSS** for styling
- **React Router** for navigation
- **react-pdf** for PDF viewing
- **Axios** for API communication

### Backend
- **Node.js** with Express.js
- **Multer** for file upload handling
- **pdf-parse** for PDF text extraction
- **Google Generative AI (Gemini)** for chat responses

## Prerequisites

Before running this application, make sure you have:

- Node.js (v16 or higher)
- npm or yarn
- Google Gemini API key (free from [Google AI Studio](https://makersuite.google.com/app/apikey))

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd pdf-chat-application
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Install required packages:

```bash
npm install express multer pdf-parse @google/generative-ai cors dotenv
```

Create a `.env` file in the backend root:

```bash
touch .env
```

Add your environment variables:

```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
```

Create the uploads directory:

```bash
mkdir uploads
```

### 3. Frontend Setup

Navigate to the frontend directory:

```bash
cd ../frontend
```

Install dependencies:

```bash
npm install
```

Install required packages:

```bash
npm install react react-dom react-router-dom axios react-pdf tailwindcss
```

## Project Structure

```
pdf-chat-application/
├── backend/
│   ├── controllers/
│   │   └── pdfController.js
│   ├── services/
│   │   └── pdfService.js
│   ├── utils/
│   │   └── pdfUtils.js
│   ├── uploads/
│   ├── .env
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FileUpload.jsx
│   │   │   ├── PdfViewer.jsx
│   │   │   └── ChatBox.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

## Running the Application

### 1. Start the Backend Server

From the backend directory:

```bash
npm start
```

Or for development with auto-restart:

```bash
npm run dev
```

The backend server will start on `http://localhost:5000`

### 2. Start the Frontend Development Server

From the frontend directory:

```bash
npm run dev
```

The frontend will start on `http://localhost:5173` (or the next available port)

### 3. Access the Application

Open your browser and navigate to `http://localhost:5173`

## API Endpoints

### POST `/api/upload`
Upload a PDF file for processing.

**Request:** Multipart form data with `file` field
**Response:**
```json
{
  "numPages": 10,
  "text": "extracted text content...",
  "message": "PDF uploaded successfully and ready for questions!"
}
```

### POST `/api/chat`
Send a question about the uploaded PDF.

**Request:**
```json
{
  "question": "What is the main topic of this document?",
  "pdfFile": "filename.pdf"
}
```

**Response:**
```json
{
  "answer": "Based on the PDF content, the main topic is...",
  "question": "What is the main topic of this document?"
}
```

## Configuration

### Backend Configuration

The backend uses the following environment variables:

- `PORT`: Server port (default: 5000)
- `GEMINI_API_KEY`: Your Google Gemini API key
- `NODE_ENV`: Environment (development/production)

### Frontend Configuration

The frontend is configured to connect to the backend at `http://localhost:5000`. To change this, update the API URLs in the React components.

## Getting Google Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key and add it to your `.env` file

## Features in Detail

### File Upload
- Supports PDF files up to 10MB
- Drag & drop interface
- Real-time upload progress
- File validation

### PDF Viewer
- Responsive design
- Page navigation for multi-page documents
- Zoom and scroll functionality
- Mobile-optimized viewing

### AI Chat
- Context-aware responses based on PDF content
- Suggested questions for better user experience
- Error handling for API failures
- Typing indicators and message timestamps

## Troubleshooting

### Common Issues

1. **PDF not loading**: Ensure the file is a valid PDF and under 10MB
2. **API key errors**: Verify your Gemini API key is correct in the `.env` file
3. **CORS errors**: Make sure both frontend and backend are running on the specified ports
4. **Upload fails**: Check that the `uploads` directory exists in the backend

### Error Messages

- **"Invalid API key"**: Check your `GEMINI_API_KEY` in `.env`
- **"API quota exceeded"**: Wait and try again, or upgrade your Gemini plan
- **"File too large"**: Reduce PDF file size to under 10MB
- **"Failed to load PDF"**: Ensure the PDF file is not corrupted

## Development

### Adding New Features

1. **Backend**: Add routes in `server.js`, controllers in `controllers/`, and services in `services/`
2. **Frontend**: Add components in `src/components/` and update routing in `App.jsx`

### Environment Setup for Development

Backend development server with auto-restart:
```bash
npm install -g nodemon
npm run dev
```

Frontend with hot reload:
```bash
npm run dev
```

## Deployment

### Backend Deployment

1. Set environment variables on your hosting platform
2. Ensure the `uploads` directory is writable
3. Update CORS settings for production domain

### Frontend Deployment

1. Build the production bundle:
   ```bash
   npm run build
   ```
2. Deploy the `dist` folder to your hosting service
3. Update API URLs to point to your production backend

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Review the error messages in browser console
3. Ensure all dependencies are properly installed
4. Verify your Gemini API key is valid and has quota remaining

## Acknowledgments

- Google Gemini AI for providing free AI capabilities
- react-pdf library for PDF viewing functionality
- Tailwind CSS for beautiful, responsive styling
- The React and Node.js communities for excellent documentation
