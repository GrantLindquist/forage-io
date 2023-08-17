import { useState } from 'react';
import { SafeAreaView, View , StyleSheet} from "react-native";
import { Text, Avatar, IconButton, Button, Divider, Portal, Dialog } from "react-native-paper";
import { useUser, useClerk } from "@clerk/clerk-expo";
import env from '../../../env.json'

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
		<SafeAreaView>
			<View style={styles.container}>
				<Avatar.Image source={{uri: user.imageUrl}} size={120} style={{marginBottom: 20}}/>
				<Text variant='headlineLarge'>{user.username}</Text>
				<Text variant='headlineSmall'>{user.createdAt.toDateString()}</Text>
			</View>
			<Button mode="text">Terms of Service</Button>
			<Divider style={{marginHorizontal: 20}}/>
			<Button mode="text" onPress={signOut}>Sign out</Button>
			<Divider style={{marginHorizontal: 20}}/>
			<Button mode="text" onPress={() => setWarningDialogVisible(true)}>Delete account</Button>
		</SafeAreaView>

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
		alignItems: 'center'
	},
});