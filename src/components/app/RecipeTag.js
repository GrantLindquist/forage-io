import { useEffect, useState } from "react";
import { StyleSheet, Image } from "react-native";
import { Chip, Text } from "react-native-paper";
import tags from '../../../tags.json';
import colors from "../../../colors.json";

// A small component containing a title and icon - used for filter sorting and recipe tagging.
export default function RecipeTag(props) {

	// State for tracking whether or not chip is selected
	const [selected, setSelected] = useState(() => {
		if(props.immutable) { return true; }
		else { return props.selected; }
	});

	// State for tracking tag object information
	const tagObject = getTagObject(props.title);

	// States for styling tags
	const [color, setColor] = useState("grey");
	const [icon, setIcon] = useState("");

	// Finds type code by tag title
	function getTagObject(title){
		return tags.find((tag) => tag.title === title);
	}

	// Assigns visual properties to tag
	useEffect(() => {
		switch(tagObject.typeCode){
            case 0:
                setColor(colors['pink']);
				setIcon(() => <Image 
					source={require('../../../assets/icons/meal-type.png')}
					style={{width: 14, height: 14}}
				/>);
                break;
            case 1:
                setColor(colors['blue']);
				setIcon(() => <Image 
					source={require('../../../assets/icons/cuisine-type.png')}
					style={{width: 14, height: 14}}
				/>);
                break;
            case 2:
                setColor(colors['yellow']);
				setIcon(() => <Image 
					source={require('../../../assets/icons/flavor.png')}
					style={{width: 14, height: 14}}
				/>);
                break;
            case 3:
                setColor(colors['green']);
				setIcon(() => <Image 
					source={require('../../../assets/icons/diet-type.png')}
					style={{width: 14, height: 14}}
				/>);
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
			backgroundColor: colors['background1'],
			borderColor: 'white',
			borderRadius: 8,
			borderWidth: 1,
		},
		tagSelected: {
			marginRight: 5,
			marginBottom: 5,
			backgroundColor: colors['background1'],
			borderWidth: 1,
			borderRadius: 8,
			borderColor: color,
		}
	});

	return (
		<Chip style={selected ? styles.tagSelected : styles.tagUnselected} onPress={handlePress}>
			{/* If tag is a cuisine type tag, capitalize first letter of tag */}
			<Text style={selected ? {color:color} : {color:'white'}} >{props.title}</Text>
		</Chip>
	);
};