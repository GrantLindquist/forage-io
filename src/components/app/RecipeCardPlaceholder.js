import { View, StyleSheet } from "react-native";
import { Card } from 'react-native-paper';

// Placeholder component to display while recipes are loading
export default function RecipeCardPlaceholder() {

	return (
		<Card style={styles.card}>
			<Card.Content>
				<View style={{ flexDirection: 'row' }}>
					<View style={{ width: '90%', height: 60 }}>

					</View>
				</View>
			</Card.Content>
		</Card>
	);
};

const styles = StyleSheet.create({
	card: {
		marginVertical: 5,
		marginHorizontal: 15,
		height: 120,
		backgroundColor: '#222222'
	},
});