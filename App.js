// eas build -p ios --profile preview

import { useState } from 'react';
import { View } from 'react-native';
import { MD3DarkTheme, PaperProvider } from 'react-native-paper';
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './src/components/auth/WelcomeScreen';
import AppNavigation from './src/components/app/AppNavigation';
import Header from './src/components/app/Header';
import RecipePage from './src/components/app/RecipePage';
import Profile from './src/components/app/Profile';

// Creates tab navigator
const Stack = createStackNavigator();

// Clerk API key
const CLERK_PUBLISHABLE_KEY = "pk_test_bW9yYWwtbWFrby05NC5jbGVyay5hY2NvdW50cy5kZXYk";

// App entry point
export default function App() {
	
	// State for tracking whether or not profile drawer is open
	const [isDrawerOpen, setDrawerOpen] = useState(false);

	return (
	<ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
		{/* PaperProvider is used for UI management */}
		<PaperProvider theme={MD3DarkTheme}>
			{/* These components display if user is signed-in with Clerk */}
			<SignedIn>
				{/* Top-level drawer component */}
				{isDrawerOpen ? <Profile closeDrawer={() => setDrawerOpen(false)}/> : <></>}
				<NavigationContainer theme={DarkTheme}>
					<Stack.Navigator
						screenOptions={{
							header: () => {
								if(isDrawerOpen){
									return(<></>);
								}
								else{
									return(<Header openDrawer={() => setDrawerOpen(true)}/>)
								}
							} 
						}}>
						<Stack.Screen name='App' component={AppNavigation} />
						<Stack.Screen name='Recipe' component={RecipePage} />
					</Stack.Navigator>		
				</NavigationContainer>
			</SignedIn>
			{/* These components display if user is not signed-in with Clerk */}
			<SignedOut>
				<WelcomeScreen/>
			</SignedOut>	
		</PaperProvider>
	</ClerkProvider>
	);
};
