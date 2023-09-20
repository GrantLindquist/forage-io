import { View, StyleSheet } from "react-native";
import { Card } from 'react-native-paper';
import colors from "../../../colors.json";

// Card that contains basic info about recipe. Clicking will direct user to more detailed information about recipe
export default function RecipeCardPlaceholder() {

	return (
		<Card style={styles.card}>
			<Card.Content>
				<View style={{flexDirection: 'row'}}>
					<View style={{width: '90%', height: 60}}>
	
					</View>
				</View>
			</Card.Content>
	  	</Card>
	);
};

const styles = StyleSheet.create({
	card: {
		marginVertical: 5,
		height: 120,
		backgroundColor: colors['background1']
	},
});