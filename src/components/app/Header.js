import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Appbar } from "react-native-paper";

// Contains UI components that must be rendered on the highest z-index (modals, dialogs, FABs, etc.)
export default function Header() {

	// State that provides navigation property
	const navigation = useNavigation();

	// State for tracking user search input
	const [displayBackAction, setDisplayBackAction] = useState(false);

	return (
	<Appbar.Header>
		<Appbar.BackAction onPress={() => navigation.goBack()} />
		<Appbar.Content title="forage.io" />
	</Appbar.Header>
	);	
};