import { View, StyleSheet } from "react-native";
import { Card, Text, IconButton } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Card that contains basic info about recipe. Clicking will direct user to more detailed information about recipe
export default function RecipeCard(props) {

	return (
		<Card style={styles.card}>
			<Card.Content>
				<View style={{flexDirection: 'row'}}>
					<View style={{width: '90%', minHeight: 75}}>
						<Text style={styles.recipeTitle}>{props.recipe.Title}</Text>
					</View>
				</View>
				<View style={{flexDirection: 'row'}}>
					<Text style={styles.recipeSubtext}><MaterialCommunityIcons name="account" size={14} />{props.recipe.Servings}</Text>
					<Text style={styles.recipeSubtext}><MaterialCommunityIcons name="account" size={14} />{props.recipe.CreationTime}</Text>
					<Text style={styles.recipeSubtext}><MaterialCommunityIcons name="account" size={14} />{props.recipe.Budget}</Text>
				</View>
			</Card.Content>
	  	</Card>
	);
};

const styles = StyleSheet.create({
	card: {
		marginVertical: 5,
		height: 120,
	},
	recipeTitle: {
		// fontFamily: 'Roboto',
		fontSize: 24,
		fontWeight: 700
	},
	recipeSubtext: {
		fontSize: 14,
		color: 'grey',
		marginRight: 10
	}
});