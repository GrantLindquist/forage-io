import { useState } from 'react';
import Profile from './Profile';
import CreateRecipe from './CreateRecipe';
import RecipeMenu from './RecipeMenu';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Create tab object
const Tab = createBottomTabNavigator();

// Bottom tab navigator for app
export default function AppNavigation() {

	// State for refreshing createdRecipes component
	const [refreshCreatedRecipes, setRefreshCreatedRecipes] = useState(false);

  	return (
    	<Tab.Navigator screenOptions={{header: () => <></>, lazy: false, tabBarShowLabel: false}}>
			<Tab.Screen name="Home">
				{() => <RecipeMenu refreshValue={refreshCreatedRecipes}/>}
			</Tab.Screen>
			<Tab.Screen name="Create">
				{() => <CreateRecipe refreshCreatedRecipes={() => setRefreshCreatedRecipes(!refreshCreatedRecipes)}/>}
			</Tab.Screen>
			<Tab.Screen name="Profile" component={Profile} />
    	</Tab.Navigator>
  	);
}