import { View, StyleSheet, Image } from "react-native";
import { Text } from "react-native-paper";

// Simple component to display when a FlatList is empty
export default function EmptyList() {

    return (
        <View style={styles.container}>
            <Image
                source={require("../../../assets/empty-list.png")}    
                style={{width: 400, height: 225}}
            />
            <Text style={{ color: 'grey', marginBottom: 48 }}>There are no recipes here... yet.</Text>
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