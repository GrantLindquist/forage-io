// eas build -p ios --profile preview

import { MD3DarkTheme, PaperProvider } from 'react-native-paper';
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './src/components/auth/WelcomeScreen';
import AppNavigation from './src/components/app/AppNavigation';
import env from './env.json';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { Asset } from 'expo-asset';
import { useEffect } from 'react';

// Creates tab navigator
const Stack = createStackNavigator();

// App entry point
export default function App() {

	// Prepares app for user upon login
	useEffect(() => {
		// Preload images
		const preloadImages = (images) => {
			return images.map(image => {
				return Asset.fromModule(image).downloadAsync();
			});
		};
		
		// Retrieves images from /assets to preload
		const retrieveImages = async() => {
			// Preload images
			const images = [
				require('./assets/icons/budget.png'),
				require('./assets/icons/charge.png'),
				require('./assets/icons/cuisine-type.png'),
				require('./assets/icons/diet-type.png'),
				require('./assets/icons/flavor.png'),
				require('./assets/icons/meal-type.png'),
				require('./assets/icons/remix-action.png'),
				require('./assets/icons/servings.png'),
				require('./assets/icons/star-filled.png'),
				require('./assets/icons/star-selected.png'),
				require('./assets/icons/time.png'),
			];

			const cacheImages = preloadImages(images);
			await Promise.all(cacheImages);
		}

		// Executes function
		retrieveImages();
	}, [])
	
	return (
	<ClerkProvider publishableKey={env['clerk-publishableKey']}>
		{/* PaperProvider is used for UI management */}
		<PaperProvider theme={MD3DarkTheme}>
			{/* These components display if user is signed-in with Clerk */}
			<SignedIn>
				<NavigationContainer theme={DarkTheme}>
					<AppNavigation/>	
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
