# AI-commenter-starter

**Repository Link:** [Link to your repository here](https://github.com/your-username/your-repo)

---

For this assignment (Week 4 AI tasks), I implemented a feature that uses OpenAI's DALL-E 2 to automatically generate an image for a new dish based on its details. I also configured the application to use the custom API endpoint provided for the assignment.

## AI Task Details (Tehtävä 1 & 2)

### Prompt Generation

To generate the images, I constructed a dynamic prompt for the DALL-E 2 API. This prompt is built using the `dish_name`, `description`, and `dish_type` that the user provides when creating a new dish.

Here is the code from `src/middlewares.ts` that I used to build the prompt and call the API:

**Code from `src/middlewares.ts`:**
```typescript
const response = await openai.images.generate({
  model: 'dall-e-2',
  prompt: `Name of dish: ${req.body.dish_name}. The description of the dish: ${req.body.description}. Type of the dish: ${req.body.dish_type}.`,
  size: '1024x1024',
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
