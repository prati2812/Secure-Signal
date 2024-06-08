//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ComplaintListScreen from '../screen/complaints/ComplaintListScreen';
import AccountProfile from '../screen/account/AccountProfile';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import LocationHistory from '../screen/location/LocationHistory';

const Tab = createMaterialTopTabNavigator();


// create a component
const TopTabNavigator = () => {
    return (
         <Tab.Navigator
            initialRouteName="Complaints"
            screenOptions={{
                tabBarActiveTintColor: Colors.white,
                tabBarLabelStyle:{textTransform:'capitalize' , fontSize:18},
                tabBarStyle:{backgroundColor:'#3ebb6e' ,   height: 60},
                tabBarIndicatorStyle:{backgroundColor:'white'}  
                
            }}>

            <Tab.Screen name='Complaints' component={ComplaintListScreen}/>
            <Tab.Screen name='Location' component={LocationHistory} />    
            <Tab.Screen name='Profile' component={AccountProfile} />   
         </Tab.Navigator>        
    );
};


const styles = StyleSheet.create({
   
});


export default TopTabNavigator;
