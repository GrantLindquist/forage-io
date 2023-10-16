import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Searchbar, Text, IconButton } from "react-native-paper";
import RecipeTag from "./RecipeTag";
import tags from '../../../tags.json';

// Expandable horizontal scroll view for viewing items
export default function TagSearch(props) {

    // State for tracking which tags are selected - start with default tags if provided with them
    const [selectedTags, setSelectedTags] = useState(() => {
        if (props.defaultTags) {
            let defaultTags = [];
            for (let tag of Object.keys(props.defaultTags)) {
                defaultTags.push(tag[0].charAt(2).toLowerCase() + tag[0].slice(3));
            }
            return defaultTags;
        } 
        else {
            return [];
        }
    });

    // State that handles which type of tag to display
    const [displayTypeCode, setDisplayTypeCode] = useState(0);
    const [displayTypeTitle, setDisplayTypeTitle] = useState("");

    // Set display title of tag group
    useEffect(() => {
        // Determine styled elements
        switch (displayTypeCode){
            case 0:
                setDisplayTypeTitle("meal");
                break;
            case 1:
                setDisplayTypeTitle("cuisine");
                break;
            case 2:
                setDisplayTypeTitle("diet");
                break;
            case 3:
                setDisplayTypeTitle("flavor");
                break;
        }
    }, [displayTypeCode, selectedTags])

    // Updates selected tags - only gives tag title strings to upper layer
    const updateSelectedTags = (tag) => {

        // Finds type code by tag title
        function getTypeCode(title){
            return tags.find((tag) => tag.title === title).typeCode;
        }

        // Convert selectedTags to an array of tag objects
        let selectedTagObjects = selectedTags.map(title => ({ title, typeCode: getTypeCode(title) }));

        // Gets tags of the same type
        let shallowList = selectedTagObjects.filter(item => item.typeCode === tag.typeCode);

        // If tag does not already exist in list, add it
        if (!selectedTags.includes(tag.title)) {
            shallowList.push(tag);

            // If user has selected more than two tags of any type, then remove one tag
            if (shallowList.length > 2) {
                shallowList.shift();
            }
        }
        // Otherwise, remove tag from list
        else {
            shallowList = shallowList.filter(item => item.title !== tag.title);
        }

        // Convert back to array of strings
        shallowList = shallowList.map(item => item.title);

        // Join array with other tags
        updatedTagList = selectedTags.filter(title => getTypeCode(title) !== tag.typeCode);
        updatedTagList = [...updatedTagList, ...shallowList];

        // Send results to parent component
        setSelectedTags(updatedTagList);
        props.updateSelectedTags(updatedTagList);
    }

    // Updates type of tag being displayed
    const updateDisplayTypeCode = (increment) => {
        let typeCode = displayTypeCode + increment;
        if(typeCode < 0){
            setDisplayTypeCode(3);
        }
        else if (typeCode > 3){
            setDisplayTypeCode(0);
        }
        else{
            setDisplayTypeCode(typeCode);
        }
    }

    // List of tags for user to select
    const tagList = tags.filter((tag) => tag.typeCode == displayTypeCode).map((tag) => {
        let selected = false;
        if(selectedTags.includes(tag.title)){
            selected = true;
        }
        return (
            <RecipeTag key={tag.title} title={tag.title} selected={selected} handlePress={() => updateSelectedTags(tag)}/>
        )
    });

	return (
        <View style={{ alignItems: 'center' }}>
            <ScrollView style={{ paddingTop: 8 }} horizontal={true}>
                <View style={{ flexWrap: 'wrap', flexDirection: 'row', flex: 3 }}>
                    {tagList}
                </View>
	        </ScrollView>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <IconButton style={{ margin: 0 }} size={20} icon={"arrow-left-drop-circle-outline"} onPress={() => updateDisplayTypeCode(-1)} />
                <Text style={{ fontSize: 16, textAlign: 'center', minWidth: 80 }}>{displayTypeTitle}</Text>
                <IconButton style={{ margin: 0 }} size={20} icon={"arrow-right-drop-circle-outline"} onPress={() => updateDisplayTypeCode(1)} />
            </View>
        </View>
	);
};
