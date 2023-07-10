import { ScrollView, View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import RecipeList from './RecipeList';
import mockData from '../../../mockRecipes.json';

// Collection of recipes created by other users
export default function CommunityRecipes() {

	return (
		<ScrollView>
			<View style={styles.container}>
				<Text variant='headlineLarge'>For You</Text>
				<RecipeList recipes={mockData} filters={true}/>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		margin: 20
	},
});