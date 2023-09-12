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
                <RecipeTag key={tag.filterTitle} title={tag.filterTitle} handlePress={updateSelectedTags}/>
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