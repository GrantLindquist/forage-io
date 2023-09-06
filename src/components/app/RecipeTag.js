import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Chip, Text } from "react-native-paper";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import tags from '../../../tags.json'

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
                setColor("#E07C60");
				setIcon(() => <></>);
                break;
            case 1:
                setColor("#49C1E1");
				setIcon(() => <></>);
                break;
            case 2:
                setColor("#E0B131");
				setIcon(() => <></>);
                break;
            case 3:
                setColor("#3DE0A7");
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

	return (
		<Chip style={selected ? styles.tagSelected : styles.tagUnselected} icon={icon} onPress={handlePress}>
			<Text style={{color: color}}>{props.title}</Text>
		</Chip>
	);
};

const styles = StyleSheet.create({
	tagUnselected: {
		borderRadius: 8,
		marginRight: 5,
		backgroundColor: '#2A2A2A'
	},
	tagSelected: {
		borderRadius: 8,
		marginRight: 5,
	}
});