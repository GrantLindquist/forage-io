import { View, StyleSheet } from "react-native";
import { Card, Text, IconButton } from 'react-native-paper';

// Card that contains basic info about recipe. Clicking will direct user to more detailed information about recipe
export default function RecipeCard(props) {

	return (
	<>
		{/* Ensures that recipe is defined before attempting to display information */}
		{props.recipe != undefined ? 
		<Card style={styles.card}>
			<Card.Content>
				<Text variant="titleLarge">{props.recipe.title}</Text>
				<Text variant="bodyMedium">{props.recipe.tags}</Text>
				<View style={styles.likeButton}>
					<IconButton
						icon="thumb-up"
						size={24}
					/>
				</View>
			</Card.Content>
	  	</Card> : <></>}
	</>
	);	
};

const styles = StyleSheet.create({
	card: {
		marginVertical: 5
	},
	likeButton: {
		position: 'absolute',
		right: 10,
	}
});