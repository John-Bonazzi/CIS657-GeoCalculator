import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, separators } from 'react-native';
import { TouchableOpacity, TouchableHighlight } from 'react-native-gesture-handler';
import Toast from 'react-native-root-toast';
import { setupCalculatorListener } from '../helpers/fb-calculator';


const comparator = (item1, item2) => {
  return Date(item1.timestamp) > Date(item2.timestamp); 
};

const CalculatorHistory = ({ route, navigation }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setupCalculatorListener((history) => {
      setHistory(history.sort(comparator))})
  }, []);

  navigation.setOptions({
    headerLeft: () => (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('CalculatorScreen');
        }}
      >
        <Text style={styles.buttonStyle}> Geo Calculator </Text>
      </TouchableOpacity>
    ),
  });

  const renderHistory = ({ index, item }) => {
    let lat1 = item.lat1;
    let lat2 = item.lat2;
    let lon1 = item.lon1;
    let lon2 = item.lon2;
    let timestamp = item.timestamp;
    return (
      <View style={styles.itemViewStyle}>
        <TouchableHighlight activeOpacity={0.3} underlayColor='#383835' onPress={() => {navigation.navigate('CalculatorScreen', {item})}}>
          <View>
            <Text style={styles.textStyle}>Start: {lat1}, {lon1}</Text>
            <Text style={styles.textStyle}>End: {lat2}, {lon2}</Text>
            <Text style={{...styles.textStyle, ...styles.timeStyle}}>{timestamp}</Text>{/*FIXME insert styling here */}
            
          </View>
        </TouchableHighlight>
      </View>
    )
  };

  return (
    <FlatList
      ItemSeparatorComponent={() => {return(<View style={{...styles.itemViewStyle, ...styles.itemSeparatorStyle}}/>)}}
      keyExtractor={(item) => item.id}
      data={history}
      renderItem={renderHistory}/>
  );
};

const styles = StyleSheet.create({ 
  buttonStyle: { 
    margin: 10, 
  },
  textStyle: {
    textAlign: 'justify',
    fontSize: 20,
    color: '#D1D1C7',
  },
  timeStyle: {
    textAlign: 'right',
    fontStyle: 'italic',
    fontSize: 14,
  },
  itemViewStyle: {
    marginLeft: 10, 
    marginRight: 10,
  },
  itemSeparatorStyle: {
    borderBottomColor: '#B8B8AE', 
    borderBottomWidth: 2, 
    marginBottom: 5,
  },
 });

export default CalculatorHistory;