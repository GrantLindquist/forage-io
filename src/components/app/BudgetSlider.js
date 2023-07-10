import { StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import { Text } from 'react-native-paper';
import Slider from '@react-native-community/slider';

// Component for budget selection slider
export default function BudgetSlider (props) {

	// Budget value for slider display and setting budget
	const [budget, setBudget] = useState(7.50);
	
	// Updates budget value to parent component
	const handleValueChange = (val) => {
		
		// Send new slider value to parent
		props.handleValueChange(val);

		// Updates visual budget state
		setBudget(val);
	}

    return (
		<View>
			<Text style={{alignSelf:'center'}} variant='headlineSmall'>${budget.toFixed(2)}</Text>
			<Slider
				onValueChange={val => handleValueChange(val)}
				minimumValue={1}
				maximumValue={15}
				step={.25}
				value={budget}
				disabled={!props.active}
			/>
		</View>
    );
  }
;
