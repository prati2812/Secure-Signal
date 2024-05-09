/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import {Text, View} from 'react-native'
import AppStack  from './src/stack/AppStack';
import { notificationListener } from './src/utils/NotificationService';
import { StripeProvider } from '@stripe/stripe-react-native';
import { STRIPE_PUBLISH_KEY } from '@env';


const App = () => {
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
