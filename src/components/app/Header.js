import { useNavigation } from '@react-navigation/native';
import { Appbar, Avatar, Text } from "react-native-paper";
import { useUser } from '@clerk/clerk-expo';
import colors from "../../../colors.json";

// Contains UI components that must be rendered on the highest z-index (modals, dialogs, FABs, etc.)
export default function Header() {

	// Gets user from Clerk
	const { user } = useUser(); 

	// Navigation object
	const navigation = useNavigation();

	

	return (
		<Appbar.Header style={{backgroundColor: colors['background1']}}>
			<Appbar.Content title="forage.io" titleStyle={{fontWeight: 700}}></Appbar.Content>
			<Appbar.Action icon={"information-outline"} />
		</Appbar.Header>
	);	
};
