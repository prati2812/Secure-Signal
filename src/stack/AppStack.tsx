import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import SplashScreen from "../screen/SplashScreen";
import HomeScreen from "../screen/HomeScreen";
import PhoneNumberScreen from "../screen/authentication/PhoneNumberScreen";
import OtpNumberScreen from "../screen/authentication/OtpNumberScreen";
import EditProfile from "../screen/Account/EditProfile";

const Stack = createNativeStackNavigator();

const AppStack: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PhoneNumber" component={PhoneNumberScreen} options={{ headerShown: false }} />
        <Stack.Screen name="OtpNumber" component={OtpNumberScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EditProfile" component={EditProfile} options={{headerShown: false}}/>
        <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppStack;
