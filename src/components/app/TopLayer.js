import { useState } from 'react';
import { View } from "react-native";
import { Snackbar } from 'react-native-paper';

// Contains UI components that must be rendered on the highest z-index (modals, dialogs, FABs, etc.)
export default function TopLayer() {

	return (
	<View>
        <Snackbar
            visible={visible}
            onDismiss={onDismissSnackBar}>
            Hey there! I'm a Snackbar.
        </Snackbar>
	</View>
	);	
};