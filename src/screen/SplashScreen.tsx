import React, { useEffect } from 'react';
import { Image, StatusBar, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import style from '../style/splash-screen/style';


interface SplashScreenProps {
  navigation:any
}

const SplashScreen: React.FC<SplashScreenProps> = ({navigation}) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('PhoneNumber');
    }, 4000);
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

export default SplashScreen;



