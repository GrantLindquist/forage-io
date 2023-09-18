import CreatedRecipes from './CreatedRecipes';
import CommunityRecipes from './CommunityRecipes';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import SavedRecipes from './SavedRecipes';
import { createStackNavigator } from '@react-navigation/stack';
import RecipePage from './RecipePage';
import { useEffect, useState } from 'react';
import Header from './Header';
import colors from '../../../colors.json';

// Create navigator objects
const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

// Renders tabs for each type of recipeList component
export default function RecipeMenu(props) {

	// State for refreshing savedRecipes & createdRecipes component
	const [refreshCreatedRecipes, setRefreshCreatedRecipes] = useState(false);
    const [refreshSavedRecipes, setRefreshSavedRecipes] = useState(false);

	return (
        <Stack.Navigator>
            {/* Stack for displaying recipe menu & nested recipe tabs */}
            <Stack.Screen name="Menu"
                options={{header: () => <Header/>}}    
            >
                {() => <Tab.Navigator
                    screenOptions={{
                        tabBarStyle: { backgroundColor: colors['background1'] },
                        tabBarIndicatorStyle: { backgroundColor: colors['pink'] }
                    }}
                    sceneContainerStyle={{ backgroundColor: colors['background2'] }}
                >
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
            <Stack.Screen name="Recipe"
                options={{
                    header: () => <></>,
                    gestureResponseDistance: 75
                }}
            >
                {() => <RecipePage 
                    refreshCreatedRecipes={() => setRefreshCreatedRecipes(!refreshCreatedRecipes)}
                    refreshSavedRecipes={() => setRefreshSavedRecipes(!refreshSavedRecipes)}/>}
            </Stack.Screen>
        </Stack.Navigator>
	);
};
