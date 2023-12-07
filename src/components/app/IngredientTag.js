import { useState } from "react";
import { StyleSheet } from "react-native";
import { Chip } from "react-native-paper"

// A small component containing a title and icon - almost identical to RecipeTag,
// but with minor differences and used exclusively for creating recipes
export default function IngredientTag(props) {

	// State for tracking whether or not chip is selected
	const [selected, setSelected] = useState(true);

	// Handles deletion of ingredient tag
	const handleDelete = () => {
		// Update UI
		setSelected(false)

		props.handleDelete();
	}

	return (
	<Chip style={selected ? styles.tag : {display:'none'}} mode={'flat'} closeIcon={'close'} onClose={handleDelete} compact={true}>
		{props.children}
	</Chip>
	);
};

const styles = StyleSheet.create({
	tag: {
		marginRight: 5,
		borderColor: 'grey',
		borderRadius: 8,
		borderWidth: 1,
		backgroundColor: 'transparent'
	}
});