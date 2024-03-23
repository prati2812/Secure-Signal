import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SplashScreen from "../screen/SplashScreen";
import TabNavigator from "../navigator/TabNavigator";
import HelpScreen from "../screen/HelpScreen/HelpScreen";
import HomeScreen from "../screen/DashBoardScreen/HomeScreen";
import HelpDescriptionScreen from "../screen/HelpScreen/HelpDescriptionScreen";
import HelpConfirmationScreen from "../screen/HelpScreen/HelpConfirmationScreen";
import LocationRouteScreen from "../screen/locationRouteScreen/locationRouteScreen";
const Stack = createNativeStackNavigator();

const NavigationStack: React.FC = () => {
    return (
      
        <Stack.Navigator>
          <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
          <Stack.Screen name="TabNavigator" component={TabNavigator} options={{headerShown: false}}/>
          <Stack.Screen name="HelpScreen" component={HelpScreen} options={{headerShown:false}} />
          <Stack.Screen name="HelpDescription" component={HelpDescriptionScreen} options={{headerShown:false}}/>
          <Stack.Screen name="HelpConfirmation" component={HelpConfirmationScreen} options={{headerShown:false}}/>
          <Stack.Screen name="LocationRouting" component={LocationRouteScreen} options={{headerShown:false}} />
        </Stack.Navigator>
    
    );
  }
  
  export default NavigationStack;