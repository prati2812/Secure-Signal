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


const App = () => {
  useEffect(() => {
     notificationListener();
  },[]);

  const pKey = 'pk_test_51P7brgSDcdgSk3wP7hEakFuVVciPeOtf1Hsqs3i5HbL3jgSGxF8wTUYI2XVSJaRObtC1EbKtps9HDQLze6c9TQlJ00199XWpX4';

  return(
    <StripeProvider 
      publishableKey={pKey}  
      merchantIdentifier="merchant.identifier">      
      <AppStack />
    </StripeProvider>  
      
  )
}


export default App;
