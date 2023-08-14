import CreatedRecipes from './CreatedRecipes';
import CommunityRecipes from './CommunityRecipes';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import SavedRecipes from './SavedRecipes';
import Header from './Header';

import { createStackNavigator } from '@react-navigation/stack';
import RecipePage from './RecipePage';

// Create navigator objects
const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

// Renders tabs for each type of recipeList component
export default function RecipeMenu() {

	return (
            <Stack.Navigator screenOptions={{header: () => <Header/>}}>
                {/* Stack for displaying recipe menu & nested recipe tabs */}
                <Stack.Screen name="Menu">
                    {() => <Tab.Navigator>
                        <Tab.Screen name="Created" component={CreatedRecipes} />
                        <Tab.Screen name="Saved" component={SavedRecipes} />
                        <Tab.Screen name="Community" component={CommunityRecipes} />
                    </Tab.Navigator>}
                </Stack.Screen>
                {/* Stack for individual recipe display */}
                <Stack.Screen name="Recipe" component={RecipePage}/>
            </Stack.Navigator>
	);
};
