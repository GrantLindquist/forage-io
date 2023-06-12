import { ScrollView, View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import RecipeList from './RecipeList';
import mockData from '../../../mockRecipes.json';

// Collection of recipes created or saved by the user
export default function UserRecipes() {

	return (
		<ScrollView>
			<View style={styles.container}>
				<Text variant='headlineLarge'>Your Recipes</Text>
				<RecipeList/>
			</View>
			<View style={styles.container}>
				<Text variant='headlineLarge'>Liked Recipes</Text>
				<RecipeList/>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		margin: 20
	},
});