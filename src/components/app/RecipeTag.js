import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Chip, Text } from "react-native-paper";
import tags from '../../../tags.json';
import colors from "../../../colors.json";

// A small component containing a title and icon - used for filter sorting and recipe tagging.
export default function RecipeTag(props) {

	// State for tracking whether or not chip is selected
	const [selected, setSelected] = useState(false);

	// States for styling tags
	const [color, setColor] = useState("grey");
	const [icon, setIcon] = useState("");

	// Assigns color to tag
	useEffect(() => {
		switch(tags.find((tag) => tag.filterTitle == props.title).filterTypeCode){
            case 0:
                setColor(colors['pink']);
				setIcon(() => <></>);
                break;
            case 1:
                setColor(colors['blue']);
				setIcon(() => <></>);
                break;
            case 2:
                setColor(colors['yellow']);
				setIcon(() => <></>);
                break;
            case 3:
                setColor(colors['green']);
				setIcon(() => <></>);
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

	const styles = StyleSheet.create({
		tagUnselected: {
			borderRadius: 8,
			marginRight: 5,
			backgroundColor: '#1F212F'
		},
		tagSelected: {
			borderRadius: 8,
			marginRight: 5,
			backgroundColor: '#1F212F',
			borderBottomWidth: 3,
			borderBottomColor: color,
			marginBottom: -3
		}
	});

	return (
		<Chip style={selected ? styles.tagSelected : styles.tagUnselected} icon={icon} onPress={handlePress}>
			<Text style={{color: color}}>{props.title}</Text>
		</Chip>
	);
};