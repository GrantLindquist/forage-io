import { View } from 'react-native';
import React, { useState } from 'react';
import { Text } from 'react-native-paper';
import Slider from '@react-native-community/slider';

// Component for budget selection slider
export default function TimeSlider (props) {

	// Budget value for slider display and setting budget
	const [timeMinutes, setTimeMinutes] = useState(10);
    const [timeString, setTimeString] = useState('-');
	
	// Updates time value to parent component
	const handleValueChange = (val) => {
		
		// Send new slider value to parent
        if(val == 10){
			props.handleValueChange(-1);
		}
		else{
			props.handleValueChange(val);
		}

		// Updates timeMinutes
		setTimeMinutes(val);

        // Updates local timeString
        let hours = Math.floor(timeMinutes / 60);
        let minutes = timeMinutes % 60;
        if(minutes == 0){
            setTimeString(`${hours}h`);
        }
        else if (hours == 0){
            setTimeString(`${minutes}m`);
        }
        else{
            setTimeString(`${hours}h ${minutes}m`);
        } 
	}

    return (
		<View>
			<Text variant='bodyLarge'>Time: {timeMinutes != 10 ? timeString : "-"} </Text>
			<Slider
				onValueChange={val => handleValueChange(val)}
				minimumValue={10}
				maximumValue={240}
				step={5}
				value={timeMinutes}
			/>
		</View>
    );
  }
;
