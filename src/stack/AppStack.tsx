import React, { useEffect} from "react";
import { NavigationContainer } from '@react-navigation/native'
import AuthStack from "./AuthStack";
import NavigationStack from "./NavigationStack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { addToken, setProfileCompleted } from "../redux/userprofile/action";






const AppStack: React.FC = () => {
  const token = useSelector((state: any) => state.userProfile.token);
  const isProfile = useSelector((state:any) => state.userProfile.isProfileCompleted);
  const dispatch = useDispatch(); 

  const getToken = async() => {
    const token = await AsyncStorage.getItem('token');
    if(token){
      dispatch(addToken(token));
    }

    const profileExist = await AsyncStorage.getItem("profileExist");
    if(profileExist){
       dispatch(setProfileCompleted(true));
    }
    else{
      dispatch(setProfileCompleted(false));
    }
    
  }
  
  useEffect(() => {
    getToken();
  },[]);


  
  return (
    
    <NavigationContainer>
        {
          token && isProfile
            ?
            <NavigationStack/> 
            : 
            <AuthStack/>
        }
    </NavigationContainer>
  );
}

export default AppStack;
