import { SafeAreaView, ScrollView, View , StyleSheet} from "react-native";
import { Text, Avatar } from "react-native-paper";
import { useUser } from "@clerk/clerk-expo";

// Contains information about the user and various modifiable settings/configurations
export default function Profile() {

	// User object
	const { user } = useUser(); 

	return (
	<SafeAreaView>
		<ScrollView style={styles.container}>
			<View style={{alignItems: 'center'}}>
				<Avatar.Image source={{uri: user.imageUrl}} size={120} style={{margin: 20}}/>
				<Text variant='headlineLarge'>{user.username}</Text>
				<Text variant='headlineSmall'>{user.createdAt.toDateString()}</Text>
          	</View>
		</ScrollView>
	</SafeAreaView>
	);	
};

const styles = StyleSheet.create({
	container: {
		margin: 20,
	},
});