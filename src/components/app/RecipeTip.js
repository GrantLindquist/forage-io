import { View } from "react-native";
import { Card, IconButton, Text } from 'react-native-paper';

export default function RecipeTip({ children }) {
    // Formats text to fit nicely within Card component
    const formatText = (text) => {

        const width = Math.floor(text.length / 3);
        const words = text.split(' ');

        let lines = [];
        let currentLine = '';

        for (let word of words) {
            if ((currentLine + word).length > width) {
                lines.push(currentLine.trim());
                currentLine = word + ' ';
            } else {
                currentLine += word + ' ';
            }
        }

        if (currentLine.trim() !== '') {
            if (lines.length < 3) {
                lines.push(currentLine.trim());
            } else {
                lines[lines.length - 1] += ' ' + currentLine.trim();
            }
        }

        return lines.join('\n');
    }

    return (
        <Card style={{ marginRight: 15 }}>
            <Card.Content style={{ height: 100 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <IconButton style={{ margin: 0, padding: 0, marginRight: 3 }} disabled={true} size={50} icon={"information-outline"} />
                    <Text variant="bodyMedium" style={{ color: 'grey' }}>
                        {formatText(children)}
                    </Text>
                </View>
            </Card.Content>
        </Card>
    );
};
