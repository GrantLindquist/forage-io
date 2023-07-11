import { useRoute } from "@react-navigation/native";
import { SafeAreaView, ScrollView, View , StyleSheet} from "react-native";
import { Text } from "react-native-paper";

// Detailed page for a recipe that contains ingredients, instructions, etc.
export default function RecipePage() {

	// States for tracking parameters passed to route
	const route = useRoute();
	const { recipe } = route.params;

	return (
	<SafeAreaView>
		<ScrollView style={styles.container}>
			<Text variant='headlineLarge'>{recipe.Title}</Text>
			<Text variant="bodySmall">{recipe.Description}</Text>

			<Text variant='headlineSmall'>Ingredients</Text>

			<Text variant='headlineSmall'>Instructions</Text>

		</ScrollView>
	</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		margin: 20,
	},
});