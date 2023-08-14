// eas build -p ios --profile preview

import { useState } from 'react';
import { MD3DarkTheme, PaperProvider } from 'react-native-paper';
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './src/components/auth/WelcomeScreen';
import AppNavigation from './src/components/app/AppNavigation';
import Header from './src/components/app/Header';
import env from './env.json';

// Creates tab navigator
const Stack = createStackNavigator();

// App entry point
export default function App() {
	
	return (
	<ClerkProvider publishableKey={env['clerk-publishableKey']}>
		{/* PaperProvider is used for UI management */}
		<PaperProvider theme={MD3DarkTheme}>
			{/* These components display if user is signed-in with Clerk */}
			<SignedIn>
				<Header/>
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
