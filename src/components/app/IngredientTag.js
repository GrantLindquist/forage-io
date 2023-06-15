import { useState } from "react";
import { StyleSheet } from "react-native";
import { Chip } from "react-native-paper"

// A small component containing a title and icon - almost identical to RecipeTag,
// but with minor differences and used exclusively for creating recipes
export default function IngredientTag(props) {

	// State for tracking whether or not chip is selected
	const [selected, setSelected] = useState(true);

	return (
	<Chip style={selected ? styles.tag : {display:'none'}} mode={'flat'} closeIcon={'close'} onClose={() => setSelected(false)}>
		{props.children}
	</Chip>
	);
};

const styles = StyleSheet.create({
	tag: {
		borderRadius: 8,
		marginRight: 5
	}
});