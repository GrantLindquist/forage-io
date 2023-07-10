import { useState } from "react";
import { View, StyleSheet } from "react-native";
import SignIn from "./SignIn";
import CreateAccount from "./CreateAccount";

// Welcomes user to application and displays either sign-in or sign-up component
export default function WelcomeScreen() {

	// Boolean state that determines which auth component to display
	const [isCreatingAccount, setCreatingAccount] = useState(false);

	return (
	<View style={styles.container}>
		{/* Either sign-in or create account components are displayed, depending on which option user selects */}
		{isCreatingAccount ? <CreateAccount/> : <SignIn/>}
	</View>
	);	
};

const styles = StyleSheet.create({
	container: {
	  flex: 1,
	  alignItems: "center",
	  justifyContent: "center",
	},
});