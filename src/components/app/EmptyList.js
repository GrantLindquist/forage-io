import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

// Simple component to display when a FlatList is empty
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