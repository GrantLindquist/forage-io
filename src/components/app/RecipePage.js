import { useRoute } from "@react-navigation/native";
import { useNavigation } from '@react-navigation/native';
import { ScrollView, View , StyleSheet, Image } from "react-native";
import { Text, Snackbar, Appbar, FAB } from "react-native-paper";
import { useUser } from "@clerk/clerk-expo";
import RecipeTag from "./RecipeTag";
import { useState } from "react";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import recipeService from "../../services/recipeService";
import colors from "../../../colors.json";

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

	// Method for determining user action in FAB group
	const determineUserAction = () => {
		// If user has created recipe, display delete action
		if (user.id == recipe.CreatorId){
			return (
				<Appbar.Action icon={'delete'} size={24} onPress={() => handleDeleteRecipe()} />
			)
		}
		// If user did not create recipe but has recipe saved, display unsave action
		else if (user.unsafeMetadata.savedRecipeIds.includes(recipe.RecipeId)){
			return (
				<Appbar.Action icon={'star'} size={24} onPress={() => handleSaveRecipe()} />
			)
		}
		// Otherwise, display save action
		else {
			return (
				<Appbar.Action icon={'star'} size={24} onPress={() => handleSaveRecipe()} />
			)
		}
	}

	// User action that depends on state of recipe
	const [userAction, setUserAction] = useState(determineUserAction());

	// Deletes recipe from DB
	const handleDeleteRecipe = async() => {
		// Executes request
		const response = recipeService.deleteRecipe(user.id, recipe.RecipeId);

		// Refreshes createdRecipes.js
		props.refreshCreatedRecipes();

		// Updates FAB display
		setUserAction(determineUserAction());

		// Redirects user
		navigation.navigate("Created", {
			removeRecipeId: recipe.RecipeId
		});

		// Returns response
		return response;
	}

	// Appends or removes recipe id to/from user's saved recipe ids
	const handleSaveRecipe = async () => {
		const prevSavedRecipeIds = user.unsafeMetadata.savedRecipeIds;
		var savedRecipeIds = [];
		var savingRecipe = true;

		// If user has any saved recipes, loop through and place into new id list
		if(prevSavedRecipeIds){
			for(item of prevSavedRecipeIds){
				// Unsave recipe if recipe is already saved
				if(item == recipe.RecipeId)
				{
					savingRecipe = false;
				}
				// Append id otherwise
				else{
					savedRecipeIds.push(item);
				}
			}
		}

		// Place newly handled recipe id into list if recipe id hasn't already been removed
		if(savingRecipe){
			savedRecipeIds.push(recipe.RecipeId);

			// Execute service request
			let response = await recipeService.updateRecipeStars(recipe.CreatorId, recipe.RecipeId, Number(recipe.Stars) + 1);
			console.log(response);
		}
		else{
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

		// Refreshes savedRecipes.js
		props.refreshSavedRecipes();

		// Updates FAB display
		setUserAction(determineUserAction());

		// Displays Snackbar
		setSnackbarVisible(true);
		
		console.log(savedRecipeIds);
		return response;
	}

	// Sub-component that lists a tag component for each recipe tag
	const recipeTags = Object.entries(recipe.Tags).map((tag) => {
		
		// Parse title from JSON property to tag string
		let title = tag[0].charAt(2).toLowerCase() + tag[0].slice(3);

		return(
			<RecipeTag key={title} title={title} immutable={true}/>
		)
	});

	// Renders each ingredient 
	const ingredients = recipe.Ingredients.map((ingredient) => {
		return(
			<Text variant='bodyLarge' style={{marginVertical: 5}} key={ingredient}><Text style={{fontWeight: 700, color: colors['green']}}>-</Text> {ingredient}</Text>
		)
	});

	// Renders each step of instructions 
	var stepCounter = 0;
	const instructions = recipe.Instructions.map((instruction) => {
		stepCounter++;
		return(
			<Text variant='bodyLarge' style={{marginVertical: 10}} key={"instruction" + stepCounter}><Text style={{fontWeight: 700, color: colors['pink']}}>{stepCounter}. </Text>{instruction}</Text>
		)
	});

	return (
		<>
			{/* Custom recipePage header */}
			<Appbar.Header style={{backgroundColor: colors['background2']}}>
				<Appbar.BackAction onPress={() => navigation.goBack()}/>
				<Appbar.Content></Appbar.Content>
				<Appbar.Action icon={'bell'} size={24} />
				<Appbar.Action icon={() => <Image 
					source={require('../../../assets/icons/remix-action.png')}
					style={{height: 24, width: 24}} />} 
					onPress={() => navigation.navigate('remixRecipeModal', {
							recipe: recipe
				})}/>
				{userAction}
			</Appbar.Header>

			<ScrollView style={{backgroundColor: colors['background2']}}>
				<View style={styles.container}>
					<Text style={styles.subtext}><MaterialCommunityIcons name="account" size={14} /> {recipe.CreatorUsername.toUpperCase()}</Text>
					<Text style={styles.recipeTitle}>{recipe.Title}</Text>
					<View style={{ marginTop: 15,  flexDirection: 'row'}}>
						<View style={{alignItems: 'center', width: '20%'}}>
							<Text style={styles.subtext}>Serves</Text>
							<Text variant="headlineMedium">{recipe.Servings}</Text>
						</View>
						<View style={{alignItems: 'center', borderColor: colors['blue'], borderLeftWidth: '2', borderRightWidth: '2', width: '40%'}}>
							<Text  style={styles.subtext}>Budget</Text>
							<Text variant="headlineMedium">${Number(recipe.Budget).toFixed(2)}</Text>
						</View>
						<View style={{alignItems: 'center' , width: '40%'}}>
							<Text style={styles.subtext}>Time</Text>
							<Text variant="headlineMedium">{recipe.CreationTime}</Text>
						</View>
					</View>
					<Text style={[styles.categoryTitle, {color: colors['green']}]}>Ingredients:</Text>
					{ingredients}
					<Text style={[styles.categoryTitle, {color: colors['pink']}]}>Instructions:</Text>
					{instructions}
					<Text style={[styles.categoryTitle, {color: colors['yellow']}]}>Tags:</Text>
					<View style={{ flexWrap: 'wrap', flexDirection: 'row'}}>
						{recipeTags}
					</View>
				</View>
			</ScrollView>
			<Snackbar
				visible={snackbarVisible}
				onDismiss={() => setSnackbarVisible(false)}
				action={{
					label: 'OK',
					onPress: () => {},
				}}>
				{userAction.label == 'Save' ? "Recipe has been unsaved!" : "Recipe has been saved!"}
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
		fontWeight: 700
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