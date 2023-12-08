import { Appbar } from "react-native-paper";
import { Image, Text } from "react-native";

// Header component for app, displays above most other components
export default function Header() {

	return (
		<Appbar.Header style={{ alignItems: 'center', marginBottom: -10, borderBottomLeftRadius: 15, borderBottomRightRadius: 15 }}>
				<Image
					style={{ height: 35, width: 135, marginLeft: 10 }}
					source={require('../../../assets/logo/nav-logoface.png')}>
				</Image>
		</Appbar.Header>
	);
};
