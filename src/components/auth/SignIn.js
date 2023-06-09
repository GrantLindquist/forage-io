import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSignIn } from "@clerk/clerk-expo";

// Input fields for users to sign into their accounts
export default function SignIn() {

	// Clerk SignIn states for user management
	const { signIn, setActive, isLoaded } = useSignIn();

	// Form states for updating input display
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	// Attempts to sign-in user
	const onSignInPress = async () => {

		// Idk what this does.
		if (!isLoaded) {
			return;
		}
		
		// Sends user input to Clerk
		try {
			const completeSignIn = await signIn.create({
				identifier: username,
				password,
			});
			// Creates user session and indicates successful sign-in
			await setActive({ session: completeSignIn.createdSessionId });
		} 
		// If sign-in fails, return error from Clerk
		catch (err) {
			console.error(JSON.stringify(err, null, 2));
		}
	};
	return (
	<View>
		<View>
			<TextInput
				autoCapitalize="none"
				value={username}
				placeholder="Username..."
				onChangeText={(username) => setUsername(username)}
			/>
		</View>

		<View>
			<TextInput
				value={password}
				placeholder="Password..."
				secureTextEntry={true}
				onChangeText={(password) => setPassword(password)}
			/>
		</View>

		<TouchableOpacity onPress={onSignInPress}>
			<Text>Sign in</Text>
		</TouchableOpacity>
	</View>
	);
}