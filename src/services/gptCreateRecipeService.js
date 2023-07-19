// OpenAI & .env imports
const { Configuration, OpenAIApi } = require("openai");
// UUID import
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

// OpenAI API configuration
const configuration = new Configuration({
    apiKey: "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",
});
const openai = new OpenAIApi(configuration);

// Generates a recipe with GPT using the request parameter.
export default async function generateRecipe(request, user) {

    // Make GPT request
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ "role": "system", "content": "You are a professional chef with decades of culinary experience." }, {
            role: "user",
            content: `generate a ${request}. place this recipe into a JSON-compatible string. the recipe name must be called \"title\", the ingredient list must be named \"ingredients\", the instructions list must be named \"instructions\", and the recipe description must be named \"description\"`
        }],
        temperature: .8
    });

    // Place recipe into DB
    const recipe = JSON.parse(completion.data.choices[0].message.content);
    const response = await fetch(`https://oongvnk9o0.execute-api.us-east-1.amazonaws.com/test/recipes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            creatorId: user.id,
            recipeId: uuidv4(),
            title: recipe.title,
            description: recipe.description,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions,
            likes: 0,
            creatorUsername: user.username,
            creationDate: Date.now()
        })
    });
    // Format and return response
    let data = await response.json();
    return data;
}
