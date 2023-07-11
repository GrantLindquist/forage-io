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

	// States for listing recipes
	const [createdRecipes, setCreatedRecipes] = useState([]);
	const [savedRecipes, setSavedRecipes] = useState([]);

	// Gets recipes that user has created and sets state to response
	const loadCreatedRecipes = async() => {
		// Executes request
        const response = await fetch(`https://oongvnk9o0.execute-api.us-east-1.amazonaws.com/test/recipes?creatorId=${user.id}`, {
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
		// // Executes request
		// const response = await fetch(``, {
		// 	method: 'GET',
		// 	headers: {
		// 		'Content-Type': 'application/json'
		// 	}
		// });
		// // Returns recipe JSON
		// let data = await response.json();
		// console.log("loadSavedRecipes: " + data);
	}

	// Renders recipes on component load
	useEffect(() => {
		loadCreatedRecipes();
		loadSavedRecipes();
	}, []);

	return (
		<View style={{minHeight: '100%'}}>
			<ScrollView>
				<View style={styles.container}>
					<Text variant='headlineLarge'>Your Recipes</Text>
					<RecipeList recipes={createdRecipes}/>
				</View>
				<View style={styles.container}>
					<Text variant='headlineLarge'>Liked Recipes</Text>
					<RecipeList recipes={[]}/>
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
					<CreateRecipeModal/>
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