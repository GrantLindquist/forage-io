import { useState } from 'react';
import { ScrollView, View, StyleSheet } from "react-native";
import { Text, FAB, Portal, Modal } from "react-native-paper";
import RecipeList from './RecipeList';
import mockData from '../../../mockRecipes.json';
import CreateRecipeModal from './CreateRecipeModal';

// Collection of recipes created or saved by the user
export default function UserRecipes() {

	// State for handling modal visibility
	const [modalVisible, setModalVisible] = useState(false);

	return (
		<View style={{minHeight: '100%'}}>
			<ScrollView>
				<View style={styles.container}>
					<Text variant='headlineLarge'>Your Recipes</Text>
					<RecipeList/>
				</View>
				<View style={styles.container}>
					<Text variant='headlineLarge'>Liked Recipes</Text>
					<RecipeList/>
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