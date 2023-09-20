import { useState } from "react";
import { View } from "react-native";
import { useSignIn, useUser } from "@clerk/clerk-expo";
import { Text, Button, TextInput, HelperText } from "react-native-paper";

// Input fields for users to sign into their accounts
export default function SignIn() {

	// Clerk SignIn states for user management
	const { signIn, setActive, isLoaded } = useSignIn();
	const { user } = useUser();

	// Form states for updating input display
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [usernameHelperText, setUsernameHelperText] = useState("");
	const [passwordHelperText, setPasswordHelperText] = useState("");
 
	// Attempts to sign-in user
	const handleSignIn = async () => {

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
			await setActive({ 
				session: completeSignIn.createdSessionId 
			});

			// Check for outdated charges
			var recipeCharges = user.unsafeMetadata.recipeCharges;
			for(item of recipeCharges){
				// If an hour has passed since its addition, remove charge
				if(Date.now() - item > 3600000){
					recipeCharges.shift();
				}
				else{
					break;
				}
			}
			// Update user obj
			await user.update({
				unsafeMetadata: { 
					savedRecipeIds: user.unsafeMetadata.savedRecipeIds,
					recipeCharges: recipeCharges
				}
			});
		} 
		// If sign-in fails, return error from Clerk
		catch (err) {
			// Log error
			console.error(JSON.stringify(err, null, 2));

			// Update helper text state
			for(e of err.errors){
				if(e.meta.paramName == "identifier"){
					setUsernameHelperText(e.message);
				}
				else if(e.meta.paramName == "password"){
					setPasswordHelperText(e.message);
				}
			}
		}
	};
	return (
	<View>
		<TextInput
			autoCapitalize="none"
			value={username}
			label="Username"
			mode="outlined"
			onChangeText={(username) => setUsername(username)}
		/>
		{usernameHelperText != "" ? <HelperText type='error'>{usernameHelperText}</HelperText> : <></>}
		<TextInput
			value={password}
			label="Password"
			mode="outlined"
			onChangeText={(password) => setPassword(password)}
		/>
		{passwordHelperText != "" ? <HelperText type='error'>{passwordHelperText}</HelperText> : <></>}
		<HelperText></HelperText>
		<Button mode="contained" onPress={handleSignIn}>Sign-in</Button>
	</View>
	);
}