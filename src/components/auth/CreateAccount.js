import { useState } from "react";
import { View } from "react-native";
import { useSignUp, useUser } from "@clerk/clerk-expo";
import { HelperText, Button, TextInput } from "react-native-paper";
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from "@react-native-masked-view/masked-view";

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

		// Resets error text
		setUsernameHelperText("");
		setPasswordHelperText("");
		setConfirmPasswordHelperText("");

		// Checks if password equals confirm password field
		if(password != confirmPassword){
			setConfirmPasswordHelperText("Your password inputs are not equal.");
		}
		else if (username.length > 16) {
			setUsernameHelperText("Usernames must be between 4 and 16 characters long.");
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
						if(e.code == "form_username_invalid_length"){
							setUsernameHelperText("Usernames must be between 4 and 16 characters long.");
						}
						else{
							setUsernameHelperText(e.message);
						}
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
			selectionColor="white"
			activeOutlineColor="white"
		/>
		{usernameHelperText != "" ? <HelperText type='error'>{usernameHelperText}</HelperText> : <></>}
		<TextInput
			style={{ marginVertical: 2 }}
			value={password}
			label="Password"
			mode="outlined"
			onChangeText={(password) => setPassword(password)}
			keyboardAppearance="dark"
			selectionColor="white"
			activeOutlineColor="white"
			secureTextEntry={true}
		/> 
		{passwordHelperText != "" ? <HelperText type='error'>{passwordHelperText}</HelperText> : <></>}
		<TextInput
			style={{ marginVertical: 2 }}
			value={confirmPassword}
			label="Confirm Password"
			mode="outlined"
			onChangeText={(confirmPassword) => setConfirmPassword(confirmPassword)}
			keyboardAppearance="dark"
			selectionColor="white"
			activeOutlineColor="white"
			secureTextEntry={true}
		/>
		{confirmPasswordHelperText != "" ? <HelperText type='error'>{confirmPasswordHelperText}</HelperText> : <></>}
				
		<MaskedView maskElement={ <Button style={{ margin: 10, marginHorizontal: 30 }} buttonColor="black" mode="contained" onPress={handleSignUp}>
         Create account
        </Button>}>
			<LinearGradient
			colors={["#38FFA0", "#00C2FF"]}
			start={{ x: 0, y: 1 }}
			end={{ x: 1, y: 0 }}
			>
				<Button style={{ margin: 10, marginHorizontal: 30 }} buttonColor='transparent' textColor="black" mode="contained" onPress={handleSignUp}>
					Create account
				</Button>
			</LinearGradient>
		</MaskedView>
	</View>
  );
}