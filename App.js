import { StyleSheet, Text, View } from 'react-native';
import { MD3DarkTheme, PaperProvider } from 'react-native-paper';
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import WelcomeScreen from './src/components/auth/WelcomeScreen';
import AppNavigation from './src/components/app/AppNavigation';

// Place into .env file eventually
CLERK_PUBLISHABLE_KEY="pk_test_Z29vZC1jYXRmaXNoLTgzLmNsZXJrLmFjY291bnRzLmRldiQ"

// App entry point
export default function App() {
	return (
	<ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
		{/* PaperProvider is used for UI management */}
		<PaperProvider theme={MD3DarkTheme}>
			{/* These components display if user is signed-in with Clerk */}
			<SignedIn>
				<AppNavigation/>
			</SignedIn>
			{/* These components display if user is not signed-in with Clerk */}
			<SignedOut>
				<WelcomeScreen/>
			</SignedOut>	
		</PaperProvider>
	</ClerkProvider>
	);
};
