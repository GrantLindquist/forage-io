import { useNavigation } from '@react-navigation/native';
import { Appbar } from "react-native-paper";

// Contains UI components that must be rendered on the highest z-index (modals, dialogs, FABs, etc.)
export default function Header() {

	// State that provides navigation property
	const navigation = useNavigation();

	return (
	<Appbar.Header>
		{/* Displays back arrow if user is viewing a recipe */}
		{navigation.canGoBack() ? <><Appbar.BackAction onPress={() => navigation.goBack()} /></> 
		: <Appbar.Action></Appbar.Action>}
	</Appbar.Header>
	);	
};