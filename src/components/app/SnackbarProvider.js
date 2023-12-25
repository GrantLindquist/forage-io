import { Snackbar } from "react-native-paper";
import { Image, Text, View } from "react-native";
import { createContext, useState } from 'react';

export const SnackbarContext = createContext({});

function NotificationSnackbar() {
    return (
        <SnackbarContext.Consumer>
            {({ message, error, visible, hideSnackbar }) => (
                <Snackbar
                    icon={"close"}
                    visible={visible}
                    onDismiss={hideSnackbar}
                    action={{
                        label: 'OK',
                        labelStyle: { color: error ? "red" : "green" },
                        onPress: () => hideSnackbar,
                    }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image
                            source={error ? require('../../../assets/icons/error.png') : require('../../../assets/icons/success.png')}
                            style={{ width: 30, height: 30, marginRight: 5 }}
                        />
                        <Text>{message}</Text>
                    </View>
                </Snackbar>
            )}
        </SnackbarContext.Consumer>
    );
}

export default function SnackbarProvider({ children }) {
    const [message, setMessage] = useState("");
    const [error, setError] = useState(false);
    const [visible, setVisible] = useState(false);

    const hideSnackbar = () => setVisible(false);

    const value = {
        message,
        error,
        visible,
        setMessage,
        setError,
        setVisible,
        hideSnackbar
    };

    return (
        <SnackbarContext.Provider value={value}>
            {children}
            <NotificationSnackbar />
        </SnackbarContext.Provider>
    )
}