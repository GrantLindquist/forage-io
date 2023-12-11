import { View } from 'react-native';
import React, { useState } from 'react';
import { Text } from 'react-native-paper';
import Slider from '@react-native-community/slider';

// Component for budget selection slider
export default function BudgetSlider(props) {

	// Budget bounds
	const minimumBudget = 2;
	const maximumBudget = 15;
	const budgetStep = .25;

	// Budget value for slider display and setting budget
	const [budget, setBudget] = useState(minimumBudget - budgetStep);

	// Updates budget value to parent component
	const handleValueChange = (val) => {

		// Send new slider value to parent
		if (val <= minimumBudget - budgetStep) {
			props.handleValueChange(-1);
		}
		else {
			props.handleValueChange(val);
		}

		// Updates visual budget state
		setBudget(val);
	}

	return (
		<View>
			<Text variant='bodyLarge' style={{color: 'grey'}}>Budget: {budget != minimumBudget - budgetStep ? "$" + budget.toFixed(2) : "-"} </Text>
			<Slider
				onValueChange={val => handleValueChange(val)}
				minimumValue={minimumBudget - budgetStep}
				maximumValue={maximumBudget}
				minimumTrackTintColor={"rgb(0, 227, 138)"}
				step={budgetStep}
				value={budget}
			/>
		</View>
	);
}
;
