import { useState, useEffect, useContext } from 'react';
import { View, StyleSheet } from "react-native";
import { Text, Button, Divider, Portal, Dialog, Snackbar, useTheme } from "react-native-paper";
import { useUser, useClerk } from "@clerk/clerk-expo";
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import recipeService from '../../services/recipeService';
import env from '../../../env.json'
import { SnackbarContext } from './SnackbarProvider';

// Contains information about the user and various modifiable settings/configurations
export default function Profile(props) {

	// Snackbar context
	const { setMessage, setError, setVisible } = useContext(SnackbarContext);

	// State for tracking whether or not account deletion dialog drawer is open
	const [warningDialogVisible, setWarningDialogVisible] = useState(false);

	const theme = useTheme();
	// User object
	const { user } = useUser();
	// Clerk signOut object
	const { signOut } = useClerk();

	// Recipe stats
	const [totalCreatedRecipes, setTotalCreatedRecipes] = useState("-");
	const [totalRecipeStars, setTotalRecipeStars] = useState("-");
	useEffect(() => {
		const fetchStatistics = async () => {
			try {
				// [0] = total created recipes, [1] = total recipe stars
				const response = await recipeService.getProfileStatistics(user.id);
				setTotalCreatedRecipes(response[0]);
				setTotalRecipeStars(response[1]);
			}
			catch (e) {
				setMessage("There was an error retrieving your profile information.");
				setError(true);
				setVisible(true);
				throw new Error("There was an error retrieving this information: " + e.message);
			}
		}
		fetchStatistics();
	}, [props.refreshValue])

	// Deletes user's account
	const handleDeleteAccount = async () => {

		setWarningDialogVisible(false);

		try {
			// Deletes user
			const response = await fetch(`https://api.clerk.com/v1/users/${user.id}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					'authorization': 'Bearer ' + env['clerk-secretKey'],
				}
			});

			// Signs user out of account
			signOut();

			// Returns recipe JSON
			let data = await response.json();
			console.log(data);
		}
		catch (e) {
			setMessage("There was an error deleting your account.");
			setError(true);
			setVisible(true);
			throw new Error("There was an error deleting your account: " + e.message);
		}
	}

	return (
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
				<Button mode="text" onPress={signOut}>Sign out</Button>
				<Divider style={{ marginHorizontal: 20 }} />
				<Button mode="text" textColor='red' onPress={() => setWarningDialogVisible(true)}>Delete account</Button>
			</View>

			{/* Account deletion warning dialog */}
			<Portal>
				<Dialog visible={warningDialogVisible} onDismiss={() => setWarningDialogVisible(false)}>
					<Dialog.Title style={{ color: theme.colors.primary, fontWeight: 700, marginBottom: 12 }}>Woah!</Dialog.Title>
					<Dialog.Content>
						<Text variant="bodyMedium">Are you sure you want to delete your account?</Text>
						<Text variant="bodyMedium">This action is irreversible.</Text>
					</Dialog.Content>
					<Dialog.Actions>
						<Button onPress={() => setWarningDialogVisible(false)}>No way!</Button>
						<Button textColor='red' onPress={handleDeleteAccount}>Yes, delete my account.</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>
		</>
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