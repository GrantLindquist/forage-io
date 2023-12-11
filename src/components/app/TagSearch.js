import { useEffect, useState } from "react";
import { ScrollView, View, Image } from "react-native";
import { Text, IconButton } from "react-native-paper";
import RecipeTag from "./RecipeTag";
import tags from '../../utilities/tags.json';

// Expandable horizontal scroll view for viewing items
export default function TagSearch(props) {

    // State for tracking which tags are selected - start with default tags if provided with them
    const [selectedTags, setSelectedTags] = useState(props.defaultTags);

    // State that handles which type of tag to display
    const [displayTypeCode, setDisplayTypeCode] = useState(0);
    const [displayTypeTitle, setDisplayTypeTitle] = useState("");
    const [displayTypeTitleColor, setDisplayTypeTitleColor] = useState("grey");

    // Set display title of tag group
    useEffect(() => {
        // Determine styled elements
        switch (displayTypeCode) {
            case 0:
                setDisplayTypeTitle("meal");
                setDisplayTypeTitleColor("#FF008A");
                break;
            case 1:
                setDisplayTypeTitle("cuisine");
                setDisplayTypeTitleColor("#00A3FF");
                break;
            case 2:
                setDisplayTypeTitle("diet");
                setDisplayTypeTitleColor("#FF7A00");
                break;
            case 3:
                setDisplayTypeTitle("flavor");
                setDisplayTypeTitleColor("#7000FF");
                break;
        }
    }, [displayTypeCode])

    // Updates selected tags - only gives tag title strings to upper layer
    const updateSelectedTags = (tag) => {

        // Finds type code by tag title
        function getTypeCode(title) {
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
        if (typeCode < 0) {
            setDisplayTypeCode(3);
        }
        else if (typeCode > 3) {
            setDisplayTypeCode(0);
        }
        else {
            setDisplayTypeCode(typeCode);
        }
    }

    // List of tags for user to select
    const tagList = tags.filter((tag) => tag.typeCode == displayTypeCode).map((tag) => {
        let selected = false;
        if (selectedTags.includes(tag.title)) {
            selected = true;
        }
        return (
            <RecipeTag key={tag.title} title={tag.title} selected={selected} handlePress={() => updateSelectedTags(tag)} />
        )
    });

    return (
        <View style={{ alignItems: 'center' }}>
            <ScrollView style={{ paddingTop: 8 }} horizontal={true} showsHorizontalScrollIndicator={false}>
                <View style={{ marginBottom: 0, flexWrap: 'wrap', flexDirection: 'row', flex: 3 }}>
                    {tagList}
                </View>
            </ScrollView>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <IconButton style={{ margin: 0 }} size={16} icon={() => <Image source={require('../../../assets/icons/back.png')} />} onPress={() => updateDisplayTypeCode(-1)} />
                <Text style={{ fontSize: 16, fontWeight: 700, color: displayTypeTitleColor, textAlign: 'center', minWidth: 80 }}>{displayTypeTitle}</Text>
                <IconButton style={{ margin: 0 }} size={16} icon={() => <Image source={require('../../../assets/icons/forward.png')} />} onPress={() => updateDisplayTypeCode(1)} />
            </View>
        </View>
    );
};
