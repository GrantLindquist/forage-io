import { useNavigation } from '@react-navigation/native';
import { Appbar, Dialog, Portal, Text, Button } from "react-native-paper";
import { useUser } from '@clerk/clerk-expo';
import colors from "../../../colors.json";
import { useState } from 'react';

// Contains UI components that must be rendered on the highest z-index (modals, dialogs, FABs, etc.)
export default function Header() {

	return (
		<Appbar.Header style={{backgroundColor: colors['background1']}}>
			<Appbar.Content title="forage.io" titleStyle={{fontWeight: 700}}></Appbar.Content>
		</Appbar.Header>
	);	
};
