import { useRoute } from "@react-navigation/native";
import { useNavigation } from '@react-navigation/native';
import { Alert, Share, ScrollView, View, StyleSheet, Image } from "react-native";
import { Text, Snackbar, Appbar } from "react-native-paper";
import { useUser } from "@clerk/clerk-expo";
import RecipeTag from "./RecipeTag";
import { useMemo, useState } from "react";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import recipeService from "../../services/recipeService";
const ms = require('ms');

// Detailed page for a recipe that contains ingredients, instructions, etc.
export default function RecipePage(props) {

	// State that provides navigation property
	const navigation = useNavigation();

	// States for tracking parameters passed to route
	const route = useRoute();
	const { user } = useUser();
	const { recipe } = route.params;

	// State that tracks snackbar status
	const [snackbarVisible, setSnackbarVisible] = useState(false);

	// Attempts to format time from ms to human-readable time
	const formattedTime = (time) => {
		return ms(time, { long: false })
	}

	// State for tracking whether or can save or unsave this recipe
	const canBeSaved = useMemo(() => {
		// Can be saved if not included in users saved recipes (not already saved)
		return !user.unsafeMetadata.savedRecipeIds.includes(recipe.RecipeId);
	}, [user.unsafeMetadata.savedRecipeIds])

	// Method for determining user action in FAB group
	const determineUserAction = () => {
		// If user has created recipe, display delete action
		if (user.id == recipe.CreatorId) {
			return (
				<Appbar.Action icon={'delete'} size={24} onPress={() => handleDeleteRecipe()} />
			)
		}
		// Otherwise, display save action
		else {
			return (
				<Appbar.Action
					icon={() => <Image
						source={!canBeSaved ? require('../../../assets/icons/star-selected.png') : require('../../../assets/icons/star-filled.png')}
						style={{ height: 24, width: 24 }} />}
					onPress={() => handleSaveRecipe()}
				/>
			)
		}
	}

	// User action that depends on state of recipe
	const [userAction, setUserAction] = useState(determineUserAction());

	// Deletes recipe from DB
	const handleDeleteRecipe = async () => {
		// Determines whether a record of recipe should be kept for other users
		let saveRecord = recipe.Stars > 0 ? true : false

		// Executes request
		const response = recipeService.deleteRecipe(user.id, recipe.RecipeId, saveRecord);

		// Refreshes createdRecipes.js
		props.refreshCreatedRecipes();

		// Redirects user
		navigation.navigate("Created", {
			removeId: recipe.RecipeId
		});

		// Returns response
		return response;
	}

	// Appends or removes recipe id to/from user's saved recipe ids
	const handleSaveRecipe = async () => {
		const prevSavedRecipeIds = user.unsafeMetadata.savedRecipeIds;
		var savedRecipeIds = [];

		// If user has any saved recipes, loop through and place into new id list
		if (prevSavedRecipeIds) {
			for (item of prevSavedRecipeIds) {
				if (item != recipe.RecipeId) {
					savedRecipeIds.push(item);
				}
			}
		}

		// Place newly handled recipe id into list if recipe id hasn't already been removed
		if (canBeSaved) {
			savedRecipeIds.push(recipe.RecipeId);

			// Execute service request
			let response = await recipeService.updateRecipeStars(recipe.CreatorId, recipe.RecipeId, Number(recipe.Stars) + 1);
			console.log(response);
		}
		else {
			let response = await recipeService.updateRecipeStars(recipe.CreatorId, recipe.RecipeId, Number(recipe.Stars) - 1);
			console.log(response);
		}

		// Update user with new list of ids
		const response = await user.update({
			unsafeMetadata: {
				savedRecipeIds: savedRecipeIds,
				recipeCharges: user.unsafeMetadata.recipeCharges,
			}
		});

		// Displays Snackbar
		setSnackbarVisible(true);

		// Refreshes savedRecipes.js
		props.refreshSavedRecipes();

		// Updates FAB display
		setUserAction(determineUserAction());

		return response;
	}

	// Displays share functionality for sharing recipes to people w/o the app
	const handleShareRecipe = async () => {
		// Constructs string for ingredient list
		const ingredientString = recipe.Ingredients.map((ingredient) => {
			return `- ${ingredient}\n`
		}).join('');
		// Constructs string for instructions list
		stepCounter = 0;
		const instructionString = recipe.Instructions.map((instruction) => {
			stepCounter++;
			return `${stepCounter}. ${instruction}\n`
		}).join('');

		// Attempts to open user share flow
		try {
			const result = await Share.share({
				message:
					`${recipe.Title}

Serves: ${recipe.Servings}
Budget: $${Number(recipe.Budget).toFixed(2)}
Time: ${formattedTime(recipe.CreationTime)}

Ingredients:
${ingredientString}
Instructions:
${instructionString}`,
			});
			if (result.action === Share.sharedAction) {
				if (result.activityType) {
					// shared with activity type of result.activityType
				} else {
					// shared
				}
			} else if (result.action === Share.dismissedAction) {
				// dismissed
			}
		}
		// Alerts user if error
		catch (error) {
			Alert.alert(error.message);
		}
	}

	// Sub-component that lists a tag component for each recipe tag
	const recipeTags = Object.entries(recipe.Tags).map((tag) => {
		// Parse title from JSON property to tag string
		let title = tag[0].charAt(2).toLowerCase() + tag[0].slice(3);

		return (
			<RecipeTag key={title} title={title} immutable={true} />
		)
	});

	// Renders each ingredient 
	const ingredients = recipe.Ingredients.map((ingredient) => {
		return (
			<Text variant='bodyLarge' style={{ marginVertical: 5 }} key={ingredient}><Text style={{ fontWeight: 700 }}>-</Text> {ingredient}</Text>
		)
	});

	// Renders each step of instructions 
	var stepCounter = 0;
	const instructions = recipe.Instructions.map((instruction) => {
		stepCounter++;
		return (
			<Text variant='bodyLarge' style={{ marginVertical: 10 }} key={"instruction" + stepCounter}><Text style={{ fontWeight: 700 }}>{stepCounter}. </Text>{instruction}</Text>
		)
	});

	return (
		<>
			{/* Custom recipePage header */}
			<Appbar.Header style={{ backgroundColor: '#000000' }}>
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				<Appbar.Content></Appbar.Content>
				<Appbar.Action
					icon={() => <Image
						source={require('../../../assets/icons/share.png')}
						style={{ height: 24, width: 24 }} />}
					onPress={() => handleShareRecipe()}
				/>
				<Appbar.Action
					icon={() => <Image
						source={require('../../../assets/icons/remix-action.png')}
						style={{ height: 24, width: 24 }} />}
					onPress={() => navigation.navigate('CreateRecipeModal', {
						recipe: recipe
					})} />
				{userAction}
			</Appbar.Header>

			<ScrollView>
				<View style={styles.container}>
					<Text style={styles.subtext}><MaterialCommunityIcons name="account" size={14} /> {recipe.CreatorUsername.toUpperCase()}</Text>
					<Text style={styles.recipeTitle}>{recipe.Title}</Text>
					<View style={{ marginTop: 5, flexWrap: 'wrap', flexDirection: 'row' }}>
						{recipeTags}
					</View>
					<View style={{ marginTop: 15, flexDirection: 'row', justifyContent: 'space-evenly' }}>
						<View style={{ alignItems: 'center' }}>
							<Text style={styles.subtext}>Serves</Text>
							<Text variant="headlineMedium">{recipe.Servings}</Text>
						</View>
						<View style={{ alignItems: 'center', paddingHorizontal: 25, borderColor: "rgb(0, 227, 138)", borderLeftWidth: '2', borderRightWidth: '2' }}>
							<Text style={styles.subtext}>Budget</Text>
							<Text variant="headlineMedium">${Number(recipe.Budget).toFixed(2)}</Text>
						</View>
						<View style={{ alignItems: 'center' }}>
							<Text style={styles.subtext}>Time</Text>
							<Text variant="headlineMedium">{formattedTime(recipe.CreationTime)}</Text>
						</View>
					</View>
					<Text style={[styles.categoryTitle, { color: "rgb(0, 227, 138)" }]}>Ingredients:</Text>
					{ingredients}
					<Text style={[styles.categoryTitle, { color: "rgb(0, 227, 138)" }]}>Instructions:</Text>
					{instructions}
				</View>
			</ScrollView>
			<Snackbar
				visible={snackbarVisible}
				onDismiss={() => setSnackbarVisible(false)}
				action={{
					label: 'OK',
					onPress: () => { },
				}}>
				{!canBeSaved ? "Recipe has been saved!" : "Recipe has been unsaved!"}
			</Snackbar>
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		margin: 20,
		marginTop: 0
	},
	recipeTitle: {
		// fontFamily: 'Roboto',
		fontSize: 36,
		fontWeight: 700,
		lineHeight: 38,
		marginTop: 5
	},
	categoryTitle: {
		// fontFamily: 'Roboto',
		fontSize: 24,
		fontWeight: 700,
		marginVertical: 15,
	},
	subtext: {
		color: 'grey',
		fontSize: 13
	}
});