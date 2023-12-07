import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

// Simple component to display when a FlatList is empty
export default function EmptyList() {

	return (
        <View style={styles.container}>
            <Text style={{color: 'grey', marginBottom: 24}}>There are no recipes here... yet.</Text>
        </View>
	);
};

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        minHeight: "100%",
	},
});