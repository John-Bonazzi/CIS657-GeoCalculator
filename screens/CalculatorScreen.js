import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableWithoutFeedback, SafeAreaView, Keyboard, FlatList, Image } from 'react-native'
import { ThemeProvider, Button, Input } from 'react-native-elements'
import { computeBearing, computeDistance, round } from '../helpers/helper'
import { Feather } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { storeEntry, initCalculatorDB } from '../helpers/fb-calculator';
import { getWeather } from '../api/OWServer.js';

import { setupCalculatorListener } from '../helpers/fb-calculator';

const ICONS = {
  img01d: require('../assets/img01d.png'),
  img01n: require('../assets/img01n.png'),
  img02d: require('../assets/img02d.png'),
  img02n: require('../assets/img02n.png'),
  img03d: require('../assets/img03d.png'),
  img03n: require('../assets/img03n.png'),
  img04d: require('../assets/img04d.png'),
  img04n: require('../assets/img04n.png'),
  img09d: require('../assets/img09d.png'),
  img09n: require('../assets/img09n.png'),
  img10d: require('../assets/img10d.png'),
  img10n: require('../assets/img10n.png'),
  img13d: require('../assets/img13d.png'),
  img13n: require('../assets/img13n.png'),
  img50d: require('../assets/img13d.png'),
  img50n: require('../assets/img13n.png'),
 };
 
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

const renderWeather = ( { index, item }) => {
  if (!item.icon || item.icon === "") {
    return <View></View>;
  } else {
    return (
      <View style={styles.weatherView}>
        <Image
          style={{ width: 100, height: 100 }}
          source={ICONS['img' + item.icon]}
        />
        <View style={{flex: 1, justifyContent:'flex-end', marginRight: 10, marginBottom: 5}}>
          <Text style={{ fontSize: 56, fontWeight: 'bold', textAlign: 'right' }}>
            {`${round(item.temperature,0)}°F`}
          </Text>
          <Text style={{textAlign: 'right'}}> {item.description} </Text>
        </View>
      </View>
    );
  }
};

const comparator = (item1, item2) => {
  return Date(item1.timestamp) > Date(item2.timestamp); 
};

const CalculatorScreen = ({ route, navigation }) => {
  
  const [history, setHistory] = useState([]);
  const [state, setState] = useState({ lat1: '', lat2: '', lon1: '', lon2: '', distance: '', bearing: '', distanceText: '', bearingText: '', distanceUnits: 'Kilometers', bearingUnits: 'Degrees' });
  const updateStateObject = (vals) => {
    setState({
      ...state,
      ...vals,
    });
  };

  const [distanceMultipliers, setDMult] = useState({ multiplier: 1.0, toMetricMultiplier: 0.621371, toImperialMultiplier: 1.60934, });
  const updateDMultObject = (vals) => {
    setDMult({
      ...distanceMultipliers,
      ...vals,
    });
  };
  const [bearingMultipliers, setBMult] = useState({ multiplier: 1.0, toDegreeMultiplier: 0.056249999999999, toMilMultiplier: 17.777777777778, });
  const updateBMultObject = (vals) => {
    setBMult({
      ...bearingMultipliers,
      ...vals,
    });
  };

  const [sourceWeather, setSourceWeather] = useState({id: '0'});
  const [destWeather, setDestWeather] = useState({id: '1'});

  useEffect(() => {
    try {
      initCalculatorDB();
    } catch (err) {
      console.log(err);
    }
    setupCalculatorListener((history) => {
      setHistory(history.sort(comparator))});
  }, []);

  useEffect(() => {
    let dist = state.distance;
    let distUnits = state.distanceUnits;
    let bear = state.bearing;
    let bearUnits = state.bearingUnits;
    if (route.params?.distanceUnits) {
      if (!(distUnits === route.params.distanceUnits)) {
        let mult = 1.0;
        distUnits = route.params.distanceUnits;
        if (distUnits === 'Kilometers') {
          dist *= distanceMultipliers.toMetricMultiplier;
        }
        else if (distUnits === 'Miles') {
          dist *= distanceMultipliers.toImperialMultiplier;
          mult = distanceMultipliers.toImperialMultiplier;
        }
        dist = round(dist, 3);

        updateDMultObject({
          multiplier: mult,
        });
      }
    }
    if (route.params?.bearingUnits) {
      if (!(bearUnits === route.params.bearingUnits)) {
        let mult = 1.0;
        bearUnits = route.params.bearingUnits;
        if (bearUnits === 'Degrees') {
          bear *= bearingMultipliers.toDegreeMultiplier;
        }
        else if (bearUnits === 'Mils') {
          bear *= bearingMultipliers.toMilMultiplier;
          mult = bearingMultipliers.toMilMultiplier;
        }
        bear = round(bear, 3);
        updateBMultObject({
          multiplier: mult,
        });
      }
    }
    if (!(dist === undefined || dist == 0) && !(bear === undefined || bear == 0)) {
      updateStateObject({
        distance: dist,
        distanceUnits: distUnits,
        distanceText: `${dist} ${distUnits}`,
        bearing: bear,
        bearingUnits: bearUnits,
        bearingText: `${bear} ${bearUnits}`,
      });
    }
    else {
      updateStateObject({
        distance: dist,
        distanceUnits: distUnits,
        bearing: bear,
        bearingUnits: bearUnits,
      });
    }

  }, [route.params?.distanceUnits, route.params?.bearingUnits]);

  useEffect(() => {
    if(route.params?.item){
      let item = route.params.item;
      updateStateObject({ 
        lat1: item.lat1, 
        lat2: item.lat2, 
        lon1: item.lon1, 
        lon2: item.lon2, 
        distance: '', bearing: '', bearingText: '', distanceText: '' });
    }
  }, [route.params?.item])

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
      let dist = computeDistance(state.lat1, state.lon1, state.lat2, state.lon2) * distanceMultipliers.multiplier;
      dist = round(dist, 3);
      let bear = computeBearing(state.lat1, state.lon1, state.lat2, state.lon2) * bearingMultipliers.multiplier;
      bear = round(bear, 3);
      updateStateObject({
        distance: dist,
        bearing: bear,
        distanceText: `${dist} ${state.distanceUnits}`,
        bearingText: `${bear} ${state.bearingUnits}`,
      });
      const historyItem = { lat1: state.lat1, lon1: state.lon1, lat2: state.lat2, lon2: state.lon2 };
      storeEntry(historyItem);
      getWeather(state.lat1, state.lon1, setSourceWeather);
      getWeather(state.lat2, state.lon2, setDestWeather);
    }
  };

  navigation.setOptions({
    headerRight: () => (
      <TouchableOpacity
        onPress={() => {
          let distanceUnits = state.distanceUnits;
          let bearingUnits = state.bearingUnits;
          navigation.navigate('CalculatorSettings', {
            distanceUnits,
            bearingUnits
          });
        }
        }
      >
        <Feather name="settings" style={{ marginRight: 10 }} size={24} color="black" />
      </TouchableOpacity>
    ),
    headerLeft: () => (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('CalculatorHistory', {currentHistory: history});
        }
        }
      >
        <Text style={{marginLeft: 10}} size={24} color="black"> History </Text>
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
            onPress={() => {updateStateObject({ lat1: '', lat2: '', lon1: '', lon2: '', distance: '', bearing: '', bearingText: '', distanceText: '' });
              setSourceWeather({id: '0', icon:''}); setDestWeather({id: '1', icon:''})}}
          />
        </ThemeProvider>
        <View style={styles.gridRow}>
          <View style={[styles.gridBlock, { marginTop: 10 }]}><View style={styles.block}><Text> Distance: </Text></View></View>
          <View style={[styles.gridBlock, { marginTop: 10 }]}><View style={styles.block}><Text>{state.distanceText}</Text></View></View>
        </View>
        <View style={styles.gridRow}>
          <View style={styles.gridBlock}><View style={styles.block}><Text> Bearing: </Text></View></View>
          <View style={styles.gridBlock}><View style={styles.block}><Text>{state.bearingText}</Text></View></View>
        </View>
        <FlatList
          keyExtractor={(item) => item.id }
          data={[sourceWeather, destWeather]}
          renderItem={renderWeather}
          />
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
  weatherView: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 20,
    marginHorizontal: 10, 
    backgroundColor: '#85857E',
  },
});

export default CalculatorScreen