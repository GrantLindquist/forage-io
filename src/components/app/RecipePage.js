import { useRoute } from "@react-navigation/native";
import { SafeAreaView, ScrollView, View , StyleSheet} from "react-native";
import { Text, Button } from "react-native-paper";
import { useUser } from "@clerk/clerk-expo";

// Detailed page for a recipe that contains ingredients, instructions, etc.
export default function RecipePage() {

	// States for tracking parameters passed to route
	const route = useRoute();
	const { user } = useUser();
	const { recipe } = route.params;

	// Deletes recipe from DB
	const handleDelete = async() => {
		// Executes request
		const response = await fetch(`https://oongvnk9o0.execute-api.us-east-1.amazonaws.com/test/recipes/?recipeId=${item}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		//
		
		// Returns response
		let data = await response.json();
		return data;
	}

	// Renders each ingredient 
	const ingredients = recipe.Ingredients.map((ingredient) => {
		return(
			<Text>- {ingredient}</Text>
		)
	});

	// Renders each step of instructions 
	var stepCounter = 0;
	const instructions = recipe.Instructions.map((instruction) => {
		stepCounter++;
		return(
			<Text>{stepCounter}. {instruction}</Text>
		)
	});

	return (
	<SafeAreaView>
		<ScrollView style={styles.container}>
			<Text variant='headlineLarge'>{recipe.Title}</Text>
			<Text variant="bodySmall">{recipe.Description}</Text>
			<Text variant='headlineSmall'>Ingredients</Text>
			{ingredients}
			<Text variant='headlineSmall'>Instructions</Text>
			{instructions}
			{/* Displays recipe options if user is the creator of recipe */}
			{user.id == recipe.CreatorId ? <Button 
				textColor="red"
				onPress={handleDelete}
			>Delete</Button> : <></>}
		</ScrollView>
	</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		margin: 20,
	},
});