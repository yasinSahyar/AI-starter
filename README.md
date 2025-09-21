# AI-commenter-starter

This is an Express.js application built with TypeScript that serves as an API gateway and includes features for managing a dish database with automatic AI-powered image generation.

---

**Repository Link:** [Add your repository link here](https://github.com/your-username/your-repo)

---

## 📝 Week 4 - AI Tasks

For this assignment, I implemented a feature to automatically generate images for dishes using the DALL-E 2 model via the OpenAI API. The application is configured to use the custom endpoint `https://media2.edu.metropolia.fi/openapi`.

### Prompt Generation

The prompt sent to the DALL-E 2 API is dynamically constructed from the dish details provided by the user. I engineered the prompt to request a high-quality, photorealistic image suitable for a gourmet food magazine to achieve the best visual results.

**Prompt Logic from `src/middlewares.ts`:**
```typescript
const response = await openai.images.generate({
  model: 'dall-e-2',
  prompt: `A high-quality, photorealistic image of a dish called "${req.body.dish_name}". It is a ${req.body.dish_type}. The dish is described as: "${req.body.description}". The image should be well-lit, appetizing, and styled for a gourmet food magazine.`,
  size: '1024x1024',
  quality: 'hd',
});


Example
Here is an example of the input I used, the prompt that was generated from it, and the resulting image I received.

Input (Syöte):

Dish Name: "Galactic Burger"
Description: "A juicy beef patty with shimmering nebula-cheese, asteroid-onions, and a black hole-sesame bun. Served with star-fries."
Dish Type: "Main Course"
Generated Prompt (Luotu Prompti):

plaintext
A high-quality, photorealistic image of a dish called "Galactic Burger". It is a Main Course. The dish is described as: "A juicy beef patty with shimmering nebula-cheese, asteroid-onions, and a black hole-sesame bun. Served with star-fries.". The image should be well-lit, appetizing, and styled for a gourmet food magazine.
Resulting Image (Tuloskuva):

Below is the image I generated using the prompt above.

(Note: Replace this with your own generated image and update the path.)

A delicious-looking Galactic Burger

📋 Features
API Gateway: Proxies requests to external services like OpenWeatherMap.
Dish Management: Full CRUD (Create, Read, Update, Delete) operations for dishes.
Automatic Image Generation: Uses DALL-E 2 to create images for new dishes.
Image Processing: Automatically creates thumbnails for generated images.
Input Validation: Secure request validation using express-validator.
Robust Error Handling: Centralized error handling with a custom error class.
🛠️ Technologies
Category	Technology
Backend	Node.js, Express.js
Language	TypeScript
AI	OpenAI API (DALL-E 2)
Image Handling	sharp for thumbnail generation
Validation	express-validator
Middleware	morgan, helmet, cors, http-proxy-middleware
📁 Project Structure
plaintext
 Show full code block 
src/
├── app.ts              # Express app configuration & API gateway setup
├── index.ts            # Server entry point
├── middlewares.ts      # Custom middlewares (error handling, AI, images)
├── api/
│   ├── index.ts        # Main API router
│   ├── controllers/
│   │   └── dishController.ts
│   └── routes/
│       └── dishRoute.ts
├── classes/
│   └── CustomError.ts  # Custom error class
└── types/
    ├── DBTypes.ts      # Database-related types
    └── MessageTypes.ts # API message types
⚙️ Setup
Clone the repository:

bash
git clone <your-repository-url>
cd <repository-name>
Install dependencies:

bash
npm install
Create an .env file in the project root with the following content:

env
 Show full code block 
# Environment
NODE_ENV=development
PORT=3000

# OpenAI API Credentials
OPENAI_API_URL=https://media2.edu.metropolia.fi/openapi
OPENAI_API_KEY="your_openai_api_key_here"

# External Services
WEATHER_API_KEY="your_openweathermap_api_key_here"
Create the uploads directory for image storage:

bash
mkdir uploads
Run the application:

bash
npm run dev
The server will start at http://localhost:3000.

🔌 API Endpoints
All API routes are prefixed with /api/v1.

🍽️ Dishes
POST /dishes: Create a new dish and automatically generate an AI image.
Middleware Chain: validate -> getAiImage -> saveAiImage -> makeThumbnail -> createDish
Body: { "dish_name": "string", "description": "string", "dish_type": "string" }
GET /dishes: Retrieve all dishes.
GET /dishes/:id: Retrieve a single dish by its ID.
PUT /dishes/:id: Update an existing dish.
DELETE /dishes/:id: Delete a dish.
GATEWAY/PROXY
/weather?q=<city>: Proxies requests to the OpenWeatherMap API.
Example: http://localhost:3000/weather?q=Helsinki
🔧 Middlewares
Middleware	Description
getAiImage	Generates an image URL using DALL-E 2 based on dish details.
saveAiImage	Downloads the generated image and saves it to the uploads/ directory.
makeThumbnail	Creates a 160x160 thumbnail for the saved image using sharp.
validate	Validates request body/params using express-validator rules.
notFound	Handles requests to non-existent routes with a 404 error.
errorHandler	A global error handler that formats and sends error responses.
📊 Error Handling
The application uses a custom CustomError class to provide consistent error responses.

typescript
 Show full code block 
class CustomError extends Error {
  status = 400;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}
🚀 Scripts
Script	Description
npm run dev	Starts the server in development mode with nodemon.
npm run build	Compiles TypeScript to JavaScript.
npm start	Starts the server in production mode.
npm run lint	Lints the code using ESLint.
npm run test	Runs tests using Jest.
📄 License
This project is licensed under the MIT License.

plaintext

<!--
[PROMPT_SUGGESTION]How can I connect this application to a MySQL database to store the dishes?[/PROMPT_SUGGESTION]
[PROMPT_SUGGESTION]Show me how to add JWT authentication to protect the dish API endpoints.[/PROMPT_SUGGESTION]
-->


