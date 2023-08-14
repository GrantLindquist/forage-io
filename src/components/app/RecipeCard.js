import { View, StyleSheet } from "react-native";
import { Card, Text, IconButton } from 'react-native-paper';
import RecipeTag from "./RecipeTag";

// Card that contains basic info about recipe. Clicking will direct user to more detailed information about recipe
export default function RecipeCard(props) {

	// Sub-component that lists a tag component for each recipe tag
	// const tags = props.recipe.tags.map((tag) => {
	// 	return(
	// 		<RecipeTag key={tag.title} immutable={true}>{tag}</RecipeTag>
	// 	)
	// });

	return (
		<Card style={styles.card}>
			<Card.Content>
				<View style={{flexDirection: 'row'}}>
					<View style={{width: '90%'}}>
						<Text variant="titleLarge">{props.recipe.Title}</Text>
						<View style={{flexDirection: 'row'}}>
							{/* {tags} */}
						</View>
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