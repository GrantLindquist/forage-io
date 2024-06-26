// eas build -p ios --profile preview

import { PaperProvider } from 'react-native-paper';
import { ClerkProvider, SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import WelcomeScreen from './src/components/auth/WelcomeScreen';
import AppNavigation from './src/components/app/AppNavigation';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { Asset } from 'expo-asset';
import { useEffect } from 'react';
import SnackbarProvider from './src/components/app/SnackbarProvider';
import * as SecureStore from 'expo-secure-store';

// App entry point
export default function App() {

	// Theme for app
	const theme = {
		colors: {
			primary: "#00E38A", // Adjust the primary color for dark mode
			onPrimary: "#FFFFFF",
			primaryContainer: "#FF8B8B",
			onPrimaryContainer: "#FFFFFF",

			secondary: "#6B82FF", // Adjust the secondary color for dark mode
			onSecondary: "#FFFFFF",
			secondaryContainer: "#8B9DFF",
			onSecondaryContainer: "#FFFFFF",

			tertiary: "#FFD166", // Adjust the tertiary color for dark mode
			onTertiary: "#301E00",
			tertiaryContainer: "#FFDEA0",
			onTertiaryContainer: "#301E00",

			error: "#FF7171",
			onError: "#520000",
			errorContainer: "#FF8B8B",
			onErrorContainer: "#520000",

			background: "#121212", // Dark background color
			onBackground: "#F0F0F0", // Light text color on dark background
			surface: "#111111", // Dark surface color
			onSurface: "#F0F0F0", // Light text color on dark surface
			surfaceVariant: "#292929", // A slightly darker shade of surface
			onSurfaceVariant: "#F0F0F0",

			outline: "#666666", // Adjust the outline color for dark mode
			outlineVariant: "#555555", // A slightly darker shade of outline
			shadow: "#000000",
			scrim: "rgba(0, 0, 0, 0.8)", // Dark scrim color

			inverseSurface: "#F0F0F0",
			inverseOnSurface: "#121212", // Dark text color on light surface
			inversePrimary: "#1B8056", // Inverse primary color

			elevation: {
				level0: "transparent",
				level1: "#202020", // Adjust elevation levels for dark mode
				level2: "#1A1A1A",
				level3: "#141414",
				level4: "#0F0F0F",
				level5: "#0A0A0A",
			},

			surfaceDisabled: "rgba(240, 240, 240, 0.12)", // Adjust disabled surface color
			onSurfaceDisabled: "rgba(240, 240, 240, 0.38)", // Adjust text color on disabled surface
			backdrop: "rgba(66, 76, 68, 0.6)", // Dark backdrop color
		},
	}

	// Session token stuff
	const tokenCache = {
		async getToken(key) {
		  try {
			return SecureStore.getItemAsync(key);
		  } catch (err) {
			return null;
		  }
		},
		async saveToken(key, value) {
		  try {
			return SecureStore.setItemAsync(key, value);
		  } catch (err) {
			return;
		  }
		},
	  };

	// Prepares app for user upon login
	useEffect(() => {
		console.log(`stage:${__DEV__ ? "dev" : "prod"}`);

		// Preload images
		const preloadImages = (images) => {
			return images.map(image => {
				return Asset.fromModule(image).downloadAsync();
			});
		};

		// Preloads images from /assets
		const retrieveImages = async () => {
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
				require('./assets/icons/remix-action.png'),
				require('./assets/icons/forward.png'),
				require('./assets/icons/back.png'),
				require('./assets/icons/up.png'),
				require('./assets/icons/down.png'),
				require('./assets/icons/error.png'),
				require('./assets/icons/success.png'),

				require('./assets/logo/nav-logoface.png'),

				require('./assets/welcome-bg.png'),
				require("./assets/empty-list.png")
			];

			const cacheImages = preloadImages(images);
			await Promise.all(cacheImages);
		}

		// Executes function
		retrieveImages();
	}, [])

	return (
		<ClerkProvider 
			publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
			tokenCache={tokenCache}
		>
			{/* PaperProvider is used for UI management */}
			<PaperProvider theme={theme}>
				{/* These components display if user is signed-in with Clerk */}
				<SignedIn>
					<NavigationContainer theme={DarkTheme}>
						<SnackbarProvider>
							<AppNavigation />
						</SnackbarProvider>
					</NavigationContainer>
				</SignedIn>
				{/* These components display if user is not signed-in with Clerk */}
				<SignedOut>
					<WelcomeScreen />
				</SignedOut>
			</PaperProvider>
		</ClerkProvider>
	);
};
