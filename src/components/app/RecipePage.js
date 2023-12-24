import { useRoute } from "@react-navigation/native";
import { useNavigation } from '@react-navigation/native';
import { Alert, Share, ScrollView, View, StyleSheet, Pressable } from "react-native";
import { Text, Snackbar, Appbar, Checkbox } from "react-native-paper";
import { Portal, Dialog, Button } from "react-native-paper";
import { useUser } from "@clerk/clerk-expo";
import RecipeTag from "./RecipeTag";
import { useState, useEffect } from "react";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import recipeService from "../../services/recipeService";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import RecipeTip from "./RecipeTip";
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
	const [reportSnackbarVisible, setReportSnackbarVisible] = useState(false);

	// State for tracking report recipe dialog
	const [reportRecipeVisible, setReportRecipeVisible] = useState(false);
	const [reportInaccurateChecked, setReportInaccurateChecked] = useState(false);
	const [reportInappropriateRecipeChecked, setReportInappropriateRecipeChecked] = useState(false);
	const [reportInappropriateUserChecked, setReportInappropriateUserChecked] = useState(false);
	const [reportInedibleChecked, setReportInedibleChecked] = useState(false);

	// Attempts to format time from ms to human-readable time
	const formattedTime = (time) => {
		return ms(time, { long: false })
	}

	// State for tracking whether or can save or unsave this recipe
	const [canBeSaved, setCanBeSaved] = useState(
		// Can be saved if not included in users saved recipes (not already saved)
		!user.unsafeMetadata.savedRecipeIds.includes(recipe.RecipeId));

	useEffect(() => {
		setUserAction(determineUserAction());
	}, [canBeSaved]);

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
					icon={!canBeSaved ? "star" : "star-outline"}
					size={30}
					color={!canBeSaved ? "#FFFF78" : "white"}
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
		try {
			const response = recipeService.deleteRecipe(user.id, recipe.RecipeId, saveRecord);
		}
		catch (e) {
			// Put stuff here
		}

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
		try {
			if (canBeSaved) {
				savedRecipeIds.push(recipe.RecipeId);

				// Execute service request
				const response = await recipeService.updateRecipeStars(recipe.CreatorId, recipe.RecipeId, Number(recipe.Stars) + 1);
				console.log(response);
				setCanBeSaved(false);
			}
			else {
				const response = await recipeService.updateRecipeStars(recipe.CreatorId, recipe.RecipeId, Number(recipe.Stars) - 1);
				console.log(response);
				setCanBeSaved(true);
			}
		}
		catch (e) {
			// Put stuff here
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

	// Reports recipe
	const handleReportRecipe = () => {
		setReportRecipeVisible(false);
		setReportSnackbarVisible(true);

		// Do more stuff here maybe
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
			<Text variant='bodyLarge' style={{ marginVertical: 5 }} key={ingredient}><Text style={{ color: 'grey' }}>-</Text> {ingredient}</Text>
		)
	});

	// Renders each recipe tip
	const recipeTips = (
		<>
			{
				recipe.Tips &&
				<ScrollView horizontal={true}>
					<View style={{ marginVertical: 10, flexDirection: 'row' }}>
						{recipe.Tips.map((tip) => {
							return (
								<RecipeTip>
									{tip}
								</RecipeTip>
							)
						})}
					</View>

				</ScrollView>
			}
		</>
	)

	// Renders each step of instructions 
	var stepCounter = 0;
	const instructions = recipe.Instructions.map((instruction) => {
		stepCounter++;
		return (
			<Text variant='bodyLarge' style={{ marginVertical: 10 }} key={"instruction" + stepCounter}><Text style={{ color: 'grey' }}>{stepCounter}. </Text>{instruction}</Text>
		)
	});

	return (
		<>
			{/* Custom recipePage header */}
			<Appbar.Header style={{ backgroundColor: '#000000' }}>
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				<Appbar.Content></Appbar.Content>
				<Pressable style={{ paddingRight: 16 }} onPress={() => navigation.navigate('CreateRecipeModal', {
					recipe: recipe
				})}>
					<MaskedView maskElement={<MaterialCommunityIcons name="creation" size={30} />}>
						<LinearGradient
							colors={["#38FFA0", "#00C2FF"]}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 0 }}
							style={{ width: 30, height: 30 }}
						/>
					</MaskedView>
				</Pressable>
				<Appbar.Action
					icon={"share"}
					size={30}
					onPress={() => handleShareRecipe()}
				/>
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
					<Text variant="bodyLarge" style={[styles.categoryTitle, { color: "rgb(0, 227, 138)" }]}>Nutrition:</Text>
					<Text variant="bodyLarge"><Text style={{ color: 'grey' }}>Calories: </Text>{recipe.NutritionFacts.calories}</Text>
					<Text variant="bodyLarge"><Text style={{ color: 'grey' }}>Total Fat: </Text>{recipe.NutritionFacts.totalFat}g</Text>
					<Text variant="bodyLarge" style={{ marginLeft: 30 }}><Text style={{ color: 'grey' }}>Saturated Fat: </Text>{recipe.NutritionFacts.saturatedFat}g</Text>
					<Text variant="bodyLarge" style={{ marginLeft: 30 }}><Text style={{ color: 'grey' }}>Trans Fat: </Text>{recipe.NutritionFacts.transFat}g</Text>
					<Text variant="bodyLarge"><Text style={{ color: 'grey' }}>Cholesterol: </Text>{recipe.NutritionFacts.cholesterol}mg</Text>
					<Text variant="bodyLarge"><Text style={{ color: 'grey' }}>Sodium: </Text>{recipe.NutritionFacts.sodium}mg</Text>
					<Text variant="bodyLarge"><Text style={{ color: 'grey' }}>Total Carbohydrates: </Text>{recipe.NutritionFacts.totalCarbohydrates}g</Text>
					<Text variant="bodyLarge"><Text style={{ color: 'grey' }}>Dietary Fiber: </Text>{recipe.NutritionFacts.dietaryFiber}g</Text>
					<Text variant="bodyLarge" style={{ marginLeft: 30 }}><Text style={{ color: 'grey' }}>Total Sugars: </Text>{recipe.NutritionFacts.totalSugars}g</Text>
					<Text variant="bodyLarge" style={{ marginLeft: 30 }}><Text style={{ color: 'grey' }}>Added Sugars: </Text>{recipe.NutritionFacts.addedSugars}g</Text>
					<Text variant="bodyLarge"><Text style={{ color: 'grey' }}>Protein: </Text>{recipe.NutritionFacts.protein}g</Text>

					<Text style={[styles.categoryTitle, { color: "rgb(0, 227, 138)" }]}>Ingredients:</Text>
					{ingredients}
					{recipeTips}
					<Text style={[styles.categoryTitle, { color: "rgb(0, 227, 138)" }]}>Instructions:</Text>
					{instructions}

					{/* RECIPE FOOTER */}
					{recipe.CreatorId != user.id &&
						<>
							<View style={{ backgroundColor: 'grey', height: 1, margin: 10 }}></View>
							<Pressable onPress={() => setReportRecipeVisible(true)}>
								<Text variant="labelLarge" style={{ color: 'grey', textAlign: 'center' }}>report this recipe</Text>
							</Pressable>
						</>
					}
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
			<Snackbar
				visible={reportSnackbarVisible}
				onDismiss={() => setReportSnackbarVisible(false)}
				action={{
					label: 'OK',
					onPress: () => { },
				}}>
				{"Recipe reported."}
			</Snackbar>

			<Portal>
				<Dialog visible={reportRecipeVisible} onDismiss={() => setReportRecipeVisible(false)}>
					<Dialog.Title style={{ fontWeight: 700, color: "rgb(0, 227, 138)" }}>Report a recipe</Dialog.Title>
					<Dialog.Content>
						<View style={{ paddingVertical: 10 }}>
							<Pressable onPress={() => setReportInaccurateChecked(!reportInaccurateChecked)} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
								<Checkbox.Android status={reportInaccurateChecked ? "checked" : "unchecked"} />
								<Text variant="bodyMedium">This recipe is inaccurate</Text>
							</Pressable>
							<Pressable onPress={() => setReportInappropriateRecipeChecked(!reportInappropriateRecipeChecked)} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
								<Checkbox.Android status={reportInappropriateRecipeChecked ? "checked" : "unchecked"} />
								<Text variant="bodyMedium">This recipe contains inappropriate content</Text>
							</Pressable>
							<Pressable onPress={() => setReportInappropriateUserChecked(!reportInappropriateUserChecked)} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
								<Checkbox.Android status={reportInappropriateUserChecked ? "checked" : "unchecked"} />
								<Text variant="bodyMedium">This recipe's creator has an inappropriate or offensive username</Text>
							</Pressable>
							<Pressable onPress={() => setReportInedibleChecked(!reportInedibleChecked)} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
								<Checkbox.Android status={reportInedibleChecked ? "checked" : "unchecked"} />
								<Text variant="bodyMedium">This recipe contains dangerous, illegal, or inedible ingredients</Text>
							</Pressable>
						</View>

					</Dialog.Content>
					<Dialog.Actions>
						<Button onPress={handleReportRecipe} disabled={reportInaccurateChecked || reportInappropriateRecipeChecked || reportInappropriateUserChecked || reportInedibleChecked ? false : true}>Submit</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>
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