import { useEffect, useState } from 'react';
import { FlatList, View, StyleSheet, Pressable } from "react-native";
import { Searchbar } from "react-native-paper";
import { useNavigation } from '@react-navigation/native';
import RecipeCard from './RecipeCard';
import RecipeCardPlaceholder from './RecipeCardPlaceholder';
import { useUser } from '@clerk/clerk-expo';
import recipeService from '../../services/recipeService';
import EmptyList from './EmptyList';
import ErrorList from './ErrorList';

// Collection of recipes created or saved by the user
export default function SavedRecipes(props) {

	// User object
	const { user } = useUser();

	// State that provides navigation property
	const navigation = useNavigation();

	// Error handling
	const [errorMessage, setErrorMessage] = useState("");

	// State for listing & refreshing recipes
	const [savedRecipes, setSavedRecipes] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	// State for tracking user search input
	const [searchQuery, setSearchQuery] = useState('');

	// Gets recipes that user has saved and sets state to response
	const loadSavedRecipes = async () => {
		try {
			// Gets response from recipeService
			const response = await recipeService.getSavedRecipes(user.unsafeMetadata.savedRecipeIds);
			setSavedRecipes(response);
			setIsLoading(false);

			if (errorMessage != "") {
				setErrorMessage("");
			}
		}
		catch (e) {
			setErrorMessage(e.message);
		}
	}

	// Renders recipes on component load
	useEffect(() => {
		loadSavedRecipes();
		console.log('loaded savedRecipes.js');
	}, [props.refreshValue]);

	return (
		<View style={{ minHeight: '100%' }}>
			{
				errorMessage == "" ?
					<>
						<View style={{ padding: 5, marginTop: 5 }}>
							<Searchbar
								style={styles.searchbar}
								placeholder={"search recipes"}
								placeholderTextColor={"grey"}
								inputStyle={{ paddingLeft: 0, alignSelf: 'center' }}
								showDivider={false}
								mode={'view'}
								onChangeText={query => setSearchQuery(query)}
								value={searchQuery}
								keyboardAppearance='dark'
							/>
						</View>
						{!isLoading ?
							<FlatList
								data={savedRecipes}
								renderItem={(item) => {
									if (item.item.Title.toLowerCase().includes(searchQuery.toLowerCase())) {
										return (
											<Pressable key={item.item.RecipeId} onPress={() => navigation.navigate('Recipe', {
												recipe: item.item
											})}>
												<RecipeCard recipe={item.item} />
											</Pressable>
										)
									}
								}}
								ListEmptyComponent={() => <EmptyList />}
								ListFooterComponent={<View style={{ paddingVertical: 40 }}></View>}
							/> :
							<View>
								<RecipeCardPlaceholder />
								<RecipeCardPlaceholder />
								<RecipeCardPlaceholder />
								<RecipeCardPlaceholder />
								<RecipeCardPlaceholder />
							</View>
						}
					</> :
					<>
						<ErrorList errorMessage={errorMessage} />
					</>
			}
		</View>
	);
};

const styles = StyleSheet.create({
	searchbar: {
		height: 35,
		width: '100%',
		backgroundColor: "transparent",
		padding: 5
	},
});