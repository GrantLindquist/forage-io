import { useState } from 'react';
import { BottomNavigation } from 'react-native-paper';
import UserRecipes from './UserRecipes';
import CommunityRecipes from './CommunityRecipes';
import Profile from './Profile';

// Routes that lead to various components
const UserRecipesRoute = () => <UserRecipes/>;
const CommunityRecipesRoute = () => <CommunityRecipes/>;
const ProfileRoute = () => <Profile/>;

// Handles app navigation
export default function AppNavigation() {
	
	// Active navigation index
	const [index, setIndex] = useState(0);
	
	// Configures bottom navigation routes 
	const routes = [
		{ key: 'userRecipes', focusedIcon: 'heart-outline'},
		{ key: 'communityRecipes', focusedIcon: 'album' },
		{ key: 'profile', focusedIcon: 'history' },
	];
	
	// Maps routes to components
	const renderScene = BottomNavigation.SceneMap({
		userRecipes: UserRecipesRoute,
		communityRecipes: CommunityRecipesRoute,
		profile: ProfileRoute
	});

	return (
		<BottomNavigation
			navigationState={{ index, routes }}
			onIndexChange={setIndex}
			renderScene={renderScene}
		/>
	);
};
