import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Dropdown } from 'react-native-material-dropdown';

const CalculatorSettings = ({ route, navigation }) => {
    console.log(route.params);
    const defaultDistanceUnits = route.params.distanceUnits;
    const defaultBearingUnits = route.params.bearingUnits;
    const [state, setState] = useState({ distanceUnits: defaultDistanceUnits, bearingUnits: defaultBearingUnits });
    const updateStateObject = (vals) => {
        setState({
            ...state,
            ...vals,
        });
    };

    const distanceData = [{
        value: 'Kilometers',
    }, {
        value: 'Miles',
    }];
    let selectedDistanceValue = distanceData[0].value
    if (!(defaultDistanceUnits===selectedDistanceValue)){
        selectedDistanceValue = distanceData[1].value;
    }
    const bearingData = [{
        value: 'Degrees',
    }, {
        value: 'Mils',
    }];
    let selectedBearingValue = bearingData[0].value;
    if (!(defaultBearingUnits===selectedBearingValue)){
        selectedBearingValue = bearingData[1].value;
    }

    navigation.setOptions({
        headerTitleStyle: {
            textAlign: 'center',
        },
        headerRight: () => (
            <TouchableOpacity style={{marginRight: 5}} onPress={() => navigation.navigate('CalculatorScreen')}>
                <Text> Cancel </Text>
            </TouchableOpacity>
        ),
        headerLeft: () => (
            <TouchableOpacity style={{marginLeft: 5}} onPress={() =>{
                let distanceUnits = state.distanceUnits
                let bearingUnits = state.bearingUnits
                navigation.navigate('CalculatorScreen', {
                    distanceUnits,
                    bearingUnits,
                })
            }}
            >
                <Text> Save </Text>
            </TouchableOpacity>
        ),
    });

    return (
        <View style={styles.container}>
            <Dropdown
                label="Distance Units"
                value={selectedDistanceValue}
                data={distanceData}
                selectedItemColor='black'
                itemColor='grey'
                baseColor='#fff'
                textColor='#D1D1C7'
                onChangeText={(val) => updateStateObject({distanceUnits: val})}
            />
            <Dropdown
                label="Bearing Units"
                value={selectedBearingValue}
                data={bearingData}
                selectedItemColor='black'
                itemColor='grey'
                baseColor='#fff'
                textColor='#D1D1C7'
                onChangeText={(val) => updateStateObject({bearingUnits: val})}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        marginLeft: 30,
        marginRight: 30,
    },
});

export default CalculatorSettings;