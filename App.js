// eas build -p ios --profile preview

import { PaperProvider } from 'react-native-paper';
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

	// Theme for app
	const theme = {
		colors: {
			primary: "rgb(0, 227, 138)",
			onPrimary: "rgb(0, 57, 30)",
			primaryContainer: "rgb(0, 82, 46)",
			onPrimaryContainer: "rgb(87, 255, 166)",
			secondary: "rgb(117, 209, 255)",
			onSecondary: "rgb(0, 53, 72)",
			secondaryContainer: "rgb(0, 77, 103)",
			onSecondaryContainer: "rgb(194, 232, 255)",
			tertiary: "rgb(248, 189, 42)",
			onTertiary: "rgb(64, 45, 0)",
			tertiaryContainer: "rgb(92, 67, 0)",
			onTertiaryContainer: "rgb(255, 223, 160)",
			error: "rgb(255, 180, 171)",
			onError: "rgb(105, 0, 5)",
			errorContainer: "rgb(147, 0, 10)",
			onErrorContainer: "rgb(255, 180, 171)",
			background: "rgb(25, 28, 26)",
			onBackground: "rgb(225, 227, 222)",
			surface: "rgb(25, 28, 26)",
			onSurface: "rgb(225, 227, 222)",
			surfaceVariant: "rgb(65, 73, 66)",
			onSurfaceVariant: "rgb(192, 201, 192)",
			outline: "rgb(138, 147, 139)",
			outlineVariant: "rgb(65, 73, 66)",
			shadow: "rgb(0, 0, 0)",
			scrim: "rgb(0, 0, 0)",
			inverseSurface: "rgb(225, 227, 222)",
			inverseOnSurface: "rgb(46, 49, 46)",
			inversePrimary: "rgb(0, 109, 63)",
			elevation: {
				level0: "transparent",
				level1: "rgb(24, 38, 32)",
				level2: "rgb(23, 44, 35)",
				level3: "rgb(22, 50, 38)",
				level4: "rgb(22, 52, 39)",
				level5: "rgb(22, 56, 42)"
			},
			surfaceDisabled: "rgba(225, 227, 222, 0.12)",
			onSurfaceDisabled: "rgba(225, 227, 222, 0.38)",
			backdrop: "rgba(42, 50, 44, 0.4)"
		}
	}


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
		<PaperProvider theme={theme}>
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
