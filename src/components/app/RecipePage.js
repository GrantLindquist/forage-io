import { useRoute } from "@react-navigation/native";
import { useNavigation } from '@react-navigation/native';
import { ScrollView, View , StyleSheet, Modal } from "react-native";
import { Text, Snackbar, Appbar, FAB } from "react-native-paper";
import { useUser } from "@clerk/clerk-expo";
import RecipeTag from "./RecipeTag";
import RemixRecipeModal from './RemixRecipeModal';
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

	// State for interacting with FAB group
	const [fabOpen, setFabOpen] = useState(false);

	// State for interacting with RemixRecipeModal component
	const [remixModalVisible, setRemixModalVisible] = useState(false);

	// State that tracks snackbar status
	const [snackbarVisible, setSnackbarVisible] = useState(false);

	// Method for determining user action in FAB group
	const determineUserAction = () => {
		// If user has created recipe, display delete action
		if (user.id == recipe.CreatorId){
			return {
				icon: 'delete',
				label: 'Delete',
				onPress: () => handleDeleteRecipe(),
			}
		}
		// If user did not create recipe but has recipe saved, display unsave action
		else if (user.unsafeMetadata.savedRecipeIds.includes(recipe.RecipeId)){
			return {
				icon: 'bookmark',
				label: 'Unsave',
				onPress: () => handleSaveRecipe(),
			}
		}
		// Otherwise, display save action
		else {
			return {
				icon: 'bookmark',
				label: 'Save',
				onPress: () => handleSaveRecipe(),
			}
		}
	}

	// User action that depends on state of recipe
	const [userAction, setUserAction] = useState(determineUserAction());

	// Deletes recipe from DB
	const handleDeleteRecipe = async() => {
		// Executes request
		const response = recipeService.deleteRecipe(user.id, recipe.RecipeId);
		
		// Redirects user
		navigation.goBack();

		// Refreshes createdRecipes.js
		props.refreshCreatedRecipes();

		// Updates FAB display
		setUserAction(determineUserAction());

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
		}

		// Update user with new list of ids
		const response = await user.update({
			unsafeMetadata: { savedRecipeIds }
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
	const recipeTags = recipe.Tags.map((tag) => {
		return(
			<RecipeTag key={tag} title={tag} immutable={true}/>
		)
	});

	// Renders each ingredient 
	const ingredients = recipe.Ingredients.map((ingredient) => {
		return(
			<Text variant='bodyLarge' style={{marginVertical: 5}} key={ingredient}><Text style={{color: colors['primary']}}>-</Text> {ingredient}</Text>
		)
	});

	// Renders each step of instructions 
	var stepCounter = 0;
	const instructions = recipe.Instructions.map((instruction) => {
		stepCounter++;
		return(
			<Text variant='bodyLarge' style={{marginVertical: 10}} key={"instruction" + stepCounter}><Text style={{color: colors['primary']}}>{stepCounter}. </Text>{instruction}</Text>
		)
	});

	return (
		<>
			{/* Custom recipePage header */}
			<Appbar.Header style={{backgroundColor: colors['background2']}}>
				<Appbar.BackAction onPress={() => navigation.goBack()}/>
				<Appbar.Content></Appbar.Content>
				<Appbar.Action icon={'dots-vertical'} onPress={() => setFabOpen(true)} />
			</Appbar.Header>

			<ScrollView style={{backgroundColor: colors['background2']}}>
				<View style={styles.container}>
					<Text variant="bodySmall"><MaterialCommunityIcons name="account" size={14} /> {recipe.CreatorUsername.toUpperCase()}</Text>
					<Text style={styles.recipeTitle}>{recipe.Title}</Text>
					<View style={{ marginTop: 15,  flexDirection: 'row'}}>
						<View style={{alignItems: 'center', width: '33%'}}>
							<Text variant="bodyLarge">Serves</Text>
							<Text variant="headlineLarge">{recipe.Servings}</Text>
						</View>
						<View style={{alignItems: 'center' , borderColor: colors['primary'], borderLeftWidth: '1', borderRightWidth: '1', width: '33%'}}>
							<Text variant="bodyLarge">Time</Text>
							<Text variant="headlineLarge">{recipe.CreationTime}</Text>
						</View>
						<View style={{alignItems: 'center', width: '33%'}}>
							<Text variant="bodyLarge">Budget</Text>
							<Text variant="headlineLarge">{recipe.Budget}</Text>
						</View>
					</View>
					<View style={{ marginTop: 15, flexWrap: 'wrap', flexDirection: 'row'}}>
						{recipeTags}
					</View>
					<Text style={styles.categoryTitle}>Ingredients</Text>
					{ingredients}
					<Text style={styles.categoryTitle}>Instructions</Text>
					{instructions}
				</View>
			</ScrollView>
			<FAB.Group
				open={fabOpen}
				visible={false}
				style={{bottom: -100}}
				actions={[
					userAction,
					{
						icon: 'email',
						label: 'Remix',
						onPress: () => setRemixModalVisible(true),
					},
					{
						icon: 'bell',
						label: 'Share',
						onPress: () => console.log('Pressed share'),
					},
				]}
				onStateChange={() => setFabOpen(!fabOpen)}
			/>
			<Snackbar
				visible={snackbarVisible}
				onDismiss={() => setSnackbarVisible(false)}
				action={{
					label: 'OK',
					onPress: () => {},
				}}>
				{userAction.label == 'Save' ? "Recipe has been unsaved!" : "Recipe has been saved!"}
			</Snackbar>

			{/* Remix recipe modal */}
			<Modal
				animationType="slide"
				visible={remixModalVisible}
				presentationStyle={"pageSheet"}
				onRequestClose={() => {
					setRemixModalVisible(!remixModalVisible);
				}}
			>
				<RemixRecipeModal recipe={recipe} refreshCreatedRecipes={() => props.refreshCreatedRecipes()} closeModal={() => setRemixModalVisible(false)}/>
			</Modal>
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
		marginVertical: 15
	}
});