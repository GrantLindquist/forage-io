import CreatedRecipes from './CreatedRecipes';
import CommunityRecipes from './CommunityRecipes';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import SavedRecipes from './SavedRecipes';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';

// Create navigator objects
const Tab = createMaterialTopTabNavigator();

// Renders tabs for each type of recipeList component
export default function RecipeMenu() {

	return (
        <NavigationContainer theme={DarkTheme}>
            <Tab.Navigator>
                <Tab.Screen name="Created" component={CreatedRecipes} />
                <Tab.Screen name="Saved" component={SavedRecipes} />
                <Tab.Screen name="Community" component={CommunityRecipes} />
            </Tab.Navigator>
        </NavigationContainer>
	);
};
