import * as React from 'react';
import { Text, View, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HelpIcon from '../../component/HelpIcon';



interface HelpConfirmationScreenProps {
   navigation:any,
}

const HelpConfirmationScreen: React.FC<HelpConfirmationScreenProps> = ({navigation}) => {
  return (
    <SafeAreaView style={styles.main}>
     
        <View style={styles.helpIconView}>
          <HelpIcon />
          <Text style={styles.helpIconText}> Help is on the way</Text>
        </View>
    
      <TouchableOpacity 
        style={styles.confirmView} 
        onPress={() => navigation.navigate('TabNavigator')}> 
        <Text style={styles.confirmText}>Ok</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
   main: {
      flex:1,
      backgroundColor:'white',
      alignItems:'center',
      justifyContent:'center',
   },

   helpIconView:{
      height:285,
      backgroundColor:'white',
      padding:20,
      borderRadius:25,
      elevation:8,
      alignItems:'center',
      justifyContent:'center',
   },
   helpIconText:{
      marginTop:5,
      fontSize:20,
      color:'black',
      fontWeight:'500',
   },
   confirmView:{
      position:'absolute',
      bottom:0,
      height:60,
      backgroundColor:'#3ebb6e',
      width:'90%',
      alignItems:'center',
      justifyContent:'center',
      marginBottom:30,
      borderRadius:20,    
      elevation:8,    
   },
   confirmText:{
      fontSize:20,
      color:'white',
   }
});


export default HelpConfirmationScreen;

