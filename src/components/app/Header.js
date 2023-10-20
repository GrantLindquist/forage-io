import { Appbar } from "react-native-paper";

// Header component for app, displays above most other components
export default function Header() {

	return (
		<Appbar.Header>
			<Appbar.Content title="forage.io" titleStyle={{fontWeight: 700}}></Appbar.Content>
		</Appbar.Header>
	);	
};
