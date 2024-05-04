import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import NetInfo, { addEventListener } from "@react-native-community/netinfo";

interface CheckInternetConnectivityProps {}

const CheckInternetConnectivity = (props: CheckInternetConnectivityProps) => {
   
  React.useEffect(() => {
    const unsubscribe = addEventListener(state => {
        console.log("Connection type", state.type);
        console.log("Is connected?", state.isConnected);
        
      });
      
      // Unsubscribe
      return () => {
        unsubscribe();
      }
      
  },[]);  
  return (
    <View style={styles.container}>
      <Text>CheckInternetConnectivity</Text>
    </View>
  );
};

export default CheckInternetConnectivity;

const styles = StyleSheet.create({
  container: {}
});
