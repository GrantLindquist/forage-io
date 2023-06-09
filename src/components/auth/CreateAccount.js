import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";

// Input fields for users to create their accounts
export default function CreateAccount() {

	// Clerk SignUp states for user management
	const { isLoaded, signUp } = useSignUp();

	// Form states for updating input display
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	// Attempts to create account
	const onSignUpPress = async () => {

		// Idk what this does.
		if (!isLoaded) {
			return;
		}

		// Sends user input to Clerk
		try {
			await signUp.create({
				username,
				password,
			});
		} 
		// If account creation fails, return error from Clerk
		catch (err) {
			console.error(JSON.stringify(err, null, 2));
		}
	};

	return (
	<View>
		<Text>Create account!</Text>

		<TextInput
			autoCapitalize="none"
			value={username}
			placeholder="Username..."
			onChangeText={(email) => setUsername(email)}
		/>

		<TextInput
			value={password}
			placeholder="Password..."
			placeholderTextColor="#000"
			secureTextEntry={true}
			onChangeText={(password) => setPassword(password)}
		/>

		<TouchableOpacity onPress={onSignUpPress}>
			<Text>Sign up</Text>
		</TouchableOpacity>
	</View>
  );
}