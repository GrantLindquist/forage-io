import { useEffect, useRef, useState } from 'react';
import { FlatList, View, StyleSheet, Pressable } from "react-native";
import { Searchbar, IconButton, Text } from "react-native-paper";
import TagSearch from './TagSearch';
import { useNavigation } from '@react-navigation/native';
import RecipeCard from './RecipeCard';
import { useUser } from '@clerk/clerk-expo';
import recipeService from '../../services/recipeService';
import EmptyList from './EmptyList';
import colors from '../../../colors.json';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Collection of recipes created by other users
export default function CommunityRecipes() {

	// User object
	const { user } = useUser(); 
	
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
	const loadCommunityRecipes = async() => {
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
		if(pageNumber == 1){
			// If user is on first page, add first page button
			paginationButtons.push(1);
			// Add page 2 if applicable
			if(endNumber >= 2){
				paginationButtons.push(2);
				
				// Add page 3 if applicable
				if(endNumber >= 3){
					paginationButtons.push(3);
				}
			}
		}
		else if(endNumber == pageNumber){
			// Add third-to-last if applicable
			if(endNumber-2 > 0){
				paginationButtons.push(endNumber-2);
			}
			// Add second-to-last page if applicable
			if(endNumber-1 > 0){
				paginationButtons.push(endNumber-1);	
			}
			// If user is on last page, add last page button
			paginationButtons.push(endNumber);
		}
		else{
			// If user is somewhere in-between, add appropriate buttons
			paginationButtons.push(pageNumber-1);
			paginationButtons.push(pageNumber);
			paginationButtons.push(pageNumber+1);
		}

		// Returns pagination view with predetermined pagination button array
		return(
			<View style={{flexDirection: 'row', marginTop: 10, width: '100%'}}>
				<IconButton 
					style={styles.paginationButton} 
					size={20} 
					icon={() => <MaterialCommunityIcons name="arrow-left" color={'white'} size={20}/>}
					onPress={() => setPageNumber(1)}
				/>
				{paginationButtons.map((page) => {
					return(
						<IconButton
							key={page}
							size={20} 
							icon={() => <Text>{page}</Text>}
							style={pageNumber == page ? styles.paginationButtonSelected: styles.paginationButton}
							onPress={() => setPageNumber(page)}
						/>
					)
				})}
				<IconButton 
					style={styles.paginationButton} 
					size={20} 
					icon={() => <MaterialCommunityIcons name="arrow-right" color={'white'} size={20}/>}
					onPress={() => setPageNumber(endNumber)}
				/>
			</View>
		)
	};

	return (
		<View style={styles.container}>
			{filtersVisible ? 
				<TagSearch 
					updateSelectedTags={(tags) => setActiveFilters(tags)} 
					closeTagSearch={() => setFiltersVisible(false)}
					canExit={true}
				/>
			: 
			<View style={{flexDirection:'row'}}>
				<Searchbar
					style={styles.searchbar}
					placeholder={"search recipes"}
					placeholderTextColor={"grey"}
					inputStyle={{paddingLeft: 0, alignSelf: 'center'}}
					showDivider={false}
					mode={'view'}
					onChangeText={query => setSearchText(query)}
					onIconPress={() => setSearchQuery(searchText)}
					value={searchText}
				/>
				<IconButton 
					icon="format-list-bulleted"
					onPress={() => setFiltersVisible(!filtersVisible)}
				/>
			</View>}
			<FlatList
				style={{maxHeight: '82%'}}
				data={communityRecipes[pageNumber-1]}
				renderItem={(item) => {
					return (
						<Pressable key={item.item.RecipeId} onPress={() => navigation.navigate('Recipe', {
								recipe: item.item
							})}>
							<RecipeCard recipe={item.item}/>
						</Pressable>
					)
				}}
				ListEmptyComponent={() => <EmptyList/>}
			/>
			{/* {endNumber != 1 ? paginationButtons() : <></>} */}
			{paginationButtons()}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		margin: 20,
		minHeight: '95%'
	},
	searchbar: {
		height: 35,
		width: '85%',
		marginVertical: 5,
		backgroundColor: colors['background2']
	},
	paginationButton: {
		borderRadius: 5,
		backgroundColor: colors['background1'],
	},
	paginationButtonSelected: {
		borderRadius: 5,
		backgroundColor: colors['pink'],
	}
});