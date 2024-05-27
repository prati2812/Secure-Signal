import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import PhoneNumberScreen from "../screen/authentication/PhoneNumberScreen";
import OtpNumberScreen from "../screen/authentication/OtpNumberScreen";
import EditProfile from "../screen/account/EditProfile";
import NavigationStack from "./NavigationStack";
import TabNavigator from "../navigator/TabNavigator";


const Stack = createNativeStackNavigator();



const AuthStack: React.FC = () => {
    return (
      
        <Stack.Navigator>
          <Stack.Screen name="PhoneNumber" component={PhoneNumberScreen} options={{ headerShown: false }} />
          <Stack.Screen name="OtpNumber" component={OtpNumberScreen} options={{ headerShown: false }} />
          <Stack.Screen name="EditProfile" component={EditProfile} options={{headerShown: false}}/>
          <Stack.Screen name="TabNavigator" component={TabNavigator} options={{headerShown: false}}/>
        
        </Stack.Navigator>
    
    );
}
  
export default AuthStack;
