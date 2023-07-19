import { View, StyleSheet } from "react-native";
import { Card, Text, IconButton } from 'react-native-paper';
import RecipeTag from "./RecipeTag";
import { useUser } from '@clerk/clerk-expo';

// Card that contains basic info about recipe. Clicking will direct user to more detailed information about recipe
export default function RecipeCard(props) {

	// User object
	const { user } = useUser(); 

	// Handles 'like' button press
	const handleSaveRecipe = async () => {
		const prevSavedRecipeIds = user.unsafeMetadata.savedRecipeIds;
		var savedRecipeIds = [];

		// If user has any saved recipes, loop through and place into new id list
		if(prevSavedRecipeIds){
			for(item of prevSavedRecipeIds){
				savedRecipeIds.push(item);
			}
		}

		// Place newly handled recipe id into list
		savedRecipeIds.push(props.recipe.RecipeId);

		// Update user with new list of ids
		const response = await user.update({
			unsafeMetadata: { savedRecipeIds }
		});
		console.log(savedRecipeIds);
		return response;
	}

	// Sub-component that lists a tag component for each recipe tag
	// const tags = props.recipe.tags.map((tag) => {
	// 	return(
	// 		<RecipeTag key={tag.title} immutable={true}>{tag}</RecipeTag>
	// 	)
	// });

	return (
	<>
		{/* Ensures that recipe is defined before attempting to display information */}
		{props.recipe != undefined ? 
		<Card style={styles.card}>
			<Card.Content>
				<View style={{flexDirection: 'row'}}>
					<View style={{width: '88%'}}>
						<Text variant="titleLarge">{props.recipe.Title}</Text>
						<View style={{flexDirection: 'row'}}>
							{/* {tags} */}
						</View>
					</View>
					<View style={{flexDirection: 'row'}}>
						{/* TODO: Place recipe.likes in here. */}
						<IconButton
							icon="thumb-up"
							size={24}
							onPress={handleSaveRecipe}
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