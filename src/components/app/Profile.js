import { useState } from 'react';
import { SafeAreaView, View, StyleSheet, useWindowDimensions, ScrollView } from "react-native";
import { Text, Avatar, IconButton, Button, Divider, Portal, Dialog } from "react-native-paper";
import { useUser, useClerk } from "@clerk/clerk-expo";
import env from '../../../env.json'
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import document from "../../utilities/terms_of_service.html";
import RenderHtml from 'react-native-render-html';

// Contains information about the user and various modifiable settings/configurations
export default function Profile() {

	// Utilities for rendering terms of service html
	const termsWidth = useWindowDimensions();
	source = {
		html: `<p>i am text that you cant see cus im black</p>`
	}
	const Stack = createStackNavigator();


	const navigation = useNavigation();

	// State for tracking whether or not account deletion dialog drawer is open
	const [warningDialogVisible, setWarningDialogVisible] = useState(false);

	// User object
	const { user } = useUser();
	// Clerk signOut object
	const { signOut } = useClerk();

	// Deletes user's account
	const handleDeleteAccount = async () => {

		// Signs user out of account
		signOut();

		// Deletes user
		const response = await fetch(`https://api.clerk.com/v1/users/${user.id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'authorization': 'Bearer ' + env['clerk-secretKey'],
			}
		});
		// Returns recipe JSON
		let data = await response.json();
		console.log(data);
	}

	return (

		<Stack.Navigator screenOptions={{
			header: () => <></>,
			gestureResponseDistance: 400
		}}>
			<Stack.Screen name="ProfileMain">
				{() =>
					<>
						<View style={{ paddingBottom: '20%' }}>
							<View style={styles.container}>
								{/* <Avatar.Image source={{ uri: user.imageUrl }} size={120} style={{ marginTop: 160, marginBottom: 10 }} /> */}
								<MaskedView maskElement={<MaterialCommunityIcons name="account-outline" size={100} />}>
									<LinearGradient
										colors={["#38FFA0", "#00C2FF"]}
										start={{ x: 0, y: 0 }}
										end={{ x: 1, y: 0 }}
										style={{ width: 100, height: 100 }}
									/>
								</MaskedView>
								<Text style={user.username.length > 12 ? styles.usernameSmall : styles.usernameLarge}>{user.username}</Text>
								<Text style={styles.subtext}>Created on {user.createdAt.toLocaleString().split(',')[0]}</Text>
							</View>
						</View>
						<View style={{ position: 'absolute', bottom: 5, width: '100%' }}>
							<Button mode="text" onPress={() => navigation.navigate('TermsOfService')}>Terms of Service</Button>
							<Divider style={{ marginHorizontal: 20 }} />
							<Button mode="text" onPress={signOut}>Sign out</Button>
							{/* <Divider style={{marginHorizontal: 20}}/>
			<Button mode="text" onPress={() => setWarningDialogVisible(true)}>Delete account</Button> */}
						</View>
						{/* <View style={{ marginTop: 15,  flexDirection: 'row'}}>
			<View style={{alignItems: 'center', width: '50%'}}>
				<Text  style={styles.subtext}>Created Recipes</Text>
				<Text variant="headlineLarge">40</Text>
			</View>
			<View style={{alignItems: 'center' , borderColor:rgb(0, 227, 138), borderLeftWidth: '2', width: '50%'}}>
				<Text style={styles.subtext}>Total Stars</Text>
				<Text variant="headlineLarge">100</Text>
			</View>
		</View> */}

						{/* Account deletion warning dialog */}
						{/* <Portal>
			<Dialog visible={warningDialogVisible} onDismiss={() => setWarningDialogVisible(false)}>
				<Dialog.Title style={{fontWeight: 700}}>Woah, there!</Dialog.Title>
				<Dialog.Content>
					<Text variant="bodyMedium">Are you sure you want to delete your account?</Text>
					<Text variant="bodyMedium">This action is irreversible.</Text>
				</Dialog.Content>
				<Dialog.Actions>
					<Button onPress={() => setWarningDialogVisible(false)}>No way!</Button>
					<Button onPress={handleDeleteAccount}>Yes, delete my account.</Button>
				</Dialog.Actions>
			</Dialog>
        </Portal> */}
					</>
				}
			</Stack.Screen>
			<Stack.Screen
				options={{
					presentation: 'modal',
					cardStyle: {
						backgroundColor: 'transparent'
					},
				}}
				name="TermsOfService">
				{() =>
					<View style={{ height: '100%', backgroundColor: '#111111' }}>
						<ScrollView>
							<RenderHtml
								contentWidth={termsWidth}
								source={source}
							/>
						</ScrollView>
					</View>
				}
			</Stack.Screen>
		</Stack.Navigator>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		justifyContent: 'center',
		height: '100%',
	},
	usernameSmall: {
		// fontFamily: 'Roboto',
		fontSize: 30,
		fontWeight: 700,
		marginBottom: 5
	},
	usernameLarge: {
		// fontFamily: 'Roboto',
		fontSize: 36,
		fontWeight: 700,
		marginBottom: 5
	},
	subtext: {
		color: 'grey',
		fontSize: 13
	}
});