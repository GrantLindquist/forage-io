import { useMemo, useState } from "react";
import { Text } from "react-native-paper";
import tags from '../../../tags.json';
import { Pressable, StyleSheet } from "react-native";

// A small component containing a title and icon - used for filter sorting and recipe tagging.
export default function RecipeTag(props) {

	// State for tracking whether or not chip is selected
	const selected = useMemo(() => {
		if(props.immutable) { return true; }
		else { return props.selected; }
	}, [props.selected])

	// State for tracking tag object information
	const color = useMemo(() => {
		const tagObject = getTagObject(props.title);
		switch(tagObject.typeCode){
			case 0:
				return {
					bodyColor: '#FF008A',
					textColor: '#FFCAED'
				};
			case 1:
				return {
					bodyColor: '#00A3FF',
					textColor: '#BEE8FF'
				};
			case 2:
				return {
					bodyColor: '#FF7A00',
					textColor: '#FFF0CA'
				};
			case 3:
				return {
					bodyColor: '#7000FF',
					textColor: '#E1CAFF'
				};
        }
	});

	const formattedTitle = useMemo(() => {
		// Insert a space before all uppercase letters
		const tagObject = getTagObject(props.title);
		normalCase = props.title.replace(/([A-Z])/g, " $1");

		// Capitalize the first letter of each word for cuisine tags
		if(tagObject.typeCode == 1){
			normalCase = normalCase.charAt(0).toUpperCase() + normalCase.slice(1);
		}
		else{
			normalCase = normalCase.toLowerCase();
		}
	 
		return normalCase;
	 
	}, [props.title])

	// Finds type code by tag title
	function getTagObject(title){
		return tags.find((tag) => tag.title === title);
	}

	// Function that handles user interaction with chip
	const handlePress = () => {
		// Update selected state if tag is mutable
		if(!props.immutable){
			// Use parental callback method to make specified action occur
			props.handlePress(props.tag);
		}
	}

	return (
		<Pressable style={[styles.tag, selected ? {backgroundColor: color.bodyColor, color: color.textColor} : {}]} onPress={handlePress}>
			{/* If tag is a cuisine type tag, capitalize first letter of tag */}
			<Text style={{paddingHorizontal: 6, paddingVertical: 4}}>{formattedTitle}</Text>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	tag: {
		backgroundColor: 'grey',
		color: 'grey',
		opacity: .9,
		borderRadius: 3,
		fontSize: 13,
		fontWeight: 500,
		marginRight: 6,
		marginBottom: 6
	}
})
