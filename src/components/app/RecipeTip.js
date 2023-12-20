import { View } from "react-native";
import { Card, IconButton, Text } from 'react-native-paper';

export default function RecipeTip({ children }) {

    // Formats text to fit nicely within Card component
    const formatText = (text) => {
        let words = text.split(' ');
        // Don't ask why this works. I don't know
        let newlineCount = words.length < 10 ? 1.8 : 2.4;
        let newline = Math.floor(words.length / newlineCount);
        
        for(let i = 0; i < words.length; i++){
            if(i % newline == 0 && i != 0){
                words.splice(i, 0, '\n')
            }
        }
        words[0] = ' ' + words[0];
        return words.join(' ');
    }

    return (
        <Card style={{marginRight: 15}}>
            <Card.Content style={{height: 100}}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <IconButton style={{margin: 0, padding: 0, marginRight: 3}} disabled={true} size={50} icon={"information-outline"} />
                    <Text variant="bodyMedium" style={{color: 'grey'}}>
                        {formatText(children)}
                    </Text>
                </View>
            </Card.Content>
        </Card>
    );
};
