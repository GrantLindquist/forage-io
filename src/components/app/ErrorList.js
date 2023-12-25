import { View, StyleSheet, Image } from "react-native";
import { Text } from "react-native-paper";

// Simple component to display when a FlatList fails to load content
export default function ErrorList(props) {

    return (
        <View style={styles.container}>
            <Image
                source={require("../../../assets/empty-list.png")}
                style={{ width: 300, height: 160 }}
            />
            <View style={{ marginBottom: '15%' }}>
                <Text variant="bodyLarge" style={{ fontWeight: 500 }}>Something went terribly wrong!</Text>
                <Text style={{ color: 'grey', textAlign: 'center' }}>Error: {props.errorMessage ? props.errorMessage : "Unknown error--please try again later."}</Text>
            </View>
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