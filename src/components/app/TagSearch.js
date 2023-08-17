import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Searchbar, Text, Button } from "react-native-paper";
import RecipeTag from "./RecipeTag";
import tags from '../../../tags.json'

// Expandable horizontal scroll view for viewing items
export default function TagSearch(props) {

	// State for tracking user search input
	const [searchQuery, setSearchQuery] = useState('');

    // State for tracking which tags are selected
    const [selectedTags, setSelectedTags] = useState([]);

    // Updates selected tags
    const updateSelectedTags = (val) => {
        // Places state into new list
        let updatedTagList = [];
        let removedTag = false;
        for (let tag of selectedTags){
            // Ensure that tag does not exist in
            if(tag != val){
                updatedTagList.push(tag);
            }
            else{
                removedTag = true;
            }
        }
        // Appends parameter tag to list if no tags were removed
        if(!removedTag){
            updatedTagList.push(val);
        }
        // Send results to parent component
        setSelectedTags(updatedTagList);
        props.updateSelectedTags(updatedTagList);
    }

    // List of tags for user to select
    const tagList = tags.map((tag) => {

        // Assign color to tag
        let color = "";
        switch(tag.filterTypeCode){
            case 0:
                color = "red";
                break;
            case 1:
                color = "blue";
                break;
            case 2:
                color = "green";
                break;
            case 3:
                color = "yellow";
                break;
        }

        if(tag.filterTitle.toLowerCase().includes(searchQuery.toLowerCase())){
            return (
                <RecipeTag key={tag.filterTitle} title={tag.filterTitle} color={color} handlePress={updateSelectedTags}/>
            )
        }
    })

	return (
        <View>
            <View style={{flexDirection:'row'}}>
                <Searchbar
                    style={styles.searchbarShort}
                    placeholder={"search tags"}
					placeholderTextColor={"grey"}
                    inputStyle={{paddingLeft: 0, alignSelf: 'center'}}
                    showDivider={false}
                    mode={'view'}
                    onChangeText={query => setSearchQuery(query)}
                    value={searchQuery}
                />
                <Button 
					style={{width: '25%'}}
					contentStyle={{paddingTop: 3}}
					onPress={() => props.closeTagSearch()}
				>Search</Button>
            </View>
            {searchQuery == "" ? <Text variant='bodySmall'>Popular Tags:</Text> : <></>}
            <ScrollView style={{paddingVertical:8}} horizontal={true}>
			    {tagList}
	        </ScrollView>
        </View>
	);
};

const styles = StyleSheet.create({
	searchbarShort: {
		height: 35,
		width: '75%',
		marginVertical: 5
	},
});