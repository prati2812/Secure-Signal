import React, {useEffect} from 'react';
import {Image, StatusBar, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import style from '../style/splash-screen/style';

const SplashScreen = ({navigation}) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('PhoneNumber');
    }, 3000);
  }, []);

  return (
    <View style={style.splashMain}>

      <LinearGradient
        colors={['#3ed943', '#cbe4cb']}
        style={style.splashLinearGradient}>
            <View style={style.viewImage}>
                  <Image 
                        style={style.splashImage} 
                        source={require('../assets/image/secure.png')}/>
                  <Text style={style.splashText}>
                       🅂 🄸 🄶 🄽 🄰 🄻 
                  </Text>      
            </View>
      </LinearGradient>

      <StatusBar hidden={true} />
    </View>
  );
};

export default SplashScreen;
