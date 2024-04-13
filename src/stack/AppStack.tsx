import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import AuthStack from "./AuthStack";
import NavigationStack from "./NavigationStack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { addToken } from "../redux/userprofile/action";



const Stack = createNativeStackNavigator();

const AppStack: React.FC = () => {
  const [token, setToken] = useState('');
  const dispatch = useDispatch(); 

  const getToken = async() => {
    const token = await AsyncStorage.getItem('token');
    dispatch(addToken(token));
    setToken(token);
  }
  
  useEffect(() => {
    getToken();
  },[token]);


  
  return (
    <NavigationContainer>
        {
          token
            ?
            <NavigationStack/> 
            : 
            <AuthStack/>
        }
    </NavigationContainer>
  );
}

export default AppStack;
