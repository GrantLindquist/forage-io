import { useState, useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions, ScrollView } from "react-native";
import { Text, Button, Divider } from "react-native-paper";
import { useUser, useClerk } from "@clerk/clerk-expo";
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import document from "../../utilities/terms_of_service.html";
import RenderHtml from 'react-native-render-html';
import recipeService from '../../services/recipeService';

// Contains information about the user and various modifiable settings/configurations
export default function Profile(props) {

	// Utilities for rendering terms of service html
	const termsWidth = useWindowDimensions();
	source = {
		html: `<p>i am text that you cant see cus im black</p>`
	}
	const Stack = createStackNavigator();
	const navigation = useNavigation();

	// User object
	const { user } = useUser();
	// Clerk signOut object
	const { signOut } = useClerk();

	// Recipe stats
	const [totalCreatedRecipes, setTotalCreatedRecipes] = useState("-");
	const [totalRecipeStars, setTotalRecipeStars] = useState("-");
	useEffect(() => {
		const fetchStatistics = async() => {
			try {
				// [0] = total created recipes, [1] = total recipe stars
				const response = await recipeService.getProfileStatistics(user.id);
				setTotalCreatedRecipes(response[0]);
				setTotalRecipeStars(response[1]);
			}
			catch (e) {
				throw new Error("There was an error retrieving this information: " + e.message);
			} 
		}
		fetchStatistics();
	}, [props.refreshValue])

	return (

		<Stack.Navigator screenOptions={{
			header: () => <></>,
			gestureResponseDistance: 400
		}}>
			<Stack.Screen name="ProfileMain">
				{() =>
					<>
						<View style={{ paddingBottom: '20%' }}>
							<View style={styles.container}>
								{/* <Avatar.Image source={{ uri: user.imageUrl }} size={120} style={{ marginTop: 160, marginBottom: 10 }} /> */}
								<MaskedView maskElement={<MaterialCommunityIcons name="account-outline" size={100} />}>
									<LinearGradient
										colors={["#38FFA0", "#00C2FF"]}
										start={{ x: 0, y: 0 }}
										end={{ x: 1, y: 0 }}
										style={{ width: 100, height: 100 }}
									/>
								</MaskedView>
								<Text style={user.username.length > 12 ? styles.usernameSmall : styles.usernameLarge}>{user.username}</Text>
								<Text style={styles.subtext}>Created on {user.createdAt.toLocaleString().split(',')[0]}</Text>
								<View style={{ marginTop: 30, marginHorizontal: 20, flexDirection: 'row' }}>
									<View style={{ alignItems: 'center', width: '50%' }}>
										<Text style={styles.subtext}>Created Recipes</Text>
										<Text variant="headlineLarge">{totalCreatedRecipes}</Text>
									</View>
									<View style={{ alignItems: 'center', borderColor: "#38FFA0", borderLeftWidth: '2', width: '50%' }}>
										<Text style={styles.subtext}>Total Stars</Text>
										<Text variant="headlineLarge">{totalRecipeStars}</Text>
									</View>
								</View>
							</View>
						</View>

						<View style={{ position: 'absolute', bottom: 5, width: '100%' }}>
							<Button mode="text" onPress={() => navigation.navigate('TermsOfService')}>Terms of Service</Button>
							<Divider style={{ marginHorizontal: 20 }} />
							<Button mode="text" onPress={signOut}>Sign out</Button>
						</View>

					</>
				}
			</Stack.Screen>
			<Stack.Screen
				options={{
					presentation: 'modal',
					cardStyle: {
						backgroundColor: 'transparent'
					},
				}}
				name="TermsOfService">
				{() =>
					<View style={{ height: '100%', backgroundColor: '#111111' }}>
						<ScrollView>
							<RenderHtml
								contentWidth={termsWidth}
								source={source}
							/>
						</ScrollView>
					</View>
				}
			</Stack.Screen>
		</Stack.Navigator>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		justifyContent: 'center',
		height: '100%',
	},
	usernameSmall: {
		// fontFamily: 'Roboto',
		fontSize: 30,
		fontWeight: 700,
		marginBottom: 5
	},
	usernameLarge: {
		// fontFamily: 'Roboto',
		fontSize: 36,
		fontWeight: 700,
		marginBottom: 5
	},
	subtext: {
		color: 'grey',
		fontSize: 13
	}
});