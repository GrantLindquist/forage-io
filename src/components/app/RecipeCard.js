import { View, StyleSheet, Image } from "react-native";
import { Card, Text } from 'react-native-paper';
import { useUser } from "@clerk/clerk-expo";
import RecipeTag from "./RecipeTag";
const ms = require('ms');

// Card that contains basic info about recipe. Clicking will direct user to more detailed information about recipe
export default function RecipeCard(props) {

	// User object
	const { user } = useUser();

	// Attempts to format time from ms to human-readable time
	const formattedTime = (time) => {
		return ms(time, { long: false })
	}

	// Reduces preview tags to amount that can fit on recipe card
	const tags = Object.entries(props.recipe.Tags);
	let chars = 0;
	let tagNum = 0;

	for (let tag of tags) {
		if (chars + tag[0].length > 30) break;
		chars += tag[0].length;
		tagNum++;
	}

	const truncatedTags = tags.slice(0, tagNum);
	const remainder = tags.length - truncatedTags.length;

	// Sub-component that lists a tag component for each recipe tag
	const recipeTags = truncatedTags.map((tag) => {
		// Parse title from JSON property to tag string
		let title = tag[0].charAt(2).toLowerCase() + tag[0].slice(3);

		return (
			<RecipeTag key={title} title={title} immutable={true} />
		)
	});

	return (
		<Card style={styles.card}>
			<Card.Content>
				<View style={{ width: '90%', marginBottom: 10 }}>
					<Text style={styles.recipeTitle} numberOfLines={2}>{props.recipe.Title}</Text>
				</View>
				<View style={{ marginBottom: 8, flexWrap: 'wrap', flexDirection: 'row', alignItems: 'center' }}>
					{recipeTags}
					{remainder > 0 ? <Text style={[styles.recipeSubtext, { marginLeft: 5 }]}>+{remainder}</Text> : <></>}
				</View>
				<View style={{ flexDirection: 'row', width: '100%', marginTop: 5 }}>
					<Text style={styles.recipeSubtext}><Image
						source={require('../../../assets/icons/servings.png')}
						style={{ width: 14, height: 14 }}
					/>{props.recipe.Servings}</Text>
					<Text style={styles.recipeSubtext}><Image
						source={require('../../../assets/icons/time.png')}
						style={{ width: 14, height: 14 }}
					/>{formattedTime(props.recipe.CreationTime)}</Text>
					<Text style={styles.recipeSubtext}>
						${Number(props.recipe.Budget).toFixed(2)}</Text>
					<View style={{ marginLeft: 'auto' }}>
						{/* Display liked recipes with yellow number */}
						<Text style={user.unsafeMetadata.savedRecipeIds.includes(props.recipe.RecipeId) ? styles.highlightedSubtext : styles.recipeSubtext}>{props.recipe.Stars} <Image
							source={user.unsafeMetadata.savedRecipeIds.includes(props.recipe.RecipeId) ? require('../../../assets/icons/star-selected.png') : require('../../../assets/icons/star-filled.png')}
							style={{ width: 14, height: 14 }}
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
		marginHorizontal: 15
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
		marginRight: 10
	}
});