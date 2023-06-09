import { SafeAreaView, ScrollView, View , StyleSheet} from "react-native";
import { Text } from "react-native-paper";

// Contains information about the user and various modifiable settings/configurations
export default function Profile() {

	return (
	<SafeAreaView>
		<ScrollView style={styles.container}>
			<Text variant='headlineLarge'>Profile</Text>
		</ScrollView>
	</SafeAreaView>
	);	
};

const styles = StyleSheet.create({
	container: {
		margin: 20
	},
});