import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Searchbar, Text, IconButton } from "react-native-paper";
import RecipeTag from "./RecipeTag";
import tags from '../../../tags.json';
import colors from '../../../colors.json';


// Expandable horizontal scroll view for viewing items
export default function TagSearch(props) {

	// State for tracking user search input
	const [searchQuery, setSearchQuery] = useState('');

    // State for tracking which tags are selected
    const [selectedTags, setSelectedTags] = useState([]);

    // Updates selected tags
    const updateSelectedTags = (title, typeCode) => {
        // Places state into new list
        let updatedTagList = [];
        let removedTag = false;
        for (let tag of selectedTags){
            // Ensure that tag does not exist in
            if(tag != title){
                updatedTagList.push(tag);
            }
            else{
                removedTag = true;
            }
        }

        // Appends parameter tag to list if no tags were removed
        if(!removedTag){
            updatedTagList.push(title);

            // This code doesn't do anything because it attempts to manipulate tag objects instead of strings 

            // Limits number of specific tags
            // let shallowList;
            // switch (typeCode){
            //     case 0: 
            //         // If there is more than one "mealType" tag, then remove first tag and return new tag
            //         shallowList = updatedTagList.filter((tag) => tag.filterTypeCode == 0);
            //         if(shallowList.length > 1){
            //             shallowList.push(updatedTagList.filter((tag) => tag.filterTypeCode != 0)).shift();
            //         }
            //         break;
            //     case 1:
            //         // If there is more than one "cuisineType" tag, then remove first tag and return new tag
            //         shallowList = updatedTagList.filter((tag) => tag.filterTypeCode == 1);
            //         if(shallowList.length > 1){
            //             shallowList.push(updatedTagList.filter((tag) => tag.filterTypeCode != 1)).shift();
            //         }
            //         break;
            //     case 2:
            //         // If there is more than two "diet" tags, then remove first tag and return new tags
            //         shallowList = updatedTagList.filter((tag) => tag.filterTypeCode == 2);
            //         if(shallowList.length > 2){
            //             shallowList.push(updatedTagList.filter((tag) => tag.filterTypeCode != 2)).shift();
            //         }
            //         break;
            //     case 3:
            //         // If there is more than two "flavor" tags, then remove first tag and return new tags
            //         shallowList = updatedTagList.filter((tag) => tag.filterTypeCode == 3);
            //         if(shallowList.length > 2){
            //             shallowList.push(updatedTagList.filter((tag) => tag.filterTypeCode != 3)).shift();
            //         }
            //         break;
            // }
            // updatedTagList = shallowList;
        }

        // Send results to parent component
        setSelectedTags(updatedTagList);
        console.log(updatedTagList);
        props.updateSelectedTags(updatedTagList);
    }

    // List of tags for user to select
    const tagList = tags.sort((a, b) => {
        if(a.popularity < b.popularity){
            return 1;
        }
        else if(a.popularity > b.popularity){
            return -1;
        }
        else{
            return 0;
        }
    }).map((tag) => {
        if(tag.filterTitle.toLowerCase().includes(searchQuery.toLowerCase())){
            return (
                <RecipeTag key={tag.filterTitle} title={tag.filterTitle} handlePress={() => updateSelectedTags(tag.filterTitle, tag.filterTypeCode)}/>
            )
        }
    });

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
                <IconButton 
                    icon="close"
					onPress={() => props.closeTagSearch()}
				/>
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
		width: '85%',
		marginVertical: 5,
        backgroundColor: colors['background2']
	},
});