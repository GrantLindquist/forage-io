import { useState } from "react";
import { KeyboardAvoidingView, View, Pressable, StyleSheet, Image } from "react-native";
import { Text } from "react-native";
import SignIn from "./SignIn";
import CreateAccount from "./CreateAccount";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from 'expo-linear-gradient';

// Gradient text for title screen
export const GradientText = (props) => {
	return (
		<MaskedView maskElement={<Text {...props} />}>
			<LinearGradient
				colors={["#38FFA0", "#00C2FF"]}
				start={{ x: 0, y: 1 }}
				end={{ x: 1, y: 0 }}
			>
				<Text {...props} style={[props.style, { opacity: 0 }]} />
			</LinearGradient>
		</MaskedView>
	);
};

// Welcomes user to application and displays either sign-in or sign-up component
export default function WelcomeScreen() {

	// Boolean state that determines which auth component to display
	const [isCreatingAccount, setCreatingAccount] = useState(false);

	return (
		<View style={styles.container}>
			<View style={{ position: 'absolute', top: '15%', alignItems: "center", }}>
				<Image
					style={{ height: 90, width: 280 }}
					source={require('../../../assets/logo/nav-logoface.png')}>
				</Image>
				<Text style={styles.subtitle}>Powered by GPT</Text>
			</View>

			{/* Either sign-in or create account components are displayed, depending on which option user selects */}
			<KeyboardAvoidingView behavior="padding" style={{ width: "80%", position: 'absolute', bottom: "16%" }}>
				{isCreatingAccount ? <CreateAccount /> : <SignIn />}
			</KeyboardAvoidingView>

			<View style={{ alignItems: 'center', margin: 10, position: 'absolute', bottom: "9%" }}>
				{isCreatingAccount ?
					<Pressable style={{ alignItems: 'center' }} onPress={() => setCreatingAccount(false)}>
						<Text style={{ color: 'white' }}>Already have an account?</Text>
						<Text style={{ color: 'white' }}>Sign in here!</Text>
					</Pressable> :
					<Pressable style={{ alignItems: 'center' }} onPress={() => setCreatingAccount(true)}>
						<Text style={{ color: 'white' }}>Don't have an account?</Text>
						<Text style={{ color: 'white' }}>Create one for free!</Text>
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
		fontSize: 58,
		fontWeight: 700,
		color: "white",
	},
	subtitle: {
		color: 'grey',
	}
});