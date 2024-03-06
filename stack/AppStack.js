import React from "react";
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {NavigationContainer} from '@react-navigation/native'
import SplashScreen from "../screen/SplashScreen";
import HomeScreen from "../screen/HomeScreen";
import PhoneNumberScreen from "../screen/authentication/PhoneNumberScreen";

const Stack = createNativeStackNavigator();

const AppStack = () => {
   return(
         <NavigationContainer>
               <Stack.Navigator>
                   <Stack.Screen name="Splash" component={SplashScreen} options={{headerShown:false}}/>
                   <Stack.Screen name="Home" component={HomeScreen} options={{headerShown:false}} />
                   <Stack.Screen name="PhoneNumber" component={PhoneNumberScreen} options={{headerShown:false}} />
               </Stack.Navigator>
         </NavigationContainer>
   );   
}


export default AppStack;