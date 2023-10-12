import { useEffect, useState } from 'react';
import Profile from './Profile';
import CreateRecipeModal from './CreateRecipeModal';
import RemixRecipeModal from './RemixRecipeModal';
import RecipeMenu from './RecipeMenu';
import Header from './Header';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import colors from '../../../colors.json';
import { createStackNavigator } from '@react-navigation/stack';
import { useUser } from '@clerk/clerk-expo';

// Create tab object
const Tab = createBottomTabNavigator();
const ModalStack = createStackNavigator();

// Bottom tab navigator for app
export default function AppNavigation() {

	// State that provides navigation property
	const navigation = useNavigation();
	const { user } = useUser();

	// State for refreshing createdRecipes component
	const [refreshCreatedRecipes, setRefreshCreatedRecipes] = useState(false);

	// Restores user charges when app loads
	useEffect(() => {
		// Function that update user charges
		async function updateUserCharges() {
			// Check for outdated charges
			var recipeCharges = user.unsafeMetadata.recipeCharges;
			for(let item of recipeCharges){
				// If an hour has passed since its addition, remove charge
				if(Date.now() - item > 3600000){
					recipeCharges.shift();
				}
				else{
					break;
				}
			}
			// Update user obj
			await user.update({
				unsafeMetadata: { 
					savedRecipeIds: user.unsafeMetadata.savedRecipeIds,
					recipeCharges: recipeCharges
				}
			});
		}

		// Call function on component load
		updateUserCharges();
	}, []);

  	return (
		/* ModalStack.Navigator contains all of app navigation alongside both Modals */
		<ModalStack.Navigator screenOptions={{ 
				header: () => <></> ,
				gestureResponseDistance: 400
			}}>
			<ModalStack.Screen name="Main">
				{() =>
					/* Tab.Navigator contains each bottom tab */
					<Tab.Navigator 
						screenOptions={{
							header: () => <Header/>,
							tabBarShowLabel: false,
							tabBarActiveTintColor: colors['blue'],
							tabBarStyle: { backgroundColor: colors['background1'] }
						}}
						sceneContainerStyle={{ backgroundColor: colors['background2'] }}
					>
						<Tab.Screen name="Home" options={{
							header: () => <></>,
							tabBarIcon: ({color}) => (
								<MaterialCommunityIcons name="text-search" color={color} size={30} />
							),
						}}>
							{() => <RecipeMenu refreshValue={refreshCreatedRecipes}/>}
						</Tab.Screen>
						{/* Create Recipe tab only contains listener to activate CreateRecipeModal from ModalStack */}
						<Tab.Screen name="Create" options={{
							tabBarIcon: ({color}) => (
								<MaterialCommunityIcons name="plus" color={color} size={30} />
							),
						}}
							// Displays modal when create tab is selected
							listeners = {{
								tabPress: e => {
									e.preventDefault();
									navigation.navigate('CreateRecipeModal');
								}
							}}
						>
							{/* Create tab is empty because a listener will redirect user to modal when clicked */}
							{() => <></>}
						</Tab.Screen>
						<Tab.Screen name="Profile" options={{
							tabBarIcon: ({color}) => (
								<MaterialCommunityIcons name="account" color={color} size={30} />
							)	
						}}>
							{() => <Profile/>}
						</Tab.Screen>
					</Tab.Navigator>
				}
			</ModalStack.Screen>
			<ModalStack.Screen options={{presentation: 'modal'}} name="CreateRecipeModal">
				{() => 
					<CreateRecipeModal refreshCreatedRecipes={() => setRefreshCreatedRecipes(!refreshCreatedRecipes)}/>
				}
			</ModalStack.Screen>
		</ModalStack.Navigator>
  	);
}