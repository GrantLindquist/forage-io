import { useState, useRef, useEffect, useMemo } from 'react';
import { View, ScrollView, StyleSheet, Image, Pressable } from "react-native";
import { Text, TextInput, Button, IconButton, Checkbox, ActivityIndicator, Snackbar, ProgressBar, Portal, Dialog, HelperText, useTheme } from 'react-native-paper';
import IngredientTag from './IngredientTag'
import BudgetSlider from './BudgetSlider';
import TagSearch from './TagSearch';
import recipeService from '../../services/recipeService';
import { useUser } from '@clerk/clerk-expo';
import { useNavigation, useRoute } from '@react-navigation/native';
import RecipeTag from './RecipeTag';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

const ms = require('ms');

// Contains UI components that must be rendered on the highest z-index (modals, dialogs, etc.)
export default function CreateRecipeModal(props) {

	// Gets user from Clerk
	const { user } = useUser();

	const theme = useTheme();

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
	const recipeChargesValueColor = useMemo(() => {
		if (recipeCharges == 0) {
			return "red";
		}
		else if (recipeCharges <= 3) {
			return "yellow";
		}
		else {
			return "grey";
		}
	}, [recipeCharges])

	// State for tracking dialogs
	const [errorDialogVisible, setErrorDialogVisible] = useState(false);
	const [errorDialogContent, setErrorDialogContent] = useState("");
	const [infoDialogVisible, setInfoDialogVisible] = useState(false);
	const [infoDialogPageNumber, setInfoDialogPageNumber] = useState(0);

	// State for tracking active ingredient input
	const [ingredientInput, setIngredientInput] = useState('');
	// State for displaying dumb user UX helper text
	const [ingredientHelperText, setIngredientHelperText] = useState('');

	// State for tracking budget
	const budget = useRef(-1);

	// Recipe that may be passed through route to signal remix recipe
	const route = useRoute();
	const remixRecipe = route.params ? route.params.recipe : undefined;

	const [remixRecipeVisible, setRemixRecipeVisible] = useState(false);

	// List of info dialog content options for the recipe modal
	const infoDialogContent = [
		<>
			<Dialog.Title style={{ color: theme.colors.primary, fontWeight: 700, marginBottom: 12 }}>Creating a Recipe</Dialog.Title>
			<Dialog.Content pointerEvents='none' style={{ lineHeight: 22 }}>
				<Text style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>Recipe Tags</Text>
				<Text style={{ paddingBottom: 12 }}>
					A "tag" is an adjective used for describing the recipes you want to generate.
				</Text>
				<Text style={{ paddingBottom: 12 }}>
					For example, if you want to generate a vegan Mexican breakfast recipe that is spicy, you should
					select the following tags:
				</Text>
				<View style={{ flexDirection: 'row', paddingBottom: 6 }}>
					<RecipeTag title={'vegan'} immutable={true} />
					<RecipeTag title={'mexican'} immutable={true} />
					<RecipeTag title={'breakfast'} immutable={true} />
					<RecipeTag title={'spicy'} immutable={true} />
				</View>
				<Text>
					There are four types of tag:
					<Text style={{ fontWeight: 700, color: '#FF008A' }}> cuisine</Text>,
					<Text style={{ fontWeight: 700, color: '#00A3FF' }}> meal type</Text>,
					<Text style={{ fontWeight: 700, color: '#FF7A00' }}> diet</Text>, and
					<Text style={{ fontWeight: 700, color: '#7000FF' }}> flavor</Text>.
					You can only select a few of each tag.
				</Text>
			</Dialog.Content>
		</>,
		<>
			<Dialog.Title style={{ color: theme.colors.primary, fontWeight: 700, marginBottom: 12 }}>Creating a Recipe</Dialog.Title>
			<Dialog.Content pointerEvents='none' style={{ lineHeight: 22 }}>
				<Text style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Ingredients</Text>
				<Text style={{ paddingBottom: 12 }}>
					Additionally, you can specify up to five ingredients you would like to see in the recipe.
					Any input that isn't an edible food item not be included in the recipe.
				</Text>
				<Text style={{ paddingBottom: 8 }}>Yes:</Text>
				<View style={{ flexDirection: 'row', paddingBottom: 8 }}>
					<IngredientTag>Spinach</IngredientTag>
					<IngredientTag>Eggs</IngredientTag>
					<IngredientTag>Milk</IngredientTag>
				</View>
				<Text style={{ paddingBottom: 8 }}>No:</Text>
				<View pointerEvents='none' style={{ flexDirection: 'row' }}>
					<IngredientTag>Dirt</IngredientTag>
					<IngredientTag>Antifreeze</IngredientTag>
					<IngredientTag>XYZ</IngredientTag>
				</View>
			</Dialog.Content>
		</>,
		<>
			<Dialog.Title style={{ color: theme.colors.primary, fontWeight: 700, marginBottom: 12 }}>Creating a Recipe</Dialog.Title>
			<Dialog.Content pointerEvents='none' style={{ lineHeight: 22 }}>
				<Text style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Recipe Charges</Text>
				<Text>
					A "charge" is a unit that allows you to generate a recipe. One charge will replenish every
					hour and you can hold a maximum of 10 charges at a time.
					{/* If you'd like to replenish charges without waiting, press on <Text style={{ fontWeight: 700}}>Get more charges </Text>. */}
				</Text>
			</Dialog.Content>
		</>,
	];

	// Creates a recipe using user-specified filters
	const handleCreateRecipe = async () => {
		// Alert user that ingredientInput is not empty before generating recipe
		if (ingredientInput != '') {
			setIngredientHelperText("Did you mean to add this ingredient to your recipe?");
		}
		else {
			// String for describing ingredients for recipe
			let ingredientString = '';
			let i = 0;
			// List ingredients if ingredient list state is not empty
			if (selectedIngredients.length > 0) {
				ingredientString = ' that contains';
				for (let item of selectedIngredients) {
					// Adds a comma if there are more ingredients remaining in list
					ingredientString = ingredientString + ' ' + item + (selectedIngredients.length == i + 1 ? "" : ",");
					i++;
				}
			}

			// String for describing recipe budget
			let budgetString = budget.current != -1 ? ' with a budget of under $' + budget.current : ' with a budget of under $7.50';

			// Create recipe description & tags
			let recipeDescription = '';
			let recipeTags = [];
			for (let filter of selectedFilters) {
				recipeDescription = recipeDescription.concat(filter + " ");
				recipeTags.push(filter);
			}
			recipeDescription = recipeDescription.concat(`recipe${ingredientString}${budgetString}`);

			// DTO object for prompting GPT
			let recipeDTO = {
				description: recipeDescription,
				tags: recipeTags,
				ingredients: selectedIngredients,
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
			const response = remixRecipe ? await recipeService.remixRecipe(recipeDTO, user, remixRecipe) : await recipeService.generateRecipe(recipeDTO, user);
			setGeneratingRecipe(false);

			// Display snackbar depending on service response
			if (response.ok) {
				setInfoSnackbarVisible(true);
				setSelectedIngredients([]);
				setSelectedFilters([]);

				// Refreshes recipeMenu component so user can see updated recipe list
				props.refreshCreatedRecipes();
			}
			else {
				// Display error UI components
				setErrorDialogContent(response.message);
				setErrorSnackbarVisible(true);

				// Clear ingredients state of faulty input
				setSelectedIngredients([]);
			}
		}
	}

	// Appends ingredient to ingredient list state
	const addIngredient = (value) => {
		// Remove ingredient helper text
		setIngredientHelperText('');

		// Adds ingredient to state and updates
		let newIngredientList = [];
		for (item of selectedIngredients) {
			newIngredientList.push(item);
		}
		newIngredientList.push(value);
		setSelectedIngredients(newIngredientList);
		setIngredientInput('');
	}

	// Removes ingredient from list dstate
	const deleteIngredient = (value) => {
		// Adds ingredient to state and updates
		let newIngredientList = [];
		for (item of selectedIngredients) {
			if (item != value) {
				newIngredientList.push(item);
			}
		}
		setSelectedIngredients(newIngredientList);
	}

	// Arranges tags from mapped attributes to string array
	const formatTags = (tags) => {
		let formattedTags = [];
		for (let tag of Object.keys(tags)) {
			formattedTags.push(tag.charAt(2).toLowerCase() + tag.slice(3));
		}
		return formattedTags;
	}

	// List of ingredients that user wants to add to recipe
	const ingredientTags = selectedIngredients.map((item) => {
		return (
			<IngredientTag key={item} handleDelete={() => deleteIngredient(item)}>{item}</IngredientTag>
		)
	});

	return (
		<View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-end' }}>
			<View style={{ height: '95%', backgroundColor: '#000000' }}>
				<View>
					<View style={{ backgroundColor: '#222222', borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
						<ProgressBar progress={recipeCharges / 10} />
						<View style={{ marginHorizontal: 15, marginTop: 15 }}>
							<View style={{ alignItems: 'center', flexDirection: 'row' }}>
								<Image
									source={require('../../../assets/icons/charge.png')}
									style={{ width: 18, height: 18 }}
								/>
								<Text style={{ color: recipeChargesValueColor }}> {recipeCharges}
									<Text style={{ color: 'grey' }}>/10</Text>
								</Text>
								{/* <Text style={{fontWeight: 700}}>Get more charges</Text> */}
							</View>
							<View style={[{ alignItems: 'center', flexDirection: 'row' }, !remixRecipe && { marginBottom: 15 }]}>
								<Text variant="headlineMedium" style={{ color: theme.colors.primary, fontWeight: 700 }}>{remixRecipe ? "Remix Recipe" : "Generate Recipe"}</Text>
								<IconButton onPress={() => setInfoDialogVisible(true)} style={{ margin: 0 }} icon={"information-outline"}></IconButton>
							</View>
							{remixRecipe &&
								<Pressable style={{ marginBottom: 15 }} onPress={() => setRemixRecipeVisible(!remixRecipeVisible)}>
									{remixRecipeVisible ?
										<Text>Hide Original</Text> : <Text>View Original</Text>
									}

								</Pressable>
							}
						</View>
					</View>

					{/* Displays component depending on whether or not recipe is loading */}
					{!isGeneratingRecipe ? <>
						{/* Displays recipe information if provided */}
						{remixRecipe ?
							<>
								{remixRecipeVisible &&
									<View style={{ margin: 20 }}>
										<Text style={styles.recipeTitle}>{remixRecipe.Title}</Text>
										<View style={{ marginTop: 15, flexDirection: 'row', justifyContent: 'space-evenly' }}>
											<View style={{ alignItems: 'center' }}>
												<Text style={styles.subtext}>Serves</Text>
												<Text variant="headlineMedium">{remixRecipe.Servings}</Text>
											</View>
											<View style={{ alignItems: 'center', paddingHorizontal: 25, borderColor: "rgb(0, 227, 138)", borderLeftWidth: '2', borderRightWidth: '2' }}>
												<Text style={styles.subtext}>Budget</Text>
												<Text variant="headlineMedium">${Number(remixRecipe.Budget).toFixed(2)}</Text>
											</View>
											<View style={{ alignItems: 'center' }}>
												<Text style={styles.subtext}>Time</Text>
												<Text variant="headlineMedium">{ms(remixRecipe.CreationTime, { long: false })}</Text>
											</View>
										</View>
									</View>
								}
								{remixRecipeVisible && <View style={styles.divider}></View>}
							</> : <></>}
						<View style={{ margin: 20, marginVertical: 10, minHeight: '80%' }}>
							<Text style={styles.categoryTitle}>Add some tags!</Text>
							<TagSearch
								updateSelectedTags={(tags) => setSelectedFilters(tags)}
								defaultTags={remixRecipe ? formatTags(remixRecipe.Tags) : []}
							/>

							<View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
								<Text style={styles.categoryTitle}>Add some ingredients!</Text>
								<Text style={{ color: 'grey' }}> ({ingredientTags.length}/5)</Text>
							</View>
							<View style={{ flexDirection: 'row' }}>
								<TextInput maxLength={25} keyboardAppearance='dark' style={styles.addIngredients} value={ingredientInput} mode='outlined' onChangeText={(val) => setIngredientInput(val)} />
								<IconButton style={styles.addIngredientButton} disabled={ingredientInput.length < 2 || ingredientTags.length >= 5 ? true : false} size={20} mode={'outlined'} icon={'plus'} onPress={() => addIngredient(ingredientInput)} />
							</View>
							<HelperText type='error'>{ingredientHelperText}</HelperText>

							<ScrollView style={selectedIngredients.length > 0 ? { maxHeight: 40 } : { maxHeight: 0 }} horizontal={true}>
								{ingredientTags}
							</ScrollView>

							<Text style={styles.categoryTitle}>More options:</Text>
							<BudgetSlider handleValueChange={(val) => budget.current = val} />

							<View style={{ position: 'absolute', bottom: 0, height: 100, width: '100%', alignItems: 'center', flexDirection: 'row' }}>
								<MaskedView maskElement={<Button buttonColor="black" mode="contained">
									Generate
								</Button>}>
									<LinearGradient
										colors={recipeCharges == 0 ? ['grey, grey'] : ["#00C2FF", "#38FFA0"]}
										start={{ x: 0, y: 1 }}
										end={{ x: 1, y: 0 }}
									>
										<Button onPress={handleCreateRecipe} style={{ minWidth: '70%' }} disabled={recipeCharges == 0 ? true : false} buttonColor='transparent' textColor="black" mode="contained">Generate</Button>
									</LinearGradient>
								</MaskedView>
								<Button style={{ minWidth: '30%' }} onPress={() => navigation.navigate("Main")}>
									Cancel
								</Button>
							</View>
						</View></>
						: <View style={styles.loadingScreen}>
							<ActivityIndicator size={"large"} animating={true}></ActivityIndicator>
							<Text style={{ color: 'grey', paddingVertical: 15 }}>Generating recipe...</Text>
						</View>}
				</View>

				<Portal>
					{/* Info dialog */}
					<Dialog visible={infoDialogVisible} onDismiss={() => setInfoDialogVisible(false)}>
						{infoDialogContent[infoDialogPageNumber]}
						<Dialog.Actions>
							<Button disabled={infoDialogPageNumber <= 0 ? true : false} onPress={() => setInfoDialogPageNumber(infoDialogPageNumber - 1)}>Previous</Button>
							<Button disabled={infoDialogPageNumber >= infoDialogContent.length - 1 ? true : false} onPress={() => setInfoDialogPageNumber(infoDialogPageNumber + 1)}>Next</Button>
						</Dialog.Actions>
					</Dialog>

					{/* Warning dialog */}
					{/* <Dialog visible={errorDialogVisible} onDismiss={() => setErrorDialogVisible(false)}>
					<Dialog.Content>
						<Text variant="bodyMedium">{errorDialogContent}</Text>
					</Dialog.Content>
					<Dialog.Actions>
						<Button onPress={() => setErrorDialogVisible(false)}>OK</Button>
					</Dialog.Actions>
				</Dialog> */}
				</Portal>

				{/* Info snackbar */}
				<Snackbar
					visible={infoSnackbarVisible}
					onDismiss={() => setInfoSnackbarVisible(false)}
					action={{
						label: 'OK',
						onPress: () => navigation.navigate('Main'),
					}}>
					Recipe was successfully generated!
				</Snackbar>

				{/* Error snackbar */}
				<Snackbar
					visible={errorSnackbarVisible}
					onDismiss={() => setErrorSnackbarVisible(false)}
					action={{
						label: 'OK',
						// onPress () => setErrorDialogVisible(true),
						onPress: () => setErrorSnackbarVisible(false)
					}}>
					There was an error handling your request.
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
	loadingScreen: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		height: "85%",
	},
	addIngredients: {
		height: 35,
		width: '85%',
		lineHeight: 18,
	},
	addIngredientButton: {
		borderRadius: '5',
		borderWidth: 0,
		marginBottom: 0,
		marginRight: 0,
		marginLeft: 10
	},
	divider: {
		height: 1,
		backgroundColor: "#444444",
		marginHorizontal: 20
	}
});