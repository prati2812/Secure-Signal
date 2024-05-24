import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Image, StatusBar, Text, View , StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { setProfileCompleted } from '../redux/userprofile/action';

interface SplashScreenProps {
  navigation:any
}

const SplashScreen: React.FC<SplashScreenProps> = ({navigation}) => {
 
  const token = useSelector((state:any) => state.userProfile.token);
  const isProfile = useSelector((state:any) => state.userProfile.isProfileCompleted);  
  const dispatch = useDispatch(); 
 
 
  useEffect(() => {
    const navigateToScreen = async() => {
      const profileExist = await AsyncStorage.getItem("profileExist");
      if (token) {
        console.log("sdsd" , profileExist);
        console.log("csdfsd" , token);
          
        if(profileExist){
          dispatch(setProfileCompleted(true)); 
          navigation.navigate('TabNavigator'); 
        }
        else{
          dispatch(setProfileCompleted(false)); 
          navigation.navigate('EditProfile');
        }
      } 
      else { 
        navigation.navigate('PhoneNumber');
      }
    };

    const timer = setTimeout(navigateToScreen, 4000);
    return () => clearTimeout(timer);
      
  },[navigation]);


  
  return (
    <View style={style.splashMain}>
      <LinearGradient
        colors={['#3ebb6e', '#cbe4cb']}
        style={style.splashLinearGradient}>
        <View style={style.viewImage}>
          <Image
            style={style.splashImage}
            source={require('../assets/image/secure.png')}
          />
          <Text style={style.splashText}>🅂 🄸 🄶 🄽 🄰 🄻</Text>
        </View>
      </LinearGradient>
      <StatusBar hidden={true} />
    </View>
  );
};

const style = StyleSheet.create({
  splashMain:{
      flex:1
  },
  splashLinearGradient:{
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center'
  },
  viewImage:{
      flexDirection:'row',
      justifyContent:'center',
      alignItems:'center'     
  },
  splashImage:{
      width:80,
      height:80,
      tintColor:'white'
  },
  splashText:{
     color:'white',
     fontSize:30,
     fontWeight:'bold'
  }

})

export default SplashScreen;



