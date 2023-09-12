import { useNavigation } from '@react-navigation/native';
import { Appbar, Avatar } from "react-native-paper";
import { useUser } from '@clerk/clerk-expo';
import colors from "../../../colors.json";

// Contains UI components that must be rendered on the highest z-index (modals, dialogs, FABs, etc.)
export default function Header(props) {

	// State that provides navigation property
	const navigation = useNavigation();

	// Gets user from Clerk
	const { user } = useUser(); 

	return (
		<Appbar.Header style={{backgroundColor: colors['background1']}}>
			{/* Displays back arrow if user is viewing a recipe */}
			{/* {navigation.canGoBack() ? <><Appbar.BackAction onPress={() => navigation.goBack()} /></> 
			: <Appbar.Action></Appbar.Action>} */}
		</Appbar.Header>
		);	
	};