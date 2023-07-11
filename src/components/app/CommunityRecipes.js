import { ScrollView, View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import RecipeList from './RecipeList';

// Collection of recipes created by other users
export default function CommunityRecipes() {

	return (
		<ScrollView>
			<View style={styles.container}>
				<Text variant='headlineLarge'>For You</Text>
				<RecipeList recipes={[]} filters={true}/>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		margin: 20
	},
});