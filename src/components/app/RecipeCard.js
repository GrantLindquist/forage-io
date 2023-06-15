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
				<View style={{flexDirection: 'row'}}>
					<View style={{width: '88%'}}>
						<Text variant="titleLarge">{props.recipe.title}</Text>
						<Text variant="bodyMedium">{props.recipe.tags}</Text>
					</View>
					<View style={{flexDirection: 'row'}}>
						{/* TODO: Place recipe.likes in here. */}
						<IconButton
							icon="thumb-up"
							size={24}
						/>
					</View>
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