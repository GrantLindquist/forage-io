import { StyleSheet, Text, View } from 'react-native';
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import WelcomeScreen from './src/WelcomeScreen';

// Place into .env file eventually
CLERK_PUBLISHABLE_KEY="pk_test_Z29vZC1jYXRmaXNoLTgzLmNsZXJrLmFjY291bnRzLmRldiQ"

// App entry point
export default function App() {
	return (
	<ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
		{/* These components display if user is signed-in with Clerk */}
		<SignedIn>
			<Text>You are Signed in.</Text>
		</SignedIn>
		{/* These components display if user is not signed-in with Clerk */}
		<SignedOut>
			<WelcomeScreen/>
		</SignedOut>
	</ClerkProvider>
	);
};
