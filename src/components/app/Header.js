import { useNavigation } from '@react-navigation/native';
import { Appbar, Dialog, Portal, Text, Button } from "react-native-paper";
import { useUser } from '@clerk/clerk-expo';
import colors from "../../../colors.json";
import { useState } from 'react';

// Contains UI components that must be rendered on the highest z-index (modals, dialogs, FABs, etc.)
export default function Header() {

	// Gets user from Clerk
	const { user } = useUser(); 

	// Navigation object
	const navigation = useNavigation();

	// States for controlling dialog display
	const [dialogVisible, setDialogVisible] = useState();
	const [dialogInfo, setDialogInfo] = useState(0);

	const info = [
		<>
			<Dialog.Title style={{fontWeight: 700}}>Woah, there!</Dialog.Title>
			<Dialog.Content>
				<Text variant="bodyMedium">Are you sure you want to delete your account?</Text>
				<Text variant="bodyMedium">This action is irreversible.</Text>
			</Dialog.Content>
			<Dialog.Actions>
				<Button>No way!</Button>
				<Button >Yes, delete my account.</Button>
			</Dialog.Actions>
		</>
	]

	// Determines which info to display and displays dialog
	const displayDialog = () => {
		
		// Determines which info to display depending on current navigation location

		// Displays dialog
		setDialogVisible(true);
	};

	return (
		<>
			<Appbar.Header style={{backgroundColor: colors['background1']}}>
				<Appbar.Content title="forage.io" titleStyle={{fontWeight: 700}}></Appbar.Content>
				<Appbar.Action icon={"information-outline"} onPress={displayDialog}/>
			</Appbar.Header>

			{/* Account deletion warning dialog */}
			<Portal>
				<Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
					{info[dialogInfo]}
				</Dialog>
			</Portal>
		</>

	);	
};
