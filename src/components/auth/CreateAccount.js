import { useState } from "react";
import { View } from "react-native";
import { useSignUp, useUser } from "@clerk/clerk-expo";
import { HelperText, Button, TextInput } from "react-native-paper";

// Input fields for users to create their accounts
export default function CreateAccount() {

	// Clerk SignUp states for user management
	const { isLoaded, setActive, signUp } = useSignUp();
	const { user } = useUser();

	// Form states for updating input display
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [usernameHelperText, setUsernameHelperText] = useState("");
	const [passwordHelperText, setPasswordHelperText] = useState("");
	const [confirmPasswordHelperText, setConfirmPasswordHelperText] = useState("");

	// Attempts to create account
	const handleSignUp = async () => {

		// Checks if password equals confirm password field
		if(password != confirmPassword){
			setConfirmPasswordHelperText("Your password inputs are not equal.");
		}
		else{
			// Idk what this does.
			if (!isLoaded) {
				return;
			}

			// Sends user input to Clerk
			try {
				const completeSignUp = await signUp.create({
					username,
					password,
					unsafeMetadata: {
						// List of recipeIds that user has "starred"
						savedRecipeIds: [],
						// Millisecond values of when recipes are created
						recipeCharges: []
					},
				});
				await setActive({ session: completeSignUp.createdSessionId });
			} 
			// If account creation fails, return error from Clerk
			catch (err) {
				// Log error
				console.error(JSON.stringify(err, null, 2));

				// Update helper text state
				for(e of err.errors){
					if(e.meta.paramName == "username"){
						setUsernameHelperText(e.message);
					}
					else if(e.meta.paramName == "password"){
						setPasswordHelperText(e.message);
					}
				}
			}
		}
	};

	return (
	<View>
		<TextInput
			style={{ marginVertical: 2 }}
			autoCapitalize="none"
			value={username}
			label="Username"
			mode="outlined"
			onChangeText={(username) => setUsername(username)}
			keyboardAppearance="dark"
		/>
		{usernameHelperText != "" ? <HelperText type='error'>{usernameHelperText}</HelperText> : <></>}
		<TextInput
			style={{ marginVertical: 2 }}
			value={password}
			label="Password"
			mode="outlined"
			onChangeText={(password) => setPassword(password)}
			keyboardAppearance="dark"
		/> 
		{passwordHelperText != "" ? <HelperText type='error'>{passwordHelperText}</HelperText> : <></>}
		<TextInput
			style={{ marginVertical: 2 }}
			value={confirmPassword}
			label="Confirm Password"
			mode="outlined"
			onChangeText={(confirmPassword) => setConfirmPassword(confirmPassword)}
			keyboardAppearance="dark"
		/>
		{confirmPasswordHelperText != "" ? <HelperText type='error'>{confirmPasswordHelperText}</HelperText> : <></>}
		<Button style={{ margin: 10 }} mode="contained" onPress={handleSignUp}>Create account</Button>
	</View>
  );
}