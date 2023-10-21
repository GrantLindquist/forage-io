import { useEffect, useState } from 'react';
import { FlatList, View, StyleSheet, Pressable } from "react-native";
import { Searchbar } from "react-native-paper";
import { useNavigation } from '@react-navigation/native';
import RecipeCard from './RecipeCard';
import RecipeCardPlaceholder from './RecipeCardPlaceholder';
import { useUser } from '@clerk/clerk-expo';
import recipeService from '../../services/recipeService';
import EmptyList from './EmptyList';

// Collection of recipes created or saved by the user
export default function SavedRecipes(props) {

	// User object
	const { user } = useUser(); 

	// State that provides navigation property
	const navigation = useNavigation();

	// State for listing & refreshing recipes
	const [savedRecipes, setSavedRecipes] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	// State for tracking user search input
	const [searchQuery, setSearchQuery] = useState('');

	// Gets recipes that user has saved and sets state to response
	const loadSavedRecipes = async() => {
		// Gets response from recipeService
		const response = await recipeService.getSavedRecipes(user.unsafeMetadata.savedRecipeIds);
		setSavedRecipes(response);
		setIsLoading(false);
	}

	// Renders recipes on component load
	useEffect(() => {
		loadSavedRecipes();
		console.log('loaded savedRecipes.js');
	}, [props.refreshValue]);

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
				keyboardAppearance='dark'
			/>
			{!isLoading ?
				<FlatList
				data={savedRecipes}
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
				ListFooterComponent={<View style={{paddingVertical: 40}}></View>}
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
		backgroundColor: "transparent"
	},
});