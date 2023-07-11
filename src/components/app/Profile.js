import { SafeAreaView, ScrollView, View , StyleSheet} from "react-native";
import { Text } from "react-native-paper";
import { useUser } from "@clerk/clerk-expo";

// Contains information about the user and various modifiable settings/configurations
export default function Profile() {

	// User object
	const { user } = useUser(); 

	return (
	<SafeAreaView>
		<ScrollView style={styles.container}>
			<Text variant='headlineLarge'>{user.username}</Text>
		</ScrollView>
	</SafeAreaView>
	);	
};

const styles = StyleSheet.create({
	container: {
		margin: 20
	},
});