import { Appbar } from "react-native-paper";
import { Image } from "react-native";

// Header component for app, displays above most other components
export default function Header() {

	return (
		<Appbar.Header style={{ alignItems: 'center', marginBottom: -10, borderBottomLeftRadius: 15, borderBottomRightRadius: 15 }}>
				<Image
					style={{ height: 37, width: 135, marginLeft: 14 }}
					source={require('../../../assets/logo/nav-logoface.png')}>
				</Image>
		</Appbar.Header>
	);
};
