//import liraries
import React, { Component, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ComplaintListScreen from '../screen/complaints/ComplaintListScreen';
import AccountProfile from '../screen/account/AccountProfile';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import LocationHistory from '../screen/location/LocationHistory';
import CustomHeader from '../component/CustomHeader';
import { useNavigation } from '@react-navigation/native';

const Tab = createMaterialTopTabNavigator();


// create a component
const TopTabNavigator = () => {
   
    const navigation = useNavigation();
    const [currentScreen, setCurrentScreen] = useState('Complaints');

    const onTabFocus = (routeName: React.SetStateAction<string>) => {
        setCurrentScreen(routeName);
    };

    return (
         <><CustomHeader  name={currentScreen}
         backIcon={'keyboard-backspace'}
         backCall={() => navigation.goBack()} />
         
         <Tab.Navigator
            initialRouteName="Complaints"
            screenOptions={{
                tabBarActiveTintColor: Colors.white,
                tabBarLabelStyle: { textTransform: 'capitalize', fontSize: 18 },
                tabBarStyle: { backgroundColor: '#3ebb6e', height: 50 },
                tabBarIndicatorStyle: { backgroundColor: 'white' }
            }}>

            <Tab.Screen name='Complaints' component={ComplaintListScreen} listeners={{
                        focus: () => onTabFocus('Complaints'),
                    }}/>
            <Tab.Screen name='Location' component={LocationHistory} listeners={{
                        focus: () => onTabFocus('Location'),
                    }}/>
            <Tab.Screen name='Profile' component={AccountProfile} listeners={{
                        focus: () => onTabFocus('Profile'),
                    }}/>
        </Tab.Navigator></>        
    );
};


const styles = StyleSheet.create({
   
});


export default TopTabNavigator;
