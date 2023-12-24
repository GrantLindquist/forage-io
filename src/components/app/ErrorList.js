import { View, StyleSheet, Image } from "react-native";
import { Text } from "react-native-paper";

// Simple component to display when a FlatList fails to load content
export default function ErrorList(props) {

    return (
        <View style={styles.container}>
            <Image
                source={require("../../../assets/empty-list.png")}    
                style={{width: 300, height: 160}}
            />
            <Text style={{ color: 'grey', marginBottom: "15%" }}>Something went terribly wrong! {props.errorMessage && props.errorMessage}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        minHeight: "100%",
    },
});