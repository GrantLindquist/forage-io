import { useEffect, useState } from 'react';
import { FlatList, View, StyleSheet, Pressable } from "react-native";
import { Searchbar } from "react-native-paper";
import { useNavigation, useRoute } from '@react-navigation/native';
import RecipeCard from './RecipeCard';
import RecipeCardPlaceholder from './RecipeCardPlaceholder';
import { useUser } from '@clerk/clerk-expo';
import recipeService from '../../services/recipeService';
import EmptyList from './EmptyList';
import colors from '../../../colors.json';

// Collection of recipes created or saved by the user
export default function CreatedRecipes(props) {

	// User object
	const { user } = useUser(); 
	const route = useRoute();

	// State that removes deleted recipe from UI
	const [removeRecipeId, setRemoveRecipeId] = useState('');
	
	// State that provides navigation property
	const navigation = useNavigation();

	// State for tracking user search input
	const [searchQuery, setSearchQuery] = useState('');

	// States for listing recipes
	const [createdRecipes, setCreatedRecipes] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	// Gets recipes that user has created and sets state to response
	const loadCreatedRecipes = async() => {
		// Gets response from recipeService
		const response = await recipeService.getCreatedRecipes(user.id);
		setCreatedRecipes(response);
		setIsLoading(false);
	}

	// Renders recipes on component load & re-renders component when refreshValue is updated
	useEffect(() => {
		// Remove deleted recipe from UI if necessary
		if(route.params){
			const { removeId } = route.params; 
			setRemoveRecipeId(removeId);
		}

		loadCreatedRecipes();
		console.log('loaded createdRecipes.js');
		console.log(console.log("remove: " + removeRecipeId));
	}, [props.refreshValue1, props.refreshValue2]);

	return (
		<View style={styles.container}>
			<Searchbar
				style={styles.searchbar}
				placeholder={"search recipes"}
				placeholderTextColor={"grey"}
				inputStyle={{paddingLeft: 0, alignSelf: 'center'}}
				showDivider={false}
				mode={'view'}
				onChangeText={query => setSearchQuery(query)}
				value={searchQuery}
			/>
			{!isLoading ?
				<FlatList
				style={{maxHeight: '90%'}}
				data={createdRecipes}
				renderItem={(item) => {
					if(item.item.Title.toLowerCase().includes(searchQuery.toLowerCase()) && item.item.RecipeId != removeRecipeId){
						return (
							<Pressable key={item.item.RecipeId} onPress={() => navigation.navigate('Recipe', {
									recipe: item.item
								})}>
								<RecipeCard recipe={item.item}/>
							</Pressable>
						)
					}
				}}
				ListEmptyComponent={() => <EmptyList/>}
			/> :
			<View>
				<RecipeCardPlaceholder/>
				<RecipeCardPlaceholder/>
				<RecipeCardPlaceholder/>
				<RecipeCardPlaceholder/>
				<RecipeCardPlaceholder/>
			</View>
			}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		margin: 15,
		minHeight: '100%'
	},
	searchbar: {
		height: 35,
		width: '100%',
		backgroundColor: colors['background2']
	},
});