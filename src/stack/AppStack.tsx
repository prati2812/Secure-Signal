import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import AuthStack from "./AuthStack";
import NavigationStack from "./NavigationStack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { addToken } from "../redux/userprofile/action";





const AppStack: React.FC = () => {
  const token = useSelector((state: any) => state.userProfile.token);
  const dispatch = useDispatch(); 

  const getToken = async() => {
    const token = await AsyncStorage.getItem('token');
    if(token){
      dispatch(addToken(token));
    }
    
  }
  
  useEffect(() => {
    getToken();
  },[]);


  
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
