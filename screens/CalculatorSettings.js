import React, { useState } from 'react'
import { StyleSheet, Text, View, TouchableWithoutFeedback, SafeAreaView, Keyboard } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Dropdown } from 'react-native-material-dropdown';

const CalculatorSettings = ({ route, navigation }) => {
    const [state, setState] = useState({ distanceUnits: {...route.params.distanceUnits}, bearingUnits: {...route.params.bearingUnits} });

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
    const bearingData = [{
        value: 'Degrees',
    }, {
        value: 'Mils',
    }];

    navigation.setOptions({
        headerTitleStyle: {
            textAlign: 'center',
        },
        headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('CalculatorScreen')}>
                <Text> Cancel </Text>
            </TouchableOpacity>
        ),
        headerLeft: () => (
            <TouchableOpacity onPress={() => {
                navigation.navigate('CalculatorScreen', {
                    ...state.distanceUnits,
                    ...state.bearingUnits
                });
            }}
            >
                <Text> Save </Text>
            </TouchableOpacity>
        ),
    });

    return (
        <View style={styles.container}>
            <Dropdown
                defualtValue="wow"
                label="Distance Units"
                data={distanceData}
                selectedItemColor='black'
                baseColor='#fff'
                textColor='#D1D1C7'
                onChangeText={(val) => updateStateObject({distanceUnits: val})}
            />
            <Dropdown
                label="Bearing Units"
                data={bearingData}
                selectedItemColor='black'
                baseColor='#fff'
                textColor='#D1D1C7'
                onChangeText={(val) => updateStateObject({bearingUnits: val})}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 30,
    },
});

export default CalculatorSettings;