import React, { useState } from 'react'
import { StyleSheet, Text, View, TouchableWithoutFeedback, SafeAreaView, Keyboard } from 'react-native'
import { ThemeProvider, Button, Input } from 'react-native-elements'
import { computeBearing, computeDistance } from '../helper'
import { Feather } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';

const theme = {
    Input: {
        errorStyle: {
            color: 'red',
        },
        keyboardType: 'default',
        renderErrorMessage: false,
        placeholderTextColor: '#85857E',
        inputStyle: {
            color: '#D1D1C7',
        },
    },
    Button: {
        buttonStyle: {
            backgroundColor: '#85857E',
        },
        containerStyle: {
            marginTop: 15,
        },
    },
};

const CalculatorScreen = ({ route, navigation }) => {
    const [state, setState] = useState({ lat1: '', lat2: '', lon1: '', lon2: '', distance: '', bearing: '', distanceSuffix: 'Kilometers', bearingSuffix: 'Degrees' });

    const updateStateObject = (vals) => {
        setState({
            ...state,
            ...vals,
        });
    };

    const isNum = (val, allowEmpty = true) => {
        if (allowEmpty)
            return /^[+-]?\d*\.?\d*$/.test(val); // This counts empty strings as NOT an error
        else
            return /^[+-]?\d+\.?\d*$/.test(val); // This counts empty strings as an error
    };

    const errorChecking = (val) => {
        if (isNum(val)) {
            return '';
        }
        else {
            return 'Must be a number';
        }
    };

    const compute = () => {
        if (isNum(state.lat1, false) && isNum(state.lat2, false) && isNum(state.lon1, false) && isNum(state.lon2, false)) {
            updateStateObject({
                bearing: `${computeBearing(state.lat1, state.lon1, state.lat2, state.lon2)} ${state.bearingSuffix}`,
                distance: `${computeDistance(state.lat1, state.lon1, state.lat2, state.lon2)} ${state.distanceSuffix}`
            });
        }
    };

    navigation.setOptions({
        headerRight: () => (
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate('CalculatorSettings', {...state.distanceSuffix, ...state.bearingSuffix});
                }}
            >
                <Feather name="settings" style={{ marginRight: 10 }} size={24} color="black" />{/*style and 'marginRight' used for curved screens, or the component looks weird*/}
            </TouchableOpacity>
        ),
    });

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.container} >
                <ThemeProvider theme={theme}>
                    <Input
                        placeholder="Enter latitude for point 1"
                        onChangeText={(val) => updateStateObject({ lat1: val })}
                        value={state.lat1}
                        errorMessage={errorChecking(state.lat1)} />
                    <Input
                        placeholder="Enter longitude for point 1"
                        onChangeText={(val) => updateStateObject({ lon1: val })}
                        value={state.lon1}
                        errorMessage={errorChecking(state.lon1)} />
                    <Input
                        placeholder="Enter latitude for point 2"
                        onChangeText={(val) => updateStateObject({ lat2: val })}
                        value={state.lat2}
                        errorMessage={errorChecking(state.lat2)} />
                    <Input
                        placeholder="Enter longitude for point 2"
                        onChangeText={(val) => updateStateObject({ lon2: val })}
                        value={state.lon2}
                        errorMessage={errorChecking(state.lon2)} />
                    <Button
                        title='Calculate'
                        onPress={() => compute()} />
                    <Button
                        title='Clear'
                        onPress={() => updateStateObject({ lat1: '', lat2: '', lon1: '', lon2: '', distance: '', bearing: '' })}
                    />
                </ThemeProvider>
                <View style={styles.gridRow}>
                    <View style={[styles.gridBlock, { marginTop: 10 }]}><View style={styles.block}><Text> Distance: </Text></View></View>
                    <View style={[styles.gridBlock, { marginTop: 10 }]}><View style={styles.block}><Text>{state.distance}</Text></View></View>
                </View>
                <View style={styles.gridRow}>
                    <View style={styles.gridBlock}><View style={styles.block}><Text> Bearing: </Text></View></View>
                    <View style={styles.gridBlock}><View style={styles.block}><Text>{state.bearing}</Text></View></View>
                </View>
                {/*<View style={styles.emptySpace}></View>*/}

            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 20,
        flex: 1,
    },
    gridRow: {
        flexDirection: 'row',
        //flex: 1,
    },
    gridBlock: {
        backgroundColor: '#D1D1C7',
        marginBottom: 1,
        marginRight: 1,
        flex: 1,
    },
    block: {
        margin: 10,
    },
    emptySpace: {
        flex: 6,
    },
});

export default CalculatorScreen