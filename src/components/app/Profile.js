import { useState } from 'react';
import { SafeAreaView, View , StyleSheet} from "react-native";
import { Text, Avatar, IconButton, Button, Divider, Portal, Dialog } from "react-native-paper";
import { useUser, useClerk } from "@clerk/clerk-expo";
import env from '../../../env.json'
import colors from '../../../colors.json'

// Contains information about the user and various modifiable settings/configurations
export default function Profile() {

	// State for tracking whether or not account deletion dialog drawer is open
	const [warningDialogVisible, setWarningDialogVisible] = useState(false);

	// User object
	const { user } = useUser(); 
	// Clerk signOut object
	const { signOut } = useClerk();

	// Deletes user's account
	const handleDeleteAccount = async() => {

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
	<>
		<View style={styles.container}>
			<Avatar.Image source={{uri: user.imageUrl}} size={120} style={{marginTop: 80, marginBottom: 10}}/>
			<Text style={styles.username}>{user.username}</Text>
			<Text style={styles.subtext}>Created on {user.createdAt.toLocaleString().split(',')[0]}</Text>
		</View>
		<View style={{position: 'absolute', bottom: 20, width: '100%'}}>
			<Button mode="text">Terms of Service</Button>
			<Divider style={{marginHorizontal: 20}}/>
			<Button mode="text" onPress={signOut}>Sign out</Button>
			<Divider style={{marginHorizontal: 20}}/>
			<Button mode="text" onPress={() => setWarningDialogVisible(true)}>Delete account</Button>
		</View>
		<View style={{ marginTop: 15,  flexDirection: 'row'}}>
			<View style={{alignItems: 'center', width: '50%'}}>
				<Text variant="bodyLarge">Created Recipes</Text>
				<Text variant="headlineLarge">40</Text>
			</View>
			<View style={{alignItems: 'center' , borderColor: colors['primary'], borderLeftWidth: '1', width: '50%'}}>
				<Text variant="bodyLarge">Total Stars</Text>
				<Text variant="headlineLarge">100</Text>
			</View>
		</View>

		{/* Account deletion warning dialog */}
		<Portal>
			<Dialog visible={warningDialogVisible} onDismiss={() => setWarningDialogVisible(false)}>
				<Dialog.Title>Alert</Dialog.Title>
				<Dialog.Content>
					<Text variant="bodyMedium">Are you sure you want to delete your account?</Text>
					<Text variant="bodyMedium">This action is irreversible.</Text>
				</Dialog.Content>
				<Dialog.Actions>
					<Button onPress={() => setWarningDialogVisible(false)}>No way!</Button>
					<Button onPress={handleDeleteAccount}>Yes, delete my account.</Button>
				</Dialog.Actions>
			</Dialog>
        </Portal>
	</>
	);	
};

const styles = StyleSheet.create({
	container: {
		marginBottom: 20,
		alignItems: 'center',
		justifyContent: 'center',
	},
	username: {
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