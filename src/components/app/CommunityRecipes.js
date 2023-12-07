import { useEffect, useState } from 'react';
import { FlatList, View, StyleSheet, Pressable, Image } from "react-native";
import { Searchbar, IconButton, Text, useTheme } from "react-native-paper";
import TagSearch from './TagSearch';
import { useNavigation } from '@react-navigation/native';
import RecipeCard from './RecipeCard';
import { useUser } from '@clerk/clerk-expo';
import recipeService from '../../services/recipeService';
import EmptyList from './EmptyList';

// Collection of recipes created by other users
export default function CommunityRecipes() {

	// User object
	const { user } = useUser();

	// Theme
	const theme = useTheme();

	// State that provides navigation property
	const navigation = useNavigation();

	// State for handling modal visibility
	const [communityRecipes, setCommunityRecipes] = useState([]);

	// States that handle filter management
	const [filtersVisible, setFiltersVisible] = useState(false);
	const [activeFilters, setActiveFilters] = useState([]);

	// State for handling pagination
	const [pageNumber, setPageNumber] = useState(1);
	const [endNumber, setEndNumber] = useState(1);

	// State for tracking user search input
	const [searchText, setSearchText] = useState('');
	const [searchQuery, setSearchQuery] = useState('');

	// Gets a collection of up to 400 (20x20 matrix) recipes that the user has not created
	const loadCommunityRecipes = async () => {
		// Get response from recipeService
		const response = await recipeService.getCommunityRecipes(user.id, searchQuery, activeFilters);
		setCommunityRecipes(response);
		setEndNumber(response.length);
	}

	// Renders recipes on component load
	useEffect(() => {
		loadCommunityRecipes();
		console.log('loaded communityRecipes.js');
	}, [searchQuery, activeFilters]);

	// Sub-component for rendering pagination 
	const paginationButtons = () => {

		// Determines which page numbers to display on buttons
		var paginationButtons = [];
		if (pageNumber == 1) {
			// If user is on first page, add first page button
			paginationButtons.push(1);
			// Add page 2 if applicable
			if (endNumber >= 2) {
				paginationButtons.push(2);

				// Add page 3 if applicable
				if (endNumber >= 3) {
					paginationButtons.push(3);
				}
			}
		}
		else if (endNumber == pageNumber) {
			// Add third-to-last if applicable
			if (endNumber - 2 > 0) {
				paginationButtons.push(endNumber - 2);
			}
			// Add second-to-last page if applicable
			if (endNumber - 1 > 0) {
				paginationButtons.push(endNumber - 1);
			}
			// If user is on last page, add last page button
			paginationButtons.push(endNumber);
		}
		else {
			// If user is somewhere in-between, add appropriate buttons
			paginationButtons.push(pageNumber - 1);
			paginationButtons.push(pageNumber);
			paginationButtons.push(pageNumber + 1);
		}

		// Returns pagination view with predetermined pagination button array
		return (
			<View style={{ backgroundColor: '#111111', flexDirection: 'row', bottom: 0, width: '100%', position: 'absolute' }}>
				<IconButton
					size={20}
					disabled={pageNumber == 1 ? true : false}
					icon={() => <Image source={require('../../../assets/icons/back.png')} />}
					onPress={() => setPageNumber(1)}
				/>
				{paginationButtons.map((page) => {
					return (
						<IconButton
							key={page}
							size={20}
							icon={() => <Text style={page == pageNumber ? { color: theme.colors.primary, fontWeight: 700 } : {}}>{page}</Text>}
							onPress={() => setPageNumber(page)}
						/>
					)
				})}
				<IconButton
					size={20}
					disabled={pageNumber == endNumber ? true : false}
					icon={() => <Image source={require('../../../assets/icons/forward.png')} />}
					onPress={() => setPageNumber(endNumber)}
				/>
			</View>
		)
	};

	return (
		<View style={{ height: '100%' }}>
			<View style={{ flexDirection: 'row', alignItems: 'center', padding: 3, marginTop: 5 }}>
				<Searchbar
					style={styles.searchbar}
					placeholder={"search recipes"}
					placeholderTextColor={"grey"}
					inputStyle={{ paddingLeft: 0, alignSelf: 'center' }}
					showDivider={false}
					mode={'view'}
					onChangeText={query => setSearchText(query)}
					onSubmitEditing={() => setSearchQuery(searchText)}
					value={searchText}
					keyboardAppearance='dark'
				/>
				<IconButton
					icon={() => filtersVisible ? <Image source={require('../../../assets/icons/up.png')} /> : <Image source={require('../../../assets/icons/down.png')} />}
					style={{ margin: 0, marginLeft: 'auto' }}
					onPress={() => setFiltersVisible(!filtersVisible)}
				/>
			</View>
			{filtersVisible ?
				<View style={{ marginHorizontal: 20 }}>
					<TagSearch
						updateSelectedTags={(tags) => setActiveFilters(tags)}
						defaultTags={[]}
					/>
				</View> : <></>}
			<FlatList
				data={communityRecipes[pageNumber - 1]}
				indicatorStyle='white'
				renderItem={(item) => {
					return (
						<Pressable key={item.item.RecipeId} onPress={() => navigation.navigate('Recipe', {
							recipe: item.item
						})}>
							<RecipeCard recipe={item.item} />
						</Pressable>
					)

				}}
				ListEmptyComponent={() => <EmptyList />}
				ListFooterComponent={<View style={{ paddingVertical: 60 }}></View>}
			/>
			{endNumber != 1 ? paginationButtons() : <></>}
		</View>
	);
};

const styles = StyleSheet.create({
	searchbar: {
		height: 35,
		width: '92%',
		backgroundColor: 'transparent',
	},
});