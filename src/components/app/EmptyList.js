import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

// Card that contains basic info about recipe. Clicking will direct user to more detailed information about recipe
export default function EmptyList() {

	return (
        <View style={styles.container}>
            <Text>Nothing to see here!</Text>
        </View>
	);
};

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
        alignItems: 'center',
        minHeight: "100%",
	},
});