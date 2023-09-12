import { useState } from 'react';
import Profile from './Profile';
import CreateRecipeModal from './CreateRecipeModal';
import RecipeMenu from './RecipeMenu';
import Header from './Header';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Modal } from "react-native";
import colors from '../../../colors.json';

// Create tab object
const Tab = createBottomTabNavigator();

// Bottom tab navigator for app
export default function AppNavigation() {

	// State for refreshing createdRecipes component
	const [refreshCreatedRecipes, setRefreshCreatedRecipes] = useState(false);

	// State for interacting with CreateRecipeModal component
	const [createModalVisible, setCreateModalVisible] = useState(false);

  	return (
		<>
			<Tab.Navigator 
				screenOptions={{
					header: () => <Header/>,
					tabBarShowLabel: false,
					tabBarActiveTintColor: colors['pink'],
					tabBarStyle: { backgroundColor: colors['background1'] }
				}}
				sceneContainerStyle={{ backgroundColor: colors['background2'] }}
			>
				<Tab.Screen name="Home" options={{
					header: () => <></>,
					tabBarIcon: ({color}) => (
						<MaterialCommunityIcons name="text-search" color={color} size={30} />
					)
				}}>
					{() => <RecipeMenu refreshValue={refreshCreatedRecipes}/>}
				</Tab.Screen>
				<Tab.Screen name="Create" options={{
					tabBarIcon: ({color}) => (
						<MaterialCommunityIcons name="plus" color={color} size={30} onPress={() => setCreateModalVisible(true)} />
					) 
				}}>
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
			<Modal
				animationType="slide"
				visible={createModalVisible}
				presentationStyle={"pageSheet"}
				onRequestClose={() => {
					setCreateModalVisible(!createModalVisible);
				}}
			>
				<CreateRecipeModal refreshCreatedRecipes={() => setRefreshCreatedRecipes(!refreshCreatedRecipes)}/>
			</Modal>
		</>
  	);
}