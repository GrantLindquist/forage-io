import { useState } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { List } from "react-native-paper";

// Expandable horizontal scroll view for viewing items
export default function FilterSelection(props) {

    // State for tracking whether or not to display content
    const [expanded, setExpanded] = useState(false);
    
	return (
        <List.Accordion
            title={props.title}
            onPress={() => setExpanded(!expanded)}
            expanded={expanded}>
            <ScrollView style={{paddingVertical:8}} horizontal={true}>
				{props.children}
			</ScrollView>
        </List.Accordion>
	);
};

const styles = StyleSheet.create({

});