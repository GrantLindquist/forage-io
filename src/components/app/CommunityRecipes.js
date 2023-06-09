import { SafeAreaView, ScrollView, View, StyleSheet} from "react-native";
import { Text } from "react-native-paper";

// Collection of recipes created by other users
export default function CommunityRecipes(props) {

	return (
	<SafeAreaView>
		<ScrollView style={styles.container}>
			<Text variant='headlineLarge'>Community Recipes</Text>
		</ScrollView>
	</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		margin: 20
	},
});