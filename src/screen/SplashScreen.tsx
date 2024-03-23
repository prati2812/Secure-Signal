import React, { useEffect, useState } from 'react';
import { Image, StatusBar, Text, View , StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface SplashScreenProps {
  navigation:any
}

const SplashScreen: React.FC<SplashScreenProps> = ({navigation}) => {
  const [verified , setVerified] = useState(true);
  useEffect(() => {
    if(verified){
      setTimeout(() => {
        navigation.replace('TabNavigator');
      }, 4000);
    }
    else{
      setTimeout(() => {
        navigation.replace('PhoneNumber');
      }, 4000);
    }
    
  }, []);

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



