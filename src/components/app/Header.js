import { useNavigation } from '@react-navigation/native';
import { Appbar, Avatar } from "react-native-paper";
import { useUser } from '@clerk/clerk-expo';

// Contains UI components that must be rendered on the highest z-index (modals, dialogs, FABs, etc.)
export default function Header(props) {

	// Gets user from Clerk
	const { user } = useUser(); 

	return (
	<Appbar.Header>

	</Appbar.Header>
	);	
};