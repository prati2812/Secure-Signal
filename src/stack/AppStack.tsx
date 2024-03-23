import React, { useState } from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import AuthStack from "./AuthStack";
import NavigationStack from "./NavigationStack";


const Stack = createNativeStackNavigator();

const AppStack: React.FC = () => {
  const [verified , setVerified] = useState(true);
  return (
    <NavigationContainer>
        {
          verified 
            ?
            <NavigationStack/> 
            : 
            <AuthStack/>
        }
    </NavigationContainer>
  );
}

export default AppStack;
