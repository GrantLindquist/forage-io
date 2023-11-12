import { useState, useRef, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Image } from "react-native";
import { Text, TextInput, Button, IconButton, Checkbox, ActivityIndicator, Snackbar, ProgressBar, Portal, Dialog } from 'react-native-paper';
import IngredientTag from './IngredientTag'
import BudgetSlider from './BudgetSlider';
import TagSearch from './TagSearch';
import recipeService from '../../services/recipeService';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useUser } from '@clerk/clerk-expo';
import { useNavigation, useRoute } from '@react-navigation/native';
import RecipeTag from './RecipeTag';
const ms = require('ms');

// Contains UI components that must be rendered on the highest z-index (modals, dialogs, etc.)
export default function CreateRecipeModal(props) {

	// Gets user from Clerk
	const { user } = useUser(); 

	// Navigation object
	const navigation = useNavigation();

	// State that tracks whether or not recipe is being actively generated
	const [isGeneratingRecipe, setGeneratingRecipe] = useState(false);

	// State that tracks snackbar status
	const [infoSnackbarVisible, setInfoSnackbarVisible] = useState(false);
	const [errorSnackbarVisible, setErrorSnackbarVisible] = useState(false);

	// List states that track filter categories
	const [selectedFilters, setSelectedFilters] = useState([]);
	const [selectedIngredients, setSelectedIngredients] = useState([]);

	// State for tracking recipe charge progress bar
	const [recipeCharges, setRecipeCharges] = useState(10 - user.unsafeMetadata.recipeCharges.length);

	// State for tracking dialogs
	const [errorDialogVisible, setErrorDialogVisible] = useState(false);
	const [errorDialogContent, setErrorDialogContent] = useState("");
	const [infoDialogVisible, setInfoDialogVisible] = useState(false);
	const [infoDialogPageNumber, setInfoDialogPageNumber] = useState(0);

	// State for tracking active ingredient input
	const [ingredientInput, setIngredientInput] = useState('');

	// State for tracking budget
	const budget = useRef(-1);

	// Recipe that may be passed through route to signal remix recipe
	const route = useRoute();
	const [remixRecipe, setRemixRecipe] = useState('');

	// Checks whether to render modal as 'create' or 'remix'
	useEffect(() => {
		if(route.params){
			setRemixRecipe(route.params.recipe);
		}
	}, []);

	// State for tracking checkbox status
	const [isPublicChecked, setPublicChecked] = useState(true);

	// List of dialog content options for the recipe modal
	const infoDialogContent = [
		<>
			<Dialog.Title>Recipe Tags</Dialog.Title>
			<Dialog.Content>
				<Text pointerEvents='none'>
					A "tag" is an adjective used for describing the recipes you want to generate.
					For example, if you want to generate a Mexican recipe that is spicy, you should
					select the <RecipeTag title={'mexican'} immutable={true}/> and <RecipeTag title={'spicy'} 
					immutable={true}/> tags. There are four types of tag: <Text >
					diet</Text>, and <Text>flavor</Text>meal</Text>, 
					<Text>cuisine</Text>, <Text>. You can 
					only select a few of each tag. 
				</Text>
			</Dialog.Content>
		</>,
		<>
			<Dialog.Title>Adding Ingredients</Dialog.Title>
			<Dialog.Content>
				<Text>
					Additionally, you can specify up to five ingredients you would like to see in the recipe.
					Any input that isn't an edible food item will cause a failed recipe generation.
				</Text>
				<Text>Yes:</Text>
				<View pointerEvents='none' style={{flexDirection: 'row'}}>
					<IngredientTag>Spinach</IngredientTag>
					<IngredientTag>Eggs</IngredientTag>
					<IngredientTag>Milk</IngredientTag>
				</View>
				<Text>No:</Text>
				<View  pointerEvents='none' style={{flexDirection: 'row'}}>
					<IngredientTag>Dirt</IngredientTag>
					<IngredientTag>Antifreeze</IngredientTag>
					<IngredientTag>Etc.</IngredientTag>
				</View>
			</Dialog.Content>
		</>,
		<>
			<Dialog.Title>Recipe Charges</Dialog.Title>
			<Dialog.Content>
				<Text>
					A "charge" is a unit that allows you to generate a recipe. One charge will replenish every
					hour and you can hold a maximum of 10 charges at a time. If you'd like to replenish charges
					without waiting, press on <Text style={{ fontWeight: 700}}>Get more charges </Text>.
				</Text>
			</Dialog.Content>
		</>,
	];

	// Creates a recipe using user-specified filters
	const handleCreateRecipe = async() => {
		// String for describing ingredients for recipe
		let ingredientString = '';
		let i = 0;
		// List ingredients if ingredient list state is not empty
		if(selectedIngredients.length > 0){
			ingredientString = ' that contains';
			for(let item of selectedIngredients){
				// Adds a comma if there are more ingredients remaining in list
				ingredientString = ingredientString + ' ' + item + (selectedIngredients.length == i+1 ? "" : ",");
				i++;
			}
		}

		// String for describing recipe budget
		let budgetString = '';
		if(budget.current != -1){
			budgetString = ' with a budget of under $' + budget.current;
		}

		// Create recipe description & tags
		let recipeDescription = '';
		let recipeTags = [];
		for(let filter of selectedFilters){
			recipeDescription = recipeDescription.concat(filter + " ");
			recipeTags.push(filter);
		}
		recipeDescription = recipeDescription.concat(`recipe${ingredientString}${budgetString}`); 

		// DTO object for prompting GPT
		let recipeDTO = {
			description: recipeDescription,
			tags: recipeTags,
			ingredients: selectedIngredients,
			isPublic: isPublicChecked ? 1 : 0
		}

		// Set loading state to true
		setGeneratingRecipe(true);

		// Add charge to user object
		var recipeCharges = user.unsafeMetadata.recipeCharges;
		recipeCharges.push(Date.now());
		await user.update({
			unsafeMetadata: { 
				savedRecipeIds: user.unsafeMetadata.savedRecipeIds,
				recipeCharges: recipeCharges,
			}
		});

		// Update charge in UI
		setRecipeCharges(10 - user.unsafeMetadata.recipeCharges.length);
		
		// Confirm recipe completion and change state back to false once recipe is complete
		// const response = remixRecipe.recipeId ? await recipeService.remixRecipe(recipeDTO, user, remixRecipe) : await recipeService.generateRecipe(recipeDTO, user);
		const response = await recipeService.generateRecipe(recipeDTO, user);
		setGeneratingRecipe(false);

		// Display snackbar depending on service response
		if(response.ok){
			setInfoSnackbarVisible(true);
			setSelectedIngredients([]);
			setSelectedFilters([]);

			// Refreshes recipeMenu component so user can see updated recipe list
			props.refreshCreatedRecipes();
		}
		else{
			// Display error UI components
			setErrorDialogContent(response.message);
			setErrorSnackbarVisible(true);

			// Clear ingredients state of faulty input
			setSelectedIngredients([]);
		}
	}

	// Appends ingredient to ingredient list state
	const addIngredient = (value) => {
		// Adds ingredient to state and updates
		let newIngredientList = [];
		for(item of selectedIngredients){
			newIngredientList.push(item);
		}
		newIngredientList.push(value);
		setSelectedIngredients(newIngredientList);
		setIngredientInput('');
	}

	// List of ingredients that user wants to add to recipe
	const ingredientTags = selectedIngredients.map((item) => {
		return(
			<IngredientTag key={item}>{item}</IngredientTag>
		)
	});

	return (
	<View style={{ flex: 1 ,flexDirection: 'column', justifyContent: 'flex-end'}}>
		<View style={{ height: '95%', backgroundColor: '#222222'}}>
			<ProgressBar progress={recipeCharges/10} />
			<View>
				<View style={{ alignItems: 'center', flexDirection: 'row', marginHorizontal: 15, marginTop: 10}}>
					<Image 
						source={require('../../../assets/icons/charge.png')}
						style={{width: 18, height: 18}}
					/>
					<Text style={{color: 'grey'}}>{recipeCharges}/10  </Text>
					<Text style={{fontWeight: 700}}>Get more charges</Text>
					<IconButton onPress={() => setInfoDialogVisible(true)} style={{marginLeft: 'auto', margin: 0}} icon={"information-outline"}></IconButton>
				</View>
				{/* Displays component depending on whether or not recipe is loading */}
				{!isGeneratingRecipe ? <>
				{/* Displays recipe information if provided */}
				{remixRecipe ? 
				<View style={{marginHorizontal: 20}}>
					<Text variant="bodySmall"><MaterialCommunityIcons name="account" size={14} /> {remixRecipe.CreatorUsername.toUpperCase()}</Text>
					<Text style={styles.recipeTitle}>{remixRecipe.Title}</Text>
					<View style={{ marginTop: 15,  flexDirection: 'row', justifyContent: 'space-evenly'}}>
						<View style={{alignItems: 'center'}}>
							<Text style={styles.subtext}>Serves</Text>
							<Text variant="headlineMedium">{remixRecipe.Servings}</Text>
						</View>
						<View style={{alignItems: 'center', paddingHorizontal: 25, borderColor: "rgb(0, 227, 138)", borderLeftWidth: '2', borderRightWidth: '2'}}>
							<Text  style={styles.subtext}>Budget</Text>
							<Text variant="headlineMedium">${Number(remixRecipe.Budget).toFixed(2)}</Text>
						</View>
						<View style={{alignItems: 'center' }}>
							<Text style={styles.subtext}>Time</Text>
							<Text variant="headlineMedium">{ms(remixRecipe.CreationTime, { long: false })}</Text>
						</View>
					</View>
				</View>
				: <></>}
				<View style={{margin: 20, marginTop: 0}}>
					<Text style={styles.categoryTitle}>Add some tags!</Text>
					<TagSearch 
						dark={true}
						updateSelectedTags={(tags) => setSelectedFilters(tags)} 
						defaultTags={remixRecipe != '' ? remixRecipe.Tags : []}
					/>
										
					<Text style={styles.categoryTitle}>Add some ingredients!</Text>
					<View style={{flexDirection: 'row'}}>
						<TextInput keyboardAppearance='dark' style={styles.addIngredients} value={ingredientInput} mode='outlined' onChangeText={(val) => setIngredientInput(val)}/>
						<IconButton style={styles.addIngredientButton} size={20} mode={'outlined'} icon={'plus'} onPress={() => addIngredient(ingredientInput)}/>
					</View>

					<ScrollView style={{paddingVertical:8}} horizontal={true}>
						{ingredientTags}
					</ScrollView>

					<Text style={styles.categoryTitle}>More options</Text>
					<BudgetSlider handleValueChange={(val) => budget.current = val}/>

					<View style={{flexDirection: 'row', alignItems: 'center'}}>
						<Text variant='bodyLarge'>Make recipe public</Text>
						<Checkbox.Android 
							status={isPublicChecked ? "checked" : "unchecked"}
							onPress={() => {
								setPublicChecked(!isPublicChecked);
							}}
						/>
					</View>
					<Button disabled={recipeCharges == 0 ? true : false} onPress={handleCreateRecipe}>GENERATE RECIPE</Button>
				</View></>
				: <View style={styles.loadingScreen}>
					<ActivityIndicator size={"large"} animating={true}></ActivityIndicator>
				</View>}
			</View>	

			<Portal>
				{/* Info dialog */}
				<Dialog visible={infoDialogVisible} onDismiss={() => setInfoDialogVisible(false)}>
					{infoDialogContent[infoDialogPageNumber]}
					<Dialog.Actions>
						<Button disabled={infoDialogPageNumber <= 0 ? true : false} onPress={() => setInfoDialogPageNumber(infoDialogPageNumber-1)}>Previous</Button>
						<Button disabled={infoDialogPageNumber >= 2 ? true : false} onPress={() => setInfoDialogPageNumber(infoDialogPageNumber+1)}>Next</Button>
					</Dialog.Actions>
				</Dialog>

				{/* Warning dialog */}
				<Dialog visible={errorDialogVisible} onDismiss={() => setErrorDialogVisible(false)}>
					<Dialog.Content>
						<Text variant="bodyMedium">{errorDialogContent}</Text>
					</Dialog.Content>
					<Dialog.Actions>
						<Button onPress={() => setErrorDialogVisible(false)}>OK</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>
			
			{/* Info snackbar */}
			<Snackbar
				visible={infoSnackbarVisible}
				onDismiss={() => setInfoSnackbarVisible(false)}
				action={{
					label: 'View',
					onPress: () => navigation.navigate('Main'),
				}}>
				Recipe was successfully generated!
			</Snackbar>
			
			{/* Error snackbar */}
			<Snackbar
				visible={errorSnackbarVisible}
				onDismiss={() => setErrorSnackbarVisible(false)}
				action={{
					label: 'Why?',
					onPress: () => setErrorDialogVisible(true),
				}}>
				Recipe failed to generate.
			</Snackbar>
		</View>
	</View>
	);	
};

const styles = StyleSheet.create({
	categoryTitle: {
		// fontFamily: 'Roboto',
		fontSize: 22,
		fontWeight: 700,
		marginBottom: 5,
		marginTop: 10
	},
	categorySubtitle: {
		// fontFamily: 'Roboto',
		fontSize: 12,
		fontWeight: 700,
		color: '#666666'
	},
	recipeTitle: {
		// fontFamily: 'Roboto',
		fontSize: 36,
		fontWeight: 700
	},
	loadingScreen:{
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	addIngredients: {
		height: 35,
		width: '85%',
	},
	addIngredientButton: {
		borderRadius: '5',
		borderWidth: 0,
		marginBottom: 0,
		marginRight: 0,
		marginLeft: 10
	},
});