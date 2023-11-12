import { useEffect, useMemo, useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { Text } from "react-native-paper";
import tags from '../../../tags.json';

// Small, display-only chip that is attached to Recipes
export default function RecipeTaCompressed(props) {

	// State for tracking tag object information
	const tagObject = useMemo(() => getTagObject(props.title));

	// States for styling tags
	const [color, setColor] = useState("grey");
	const [textColor, setTextColor] = useState("grey");

	// Finds type code by tag title
	function getTagObject(title){
		return tags.find((tag) => tag.title === title);
	}

	// Assigns visual properties to tag
	useEffect(() => {
		switch(tagObject.typeCode){
            case 0:
				setColor("#FF008A");
				setTextColor("#FFCAED");
                break;
            case 1:
				setColor("#00A3FF");
				setTextColor("#BEE8FF");
                break;
            case 2:
				setColor("#FF7A00");
				setTextColor("#FFF0CA");
                break;
            case 3:
				setColor("#7000FF");
				setTextColor("#E1CAFF");
                break;
        }
	}, []);

	return (
		<View style={{backgroundColor: color, opacity: .9, borderRadius: 3}}>
			{/* If tag is a cuisine type tag, capitalize first letter of tag */}
			<Text style={{color: textColor, fontSize: 13, fontWeight: 700, paddingVertical: 3, paddingHorizontal: 5}}>{props.title}</Text>
		</View>
	);

};
