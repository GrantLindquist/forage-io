import { Appbar } from "react-native-paper";
import colors from "../../../colors.json";

// Header component for app, displays above most other components
export default function Header() {

	return (
		<Appbar.Header style={{backgroundColor: colors['background1']}}>
			<Appbar.Content title="forage.io" titleStyle={{fontWeight: 700}}></Appbar.Content>
		</Appbar.Header>
	);	
};
