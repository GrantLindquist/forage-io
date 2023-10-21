import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Image } from "react-native";
import { Chip, Text } from "react-native-paper";
import tags from '../../../tags.json';

// A small component containing a title and icon - used for filter sorting and recipe tagging.
export default function RecipeTag(props) {

	// State for tracking whether or not chip is selected
	const [selected, setSelected] = useState(() => {
		if(props.immutable) { return true; }
		else { return props.selected; }
	});

	// State for tracking tag object information
	const tagObject = useMemo(() => getTagObject(props.title));

	// States for styling tags
	const [color, setColor] = useState("grey");

	// Finds type code by tag title
	function getTagObject(title){
		return tags.find((tag) => tag.title === title);
	}

	// Assigns visual properties to tag
	useEffect(() => {
		switch(tagObject.typeCode){
            case 0:
				setColor("#FFCAED");
                break;
            case 1:
				setColor("#BEE8FF");
                break;
            case 2:
				setColor("#FFF0CA");
                break;
            case 3:
				setColor("#E1CAFF");
                break;
        }
	}, []);

	// Function that handles user interaction with chip
	const handlePress = () => {
		// Update selected state if tag is mutable
		if(!props.immutable){
			setSelected(!selected);
			// Use parental callback method to make specified action occur
			props.handlePress(props.tag);
		}
	}

	const styles = StyleSheet.create({
		tagUnselected: {
			marginRight: 5,
			marginBottom: 5,
			borderColor: 'grey',
			borderRadius: 8,
			borderWidth: 1,
			backgroundColor: 'transparent'
		},
		tagSelected: {
			marginRight: 5,
			marginBottom: 5,
			borderWidth: 1,
			borderRadius: 8,
			borderColor: color,
			backgroundColor: 'transparent'
		}
	});

	return (
		<Chip style={selected ? styles.tagSelected : styles.tagUnselected} compact={true} onPress={handlePress}>
			{/* If tag is a cuisine type tag, capitalize first letter of tag */}
			<Text style={selected ? {color:color} : {color:'grey'}} >{props.title}</Text>
		</Chip>
	);
};