import { useState } from 'react';
import Profile from './Profile';
import CreateRecipe from './CreateRecipe';
import RecipeMenu from './RecipeMenu';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Create tab object
const Tab = createBottomTabNavigator();

// Bottom tab navigator for app
export default function AppNavigation() {

	// State for refreshing createdRecipes component
	const [refreshCreatedRecipes, setRefreshCreatedRecipes] = useState(false);

  	return (
    	<Tab.Navigator screenOptions={{header: () => <></>, tabBarShowLabel: false}}>
			<Tab.Screen name="Home" options={{
				tabBarIcon: ({color}) => (
					<MaterialCommunityIcons name="text-search" color={color} size={30} />
				)
			}}>
				{() => <RecipeMenu refreshValue={refreshCreatedRecipes}/>}
			</Tab.Screen>
			<Tab.Screen name="Create" options={{
				tabBarIcon: ({color}) => (
					<MaterialCommunityIcons name="plus" color={color} size={30} />
				) 
			}}>
				{() => <CreateRecipe refreshCreatedRecipes={() => setRefreshCreatedRecipes(!refreshCreatedRecipes)}/>}
			</Tab.Screen>
			<Tab.Screen name="Profile" options={{
				tabBarIcon: ({color}) => (
					<MaterialCommunityIcons name="account" color={color} size={30} />
				)	
			}}>
				{() => <Profile/>}
			</Tab.Screen>
    	</Tab.Navigator>
  	);
}