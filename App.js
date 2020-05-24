import React from 'react';
import { StyleSheet, SafeAreaView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import CalculatorScreen from './screens/CalculatorScreen';
 
export default function App() {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='CalculatorScreen' component={CalculatorScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
 /*return (
   <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
     <SafeAreaView style={styles.container} >
       <CalculatorScreen />
     </SafeAreaView>
   </TouchableWithoutFeedback>
 );*/
}
 
const styles = StyleSheet.create({
 container: {
   backgroundColor: "#fff",
   margin: 20,
   flex: 1
 },
});
