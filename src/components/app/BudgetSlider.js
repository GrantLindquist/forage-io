import { View } from 'react-native';
import React, { useState } from 'react';
import { Text } from 'react-native-paper';
import Slider from '@react-native-community/slider';

// Component for budget selection slider
export default function BudgetSlider (props) {

	// Budget value for slider display and setting budget
	const [budget, setBudget] = useState(.75);
	
	// Updates budget value to parent component
	const handleValueChange = (val) => {
		
		// Send new slider value to parent
		if(val == .75){
			props.handleValueChange(-1);
		}
		else{
			props.handleValueChange(val);
		}

		// Updates visual budget state
		setBudget(val);
	}

    return (
		<View>
			<Text variant='bodyLarge'>Budget: {budget != .75 ? "$" + budget.toFixed(2) : "-"} </Text>
			<Slider
				onValueChange={val => handleValueChange(val)}
				minimumValue={.75}
				maximumValue={15}
				step={.25}
				value={budget}
			/>
		</View>
    );
  }
;
