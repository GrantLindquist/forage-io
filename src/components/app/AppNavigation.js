import { useState } from 'react';
import { BottomNavigation } from 'react-native-paper';
import Profile from './Profile';
import CreateRecipe from './CreateRecipe';
import RecipeMenu from './RecipeMenu';

// Routes that lead to various components
const RecipeMenuRoute = () => <RecipeMenu/>;
const CreateRecipeRoute = () => <CreateRecipe/>;
const ProfileRoute = () => <Profile/>;

// Handles app navigation within app stack
export default function AppNavigation() {
	
	// Active navigation index
	const [index, setIndex] = useState(0);
	
	// Configures bottom navigation routes 
	const routes = [
		{ key: 'recipeMenu', focusedIcon: 'home'},
		{ key: 'createRecipe', focusedIcon: 'plus' },
		{ key: 'profile', focusedIcon: 'album' },
	];
	
	// Maps routes to components
	const renderScene = BottomNavigation.SceneMap({
		recipeMenu: RecipeMenuRoute,
		createRecipe: CreateRecipeRoute,
		profile: ProfileRoute
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
