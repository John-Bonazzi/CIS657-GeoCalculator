import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import CalculatorScreen from './screens/CalculatorScreen';
import CalculatorSettings from './screens/CalculatorSettings';
import CalculatorHistory from './screens/CalculatorHistory';

export default function App() {
  const Stack = createStackNavigator();
  return (
    <NavigationContainer>   
      <Stack.Navigator >
          <Stack.Screen options={headerBasics} name='CalculatorScreen' component={CalculatorScreen} />
          <Stack.Screen options={headerBasics} name='CalculatorSettings' component={CalculatorSettings} />
          <Stack.Screen options={{...headerBasics, title: 'History'}} name='CalculatorHistory' component={CalculatorHistory} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const headerBasics = {
  title: 'Geo Calculator',
  headerTitleStyle: {
    textAlign: 'center',
  },
  headerStyle: {
    backgroundColor: '#B8B8AE',
  },
  cardStyle: {
    backgroundColor: '#383835',
  },
};

const styles = StyleSheet.create({
 container: {
   backgroundColor: "#fff",
   margin: 20,
   flex: 1
 },
});
