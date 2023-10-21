import { useState } from "react";
import { View } from "react-native";
import { useSignIn, useUser } from "@clerk/clerk-expo";
import { Text, Button, TextInput, HelperText } from "react-native-paper";
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from "@react-native-masked-view/masked-view";

// Input fields for users to sign into their accounts
export default function SignIn() {

	// Clerk SignIn states for user management
	const { signIn, setActive, isLoaded } = useSignIn();

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
		} 
		// If sign-in fails, return error from Clerk
		catch (err) {
			// Log error
			console.error(JSON.stringify(err, null, 2));

			// Resets error text
			setUsernameHelperText("");
			setPasswordHelperText("");

			// Update helper text state
			for(e of err.errors){
				if(e.meta.paramName == "identifier"){
					// If account does not exist
					if(e.code == "form_identifier_not_found"){
						setUsernameHelperText("Account does not exist.");
					}
					// If username is invalid
					else if(e.code == "form_param_format_invalid"){
						setUsernameHelperText("Enter valid username.");
					}
					// For all other username errors
					else{
						setUsernameHelperText(e.message);
					}
				}
				else if(e.meta.paramName == "password"){
					// If password is incorrect
					if(e.code == "form_password_incorrect"){
						setPasswordHelperText("Password is incorrect.");
					}
					// For all other password errors
					else{
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
			activeOutlineColor="grey"
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
			activeOutlineColor="grey"
			secureTextEntry={true}
		/>
		{passwordHelperText != "" ? <HelperText type='error'>{passwordHelperText}</HelperText> : <></>}
		
		<MaskedView maskElement={ <Button style={{ margin: 10, marginHorizontal: 30 }} buttonColor="black" mode="contained" onPress={handleSignIn}>
          Sign-in
        </Button>}>
			<LinearGradient
			colors={["#38FFA0", "#00C2FF"]}
			start={{ x: 0, y: 1 }}
			end={{ x: 1, y: 0 }}
			>
				<Button style={{ margin: 10, marginHorizontal: 30 }} buttonColor='transparent' textColor="black" mode="contained" onPress={handleSignIn}>Sign-in</Button>
			</LinearGradient>
		</MaskedView>
	</View>
	);
}