import { useEffect, useState } from 'react';
import { FlatList, View, StyleSheet, Pressable } from "react-native";
import { Searchbar } from "react-native-paper";
import { useNavigation, useRoute } from '@react-navigation/native';
import RecipeCard from './RecipeCard';
import RecipeCardPlaceholder from './RecipeCardPlaceholder';
import { useUser } from '@clerk/clerk-expo';
import recipeService from '../../services/recipeService';
import EmptyList from './EmptyList';
import ErrorList from './ErrorList';
// import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

// Collection of recipes created or saved by the user
export default function CreatedRecipes(props) {

	// User object
	const { user } = useUser();
	const route = useRoute();

	// State that removes deleted recipe from UI
	const [removeRecipeId, setRemoveRecipeId] = useState('');

	// State that provides navigation property
	const navigation = useNavigation();

	// Error handling
	const [errorMessage, setErrorMessage] = useState("");

	// State for tracking user search input
	const [searchQuery, setSearchQuery] = useState('');

	// State for displaying snackbar
	const [deleteSnackbarVisible, setDeleteSnackbarVisible] = useState(false);

	// States for listing recipes
	const [createdRecipes, setCreatedRecipes] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	// Gets recipes that user has created and sets state to response
	const loadCreatedRecipes = async () => {
		try {
			// Gets response from recipeService
			const response = await recipeService.getCreatedRecipes(user.id);
			setCreatedRecipes(response);
			setIsLoading(false);

			if (errorMessage != "") {
				setErrorMessage("");
			}
		}
		catch (e) {
			setErrorMessage(e.message);
		}
	}

	// Renders recipes on component load & re-renders component when refreshValue is updated
	useEffect(() => {
		// Remove deleted recipe from UI if necessary
		if (route.params) {
			const { removeId } = route.params;
			setRemoveRecipeId(removeId);

			// Display confirmation snackbar
			setDeleteSnackbarVisible(true);
		}

		// Get created recipes on component load
		loadCreatedRecipes();
		console.log('loaded createdRecipes.js');
	}, [props.refreshValue1, props.refreshValue2]);

	return (
		<>
			<View style={{ minHeight: '100%' }}>
				{/* <BannerAd
					unitId={"ca-app-pub-9548603992233366/9758974901"}
					size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
				/> */}
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
									data={createdRecipes}
									indicatorStyle='white'
									renderItem={(item) => {
										if (item.item.Title.toLowerCase().includes(searchQuery.toLowerCase()) && item.item.RecipeId != removeRecipeId) {
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
									ListFooterComponent={<View style={{ paddingVertical: 30 }}></View>}
								/> :
								<View>
									{/* Placeholder loading components */}
									<RecipeCardPlaceholder />
									<RecipeCardPlaceholder />
									<RecipeCardPlaceholder />
									<RecipeCardPlaceholder />
									<RecipeCardPlaceholder />
								</View>
							}
						</>
						:
						<>
							<ErrorList errorMessage={errorMessage} />
						</>
				}
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	searchbar: {
		height: 35,
		width: '100%',
		backgroundColor: 'transparent',
	},
});