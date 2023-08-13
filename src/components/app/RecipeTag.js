import { useState } from "react";
import { StyleSheet } from "react-native";
import { Chip, Text } from "react-native-paper";

// A small component containing a title and icon - used for filter sorting and recipe tagging.
export default function RecipeTag(props) {

	// State for tracking whether or not chip is selected
	const [selected, setSelected] = useState(props.immutable ? true : false);

	// Function that handles user interaction with chip
	const handlePress = () => {
		// Update selected state if tag is mutable
		if(!props.immutable){
			setSelected(!selected);
			// Use parental callback method to make specified action occur
			// props.handleSelect();
		}
	}

	return (
	<Chip style={styles.tag} icon={props.icon} mode={selected ? 'flat' : 'outlined'} onPress={handlePress}>
		<Text style={{color: props.color}}># </Text>
		{props.title}
	</Chip>
	);
};

const styles = StyleSheet.create({
	tag: {
		borderRadius: 8,
		marginRight: 5,
		flexDirection: 'row'
	}
});