import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screen/HomeScreen";
import UserDestination from "../screen/UserDestination";
import AccountProfile from "../screen/account/AccountProfile";
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
      <Tab.Navigator
          initialRouteName="Home">
             <Tab.Group
                 screenOptions={{
                    headerShown:false , 
                    tabBarShowLabel:false , 
                    tabBarHideOnKeyboard:true,
                    tabBarStyle:styles.container}}>
                <Tab.Screen name="Home" component={HomeScreen} options={{
                     tabBarIcon:({focused, color , size}) => (
                        <Icon name="home" 
                              size={35}
                              color={focused ? '#3ebb6e' : 'lightgray'}/>
                     ),
                }}></Tab.Screen>
                <Tab.Screen name="UserDestination" component={UserDestination} options={{
                     tabBarIcon:({focused, color , size}) => (
                        <Icon name="add-location" 
                              size={35}
                              color={focused ? '#3ebb6e' : 'lightgray'}/>
                     ),
                }}/>
                <Tab.Screen name="Profile" component={AccountProfile} options={{
                     tabBarIcon:({focused, color , size}) => (
                        <Icon name="account-circle" 
                              size={35}
                              color={focused ? '#3ebb6e' : 'lightgray'}/>
                     ),
                }}/>
             </Tab.Group>
      </Tab.Navigator>
  );
};


const styles = StyleSheet.create({
    container: {
        height:60,
    }
});

export default TabNavigator;



