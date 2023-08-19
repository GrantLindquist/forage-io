import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Chip, Text } from "react-native-paper";
import tags from '../../../tags.json'

// A small component containing a title and icon - used for filter sorting and recipe tagging.
export default function RecipeTag(props) {

	// State for tracking whether or not chip is selected
	const [selected, setSelected] = useState(false);

	// Color for hashtag icon in tag body
	const [color, setColor] = useState("grey");

	// Assigns color to tag
	useEffect(() => {
		switch(tags.find((tag) => tag.filterTitle == props.title).filterTypeCode){
            case 0:
                setColor("red");
                break;
            case 1:
                setColor("blue");
                break;
            case 2:
                setColor("yellow");
                break;
            case 3:
                setColor("green");
                break;
			default:
				setColor("grey");
				break;
        }
	}, []);

	// Function that handles user interaction with chip
	const handlePress = () => {
		// Update selected state if tag is mutable
		if(!props.immutable){
			setSelected(!selected);
			// Use parental callback method to make specified action occur
			props.handlePress(props.title);
		}
	}

	return (
	<Chip style={styles.tag} icon={props.icon} mode={selected ? 'flat' : 'outlined'} onPress={handlePress}>
		<Text style={{color: color}}># </Text>
		{props.title}
	</Chip>
	);
};

const styles = StyleSheet.create({
	tag: {
		borderRadius: 8,
		marginRight: 5,
		flexDirection: 'row',
		width: 110
	}
});