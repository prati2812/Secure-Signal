import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import {Text, View} from 'react-native'
import AppStack  from './src/stack/AppStack';
import { notificationListener } from './src/utils/NotificationService';
import { StripeProvider } from '@stripe/stripe-react-native';
import { STRIPE_PUBLISH_KEY } from '@env';
import SplashScreen from 'react-native-splash-screen';

const App = () => {
 
  useEffect(() => {
     setTimeout(() => {
        SplashScreen.hide();
     },500);
  },[]);

  useEffect(() => {
     notificationListener();
  },[]);

 

  return(    
    <StripeProvider publishableKey={STRIPE_PUBLISH_KEY}>
      <AppStack />
    </StripeProvider>  
      
  )
}


export default App;
