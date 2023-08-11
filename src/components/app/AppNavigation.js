import { useState } from 'react';
import { BottomNavigation } from 'react-native-paper';
import UserRecipes from './UserRecipes';
import CommunityRecipes from './CommunityRecipes';
import Profile from './Profile';
import CreateRecipe from './CreateRecipe';

// Routes that lead to various components
const UserRecipesRoute = () => <UserRecipes/>;
const CommunityRecipesRoute = () => <CommunityRecipes/>;
const CreateRecipeRoute = () => <CreateRecipe/>;

// Handles app navigation within app stack
export default function AppNavigation() {
	
	// Active navigation index
	const [index, setIndex] = useState(0);
	
	// Configures bottom navigation routes 
	const routes = [
		{ key: 'userRecipes', focusedIcon: 'home'},
		{ key: 'createRecipe', focusedIcon: 'plus' },
		{ key: 'communityRecipes', focusedIcon: 'album' },
	];

	const handleIndexChange = (index) => {
		console.log(index);
		setIndex(index);
	}
	
	// Maps routes to components
	const renderScene = BottomNavigation.SceneMap({
		userRecipes: UserRecipesRoute,
		createRecipe: CreateRecipeRoute,
		communityRecipes: CommunityRecipesRoute
	});

	return (
			<BottomNavigation
				navigationState={{ index, routes }}
				onIndexChange={setIndex}
				renderScene={renderScene}
				sceneAnimationEnabled={true}
				sceneAnimationType='shifting'
			/>
	);
};
