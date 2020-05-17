import React, { useState } from 'react'
import { StyleSheet, Text, View, TextInput } from 'react-native'
import { ThemeProvider, Button, Input } from 'react-native-elements'
import {computeBearing, computeDistance} from '../helper'

const inputTheme = {
    Input:{
        errorStyle: {
            color: 'red',
        },
        keyboardType: 'default',
        renderErrorMessage: false,
    },
    Button:{
        containerStyle:{
            marginTop: 15,
        },
    },
};



const CalculatorScreen = () =>{
    const [state, setState] = useState({lat1: '', lat2: '', lon1: '', lon2: '', distance: '', bearing: ''})

    const updateStateObject = (vals) => {
        setState({
            ...state,
            ...vals,
        });
    };

    const isNum = (val, allowEmpty=true) => {
        if(allowEmpty)
            return /^[+-]?\d*\.?\d*$/.test(val);
        else
            return /^[+-]?\d+\.?\d*$/.test(val);
    };

    const errorChecking = (val) => {
        if(isNum(val)){
            return '';
        }
        else{
            return 'Must be a number';
        }
    };

    const compute = () => {
        if(isNum(state.lat1, false) && isNum(state.lat2, false) && isNum(state.lon1, false) && isNum(state.lon2, false)){
            updateStateObject({bearing: `Bearing: ${computeBearing(state.lat1, state.lon1, state.lat2, state.lon2)}`, 
                distance: `Distance: ${computeDistance(state.lat1, state.lon1, state.lat2, state.lon2)}`});
        }
    };

    return(
        <View style={styles.container}>
            <ThemeProvider theme={inputTheme}>
                <Input
                    placeholder="Enter latitude for point 1"
                    onChangeText={(val) => updateStateObject({lat1: val})}
                    value={state.lat1}
                    errorMessage={errorChecking(state.lat1)}/>    
                <Input
                    placeholder="Enter longitude for point 1"
                    onChangeText={(val) => updateStateObject({lon1: val})}
                    value={state.lon1}
                    errorMessage={errorChecking(state.lon1)}/>
                <Input
                    placeholder="Enter latitude for point 2"
                    onChangeText={(val) => updateStateObject({lat2: val})}
                    value={state.lat2}
                    errorMessage={errorChecking(state.lat2)}/>
                <Input
                    placeholder="Enter longitude for point 2"
                    onChangeText={(val) => updateStateObject({lon2: val})}
                    value={state.lon2}
                    errorMessage={errorChecking(state.lon2)}/>
                <Button 
                    title='Calculate'
                    onPress={() => compute()}/>
                <Button 
                    title='Clear'
                    onPress={() => updateStateObject({lat1: '', lat2: '', lon1: '', lon2: '', distance: '', bearing: ''})}
                    />
            </ThemeProvider>
            <Text>{state.distance}</Text>
            <Text>{state.bearing}</Text>
        </View>
        );
}

const styles = StyleSheet.create({
    container: {
        margin: 20,
    },
});

export default CalculatorScreen