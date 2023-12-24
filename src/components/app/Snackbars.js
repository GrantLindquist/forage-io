import { useState } from "react";
import { Snackbar } from "react-native-paper";

const SuccessSnackbar = (props) => {

    const [visible, setVisible] = useState(props.visible);

    <Snackbar 
        style={{borderRightColor: 'green', borderRightWidth: 5}} 
        visible={visible}
        onDismiss={() => setVisible(false)}  
        action={{
            label: 'OK',
            onPress: () => {
                () => setVisible(false)
            },
        }}  
    >
        {props.message}
    </Snackbar>
}

const ErrorSnackbar = (props) => {
    
    const [visible, setVisible] = useState(props.visible);

    <Snackbar 
        style={{borderRightColor: 'red', borderRightWidth: 5}} 
        visible={visible}
        onDismiss={() => setVisible(false)} 
        action={{
            label: 'OK',
            onPress: () => {
                () => setVisible(false)
            },
        }}     
    >
        {props.message}
    </Snackbar>
}