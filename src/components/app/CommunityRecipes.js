import { useEffect, useRef, useState } from 'react';
import { FlatList, View, StyleSheet, Pressable } from "react-native";
import { Searchbar, IconButton, Text } from "react-native-paper";
import TagSearch from './TagSearch';
import { useNavigation } from '@react-navigation/native';
import RecipeCard from './RecipeCard';
import { useUser } from '@clerk/clerk-expo';
import recipeService from '../../services/recipeService'

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

	// State for tracking user search input
	const [searchQuery, setSearchQuery] = useState('');

	// Gets a collection of 50 recipes that the user has not created
	const loadCommunityRecipes = async() => {
		// Gets response from recipeService
		let response = await recipeService.getCommunityRecipes(user.id);
		setCommunityRecipes(response);
	}

	// Renders recipes on component load
	useEffect(() => {
		loadCommunityRecipes();
		console.log('loaded communityRecipes.js');
	}, []);

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
					onChangeText={query => setSearchQuery(query)}
					value={searchQuery}
				/>
				<IconButton 
					icon="format-list-bulleted"
					onPress={() => setFiltersVisible(!filtersVisible)}
				/>
			</View>}
			<FlatList
				style={{maxHeight: '80%'}}
				data={communityRecipes}
				renderItem={(item) => {
					if(item.item.Title.toLowerCase().includes(searchQuery.toLowerCase()) 
					&& activeFilters.every(tag => item.item.Tags.includes(tag))){
						return (
							<Pressable key={item.item.RecipeId} onPress={() => navigation.navigate('Recipe', {
									recipe: item.item
								})}>
								<RecipeCard recipe={item.item}/>
							</Pressable>
						)
					}
				}}
			/>
			
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		margin: 20,
	},
	searchbar: {
		height: 35,
		width: '85%',
		marginVertical: 5
	},
});