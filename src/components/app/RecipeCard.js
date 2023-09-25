import { View, StyleSheet, Image } from "react-native";
import { Card, Text } from 'react-native-paper';
import colors from "../../../colors.json";
import { useUser } from "@clerk/clerk-expo";

// Card that contains basic info about recipe. Clicking will direct user to more detailed information about recipe
export default function RecipeCard(props) {

	// User object
	const { user } = useUser();

	return (
		<Card style={styles.card}>
			<Card.Content>
				<View style={{flexDirection: 'row'}}>
					<View style={{width: '90%', minHeight: 75}}>
						<Text style={styles.recipeTitle}>{props.recipe.Title}</Text>
					</View>
				</View>
				<View style={{flexDirection: 'row', width: '100%'}}>
					<Text style={styles.recipeSubtext}><Image 
						source={require('../../../assets/icons/servings.png')}
						style={{width: 14, height: 14}}
					/>{props.recipe.Servings}</Text>
					<Text style={styles.recipeSubtext}><Image 
						source={require('../../../assets/icons/time.png')}
						style={{width: 14, height: 14}}
					/>{props.recipe.CreationTime}</Text>
					<Text style={styles.recipeSubtext}>
					${Number(props.recipe.Budget).toFixed(2)}</Text>
					<View style={{marginLeft: 'auto'}}>
						{/* Make liked recipes have yellow number */}
						<Text style={user.unsafeMetadata.savedRecipeIds.includes(props.recipe.RecipeId) ? styles.highlightedSubtext : styles.recipeSubtext}>{props.recipe.Stars} <Image 
							source={require('../../../assets/icons/star-filled.png')}
							style={{width: 14, height: 14}}
						/></Text>
					</View>
				</View>
			</Card.Content>
	  	</Card>
	);
};

const styles = StyleSheet.create({
	card: {
		marginVertical: 5,
		height: 120,
		backgroundColor: colors['background1']
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
	},
	highlightedSubtext: {
		fontSize: 14,
		color: colors['yellow'],
		marginRight: 10
	}
});