import { useEffect, useState } from 'react';
import { FlatList, View, StyleSheet, Pressable } from "react-native";
import { Searchbar } from "react-native-paper";
import { useNavigation } from '@react-navigation/native';
import RecipeCard from './RecipeCard';
import RecipeCardPlaceholder from './RecipeCardPlaceholder';
import { useUser } from '@clerk/clerk-expo';
import recipeService from '../../services/recipeService'
import EmptyList from './EmptyList';

// Collection of recipes created or saved by the user
export default function CreatedRecipes(props) {

	// User object
	const { user } = useUser(); 
	
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
		let response = await recipeService.getCreatedRecipes(user.id);
		setCreatedRecipes(response);
		setIsLoading(false);
	}

	// Renders recipes on component load & re-renders component when refreshValue is updated
	useEffect(() => {
		loadCreatedRecipes();
		console.log('loaded createdRecipes.js');
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
					if(item.item.Title.toLowerCase().includes(searchQuery.toLowerCase())){
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
		margin: 20,
		minHeight: '100%'
	},
	searchbar: {
		height: 35,
		width: '100%',
		marginVertical: 5
	},
});