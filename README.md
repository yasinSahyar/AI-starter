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
```

### Example

Here is an example of the input (syöte), the resulting prompt (prompti), and a potential generated image (tulos).

**Input (Syöte):**
*   **Dish Name:** "Galactic Burger"
*   **Description:** "A juicy beef patty with shimmering nebula-cheese, asteroid-onions, and a black hole-sesame bun. Served with star-fries."
*   **Dish Type:** "Main Course"

**Generated Prompt (Luotu Prompti):**
```
Name of dish: Galactic Burger. The description of the dish: A juicy beef patty with shimmering nebula-cheese, asteroid-onions, and a black hole-sesame bun. Served with star-fries.. Type of the dish: Main Course.
```

**Resulting Image (Tuloskuva):**

Below is an example image that could be generated with the prompt above. You should run the application and replace this with an image you generated yourself.
