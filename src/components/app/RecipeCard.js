import { View, StyleSheet } from "react-native";
import { Card, Text, IconButton } from 'react-native-paper';

// Card that contains basic info about recipe. Clicking will direct user to more detailed information about recipe
export default function RecipeCard(props) {

	return (
		<Card style={styles.card}>
			<Card.Content>
				<View style={{flexDirection: 'row'}}>
					<View style={{width: '90%'}}>
						<Text variant="titleLarge">{props.recipe.Title}</Text>
					</View>
				</View>
			</Card.Content>
	  	</Card>
	);
};

const styles = StyleSheet.create({
	card: {
		marginVertical: 5
	},
});