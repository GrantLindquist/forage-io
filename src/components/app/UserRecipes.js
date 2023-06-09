import { SafeAreaView, ScrollView, View , StyleSheet} from "react-native";
import { Text } from "react-native-paper";

// Collection of recipes created or saved by the user
export default function UserRecipes() {

	return (
	<SafeAreaView>
		<ScrollView>
			<View style={styles.container}>
				<Text variant='headlineLarge'>Your Recipes</Text>
			</View>
			<View style={styles.container}>
				<Text variant='headlineLarge'>Liked Recipes</Text>
			</View>
		</ScrollView>
	</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		margin: 20
	},
});