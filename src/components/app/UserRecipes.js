import { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet } from "react-native";
import { Text, FAB, Portal, Modal } from "react-native-paper";
import RecipeList from './RecipeList';
import CreateRecipeModal from './CreateRecipeModal';
import { useUser } from '@clerk/clerk-expo';

// Collection of recipes created or saved by the user
export default function UserRecipes() {

	// User object
	const { user } = useUser(); 

	// State for handling modal visibility
	const [modalVisible, setModalVisible] = useState(false);
	// State for refreshing component
	const [refresh, setRefresh] = useState(true);

	// States for listing recipes
	const [createdRecipes, setCreatedRecipes] = useState([]);
	const [savedRecipes, setSavedRecipes] = useState([]);

	// Gets recipes that user has created and sets state to response
	const loadCreatedRecipes = async() => {
		// Executes request
        const response = await fetch(`https://oongvnk9o0.execute-api.us-east-1.amazonaws.com/test/recipes/user?creatorId=${user.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        // Returns recipe JSON
        let data = await response.json();
		setCreatedRecipes(data.Items);
	}

	// Gets recipes that user has saved and sets state to response
	const loadSavedRecipes = async() => {
		// Loops through each saved recipe id and fetches it from DB
		const savedRecipeIds = user.unsafeMetadata.savedRecipeIds;
		var savedRecipeData = [];
		if(savedRecipeIds){
			for(item of savedRecipeIds){
				// Executes request
				const response = await fetch(`https://oongvnk9o0.execute-api.us-east-1.amazonaws.com/test/recipes/?recipeId=${item}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					}
				});
				// Pushes recipe JSON to list
				let data = await response.json();
				if(data.Item){
					savedRecipeData.push(data.Item);
				}
			}
		}
		// Sets savedRecipes state
		setSavedRecipes(savedRecipeData);
	}

	// Refreshes component to activate useEffect and update recipe list
	const refreshComponent = () => {
		setModalVisible(false);
		setRefresh(!refresh);
	}

	// Renders recipes on component load
	useEffect(() => {
		loadCreatedRecipes();
		loadSavedRecipes();
	}, [refresh]);

	return (
		<View style={{minHeight: '100%'}}>
			<ScrollView>
				<View style={styles.container}>
					<Text variant='headlineLarge'>Your Recipes</Text>
					<RecipeList recipes={createdRecipes}/>
				</View>
				<View style={styles.container}>
					<Text variant='headlineLarge'>Liked Recipes</Text>
					<RecipeList recipes={savedRecipes}/>
				</View>
			</ScrollView>
			{/* Components for modal display */}
			<FAB
				style={styles.fab}
				customSize={50}
				icon='plus'
				onPress={() => setModalVisible(true)}
			/>
			<Portal>
				<Modal visible={modalVisible} onDismiss={() => setModalVisible(false)}>
					<CreateRecipeModal dismissModal={() => refreshComponent()}/>
				</Modal>
			</Portal>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		margin: 20
	},
	fab: {
		position: 'absolute',
		margin: 16,
		right: 0,
		bottom: 0,
	},
});