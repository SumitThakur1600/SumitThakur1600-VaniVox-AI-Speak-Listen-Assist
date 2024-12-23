# Vani Vox: Your Intelligent Voice Assistant

## Overview

Vani Vox is an AI-powered voice assistant designed to enhance productivity and accessibility through intelligent voice recognition and smart responses. This project leverages advanced natural language processing (NLP) capabilities and voice synthesis to create an engaging and efficient assistant for various tasks.

## Features

- **Voice Activation:** Start the assistant by saying trigger phrases like "Hello Vani Vox."
- **Speech-to-Text:** Converts spoken commands into actionable inputs.
- **Smart Responses:** Processes user queries and provides accurate answers or performs tasks.
- **Text-to-Speech:** Reads responses aloud for a hands-free experience.
- **Inactivity Timer:** Automatically processes commands after periods of inactivity.
- **Customizable Trigger Phrases:** Add or modify phrases to suit your needs.

## Technology Stack

- **Frontend:** React.js
- **Speech Recognition:** `react-speech-recognition`
- **Speech Synthesis:** Built-in Web Speech API
- **Backend API:** Integrated with Google Generative Language API
- **Styling:** Tailwind CSS

## Prerequisites

- Node.js installed on your machine
- API key for Google Generative Language API
- Modern web browser with Web Speech API support (e.g., Google Chrome)

## Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/your-username/vani-vox.git
   cd vani-vox
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create an `.env` file in the root directory and add your API key:

   ```env
   VITE_API_GENERATIVE_LANGUAGE_CLIENT=your-api-key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Open the app in your browser (default: `http://localhost:5173`).
2. Click the microphone button to start listening or use a trigger phrase to activate the assistant.
3. Speak your query, and Vani Vox will process it and respond with both text and voice.

## Customization

- **Trigger Phrases:** Modify the `triggerPhrases` array in the component logic to add your own activation commands.
- **Styling:** Customize the UI components by editing the Tailwind CSS classes in the code.

## Limitations

- The Web Speech API may require user interaction to initialize voice synthesis due to browser restrictions.
- Ensure proper microphone permissions for accurate speech recognition.

## Future Enhancements

- Add support for multi-language input and responses.
- Implement offline capabilities for basic tasks.
- Integrate additional APIs for expanded functionality.

## Contributing

Contributions are welcome! If you’d like to improve this project:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch-name`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature-branch-name`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments

- [React Speech Recognition](https://www.npmjs.com/package/react-speech-recognition) for easy speech-to-text integration.
- [Google Generative Language API](https://cloud.google.com/generative-language/) for advanced AI responses.
- [Tailwind CSS](https://tailwindcss.com/) for styling the user interface.

---

**Developed with passion for intelligent solutions**
