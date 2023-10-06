import { useState } from "react";
import { KeyboardAvoidingView, View, Pressable, StyleSheet } from "react-native";
import { Text, Button } from "react-native";
import SignIn from "./SignIn";
import CreateAccount from "./CreateAccount";

// Welcomes user to application and displays either sign-in or sign-up component
export default function WelcomeScreen() {

	// Boolean state that determines which auth component to display
	const [isCreatingAccount, setCreatingAccount] = useState(false);

	return (
	<View style={styles.container}>
		<Text style={styles.title}>forage.io</Text>
		
		{/* Either sign-in or create account components are displayed, depending on which option user selects */}
		<KeyboardAvoidingView behavior="padding" style={{width: "80%", position: 'absolute', bottom: "16%"}}>
			{isCreatingAccount ? <CreateAccount/> : <SignIn/>}
		</KeyboardAvoidingView>

		<View style={{alignItems: 'center', margin: 10, position: 'absolute', bottom: "8%" }}>
			{isCreatingAccount ? 
			<Pressable onPress={() => setCreatingAccount(false)}>
				<Text style={{ color: 'white' }}>Don't have an account?</Text>
				<Text style={{ color: 'white' }}>Create one for free!</Text>
			</Pressable> : 
			<Pressable onPress={() => setCreatingAccount(true)}>
				<Text style={{ color: 'white' }}>Already have an account?</Text>
				<Text style={{ color: 'white' }}>Sign in here!</Text>
			</Pressable>}
		</View>
	</View>
	);	
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#101010"
	},
	title: {
		fontSize: 50,
		fontWeight: 700,
		color: "white", 
		position: 'absolute', 
		top: "20%"
	}
});