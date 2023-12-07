import { Appbar } from "react-native-paper";
import { Image, View } from "react-native";

// Header component for app, displays above most other components
export default function Header() {

	return (
		<Appbar.Header style={{ justifyContent: 'center', alignItems: 'center', marginBottom: -10, borderBottomLeftRadius: 15, borderBottomRightRadius: 15 }}>
			<View style={{ justifyContent: 'center', alignItems: 'center' }}>
				<Image
					style={{ height: 35, width: 35 }}
					source={require('../../../assets/logo/nav-logo.png')}>
				</Image>
			</View>
		</Appbar.Header>
	);
};
