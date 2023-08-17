import CreatedRecipes from './CreatedRecipes';
import CommunityRecipes from './CommunityRecipes';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import SavedRecipes from './SavedRecipes';
import Header from './Header';

import { createStackNavigator } from '@react-navigation/stack';
import RecipePage from './RecipePage';
import { useEffect, useState } from 'react';

// Create navigator objects
const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

// Renders tabs for each type of recipeList component
export default function RecipeMenu(props) {

	// State for refreshing savedRecipes & createdRecipes component
	const [refreshCreatedRecipes, setRefreshCreatedRecipes] = useState(false);
    const [refreshSavedRecipes, setRefreshSavedRecipes] = useState(false);

	return (
        <Stack.Navigator screenOptions={{header: () => <Header/>}}>
            {/* Stack for displaying recipe menu & nested recipe tabs */}
            <Stack.Screen name="Menu">
                {() => <Tab.Navigator>
                    <Tab.Screen name="Created">
                        {() => <CreatedRecipes refreshValue1={props.refreshValue} refreshValue2={refreshCreatedRecipes}/>}
                    </Tab.Screen>
                    <Tab.Screen name="Saved">
                        {() => <SavedRecipes refreshValue={refreshSavedRecipes}/>}
                    </Tab.Screen>
                    <Tab.Screen name="Community" component={CommunityRecipes} />
                </Tab.Navigator>}
            </Stack.Screen>
            {/* Stack for individual recipe display */}
            <Stack.Screen name="Recipe">
                {() => <RecipePage 
                    refreshCreatedRecipes={() => setRefreshCreatedRecipes(!refreshCreatedRecipes)}
                    refreshSavedRecipes={() => setRefreshSavedRecipes(!refreshSavedRecipes)}/>}
            </Stack.Screen>
        </Stack.Navigator>
	);
};
