import { MD2DarkTheme, PaperProvider } from 'react-native-paper';
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './src/components/auth/WelcomeScreen';
import AppNavigation from './src/components/app/AppNavigation';
import Header from './src/components/app/Header';
import RecipePage from './src/components/app/RecipePage';

// Place into .env file eventually
CLERK_PUBLISHABLE_KEY="pk_test_Z29vZC1jYXRmaXNoLTgzLmNsZXJrLmFjY291bnRzLmRldiQ"

// Creates tab navigator
const Stack = createStackNavigator();

// App entry point
export default function App() {
	return (
	<ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
		{/* PaperProvider is used for UI management */}
		<PaperProvider theme={MD2DarkTheme}>
			{/* These components display if user is signed-in with Clerk */}
			<SignedIn>
				<NavigationContainer theme={DarkTheme}>
					<Stack.Navigator
						screenOptions={{
							header: () => <Header/>,
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
