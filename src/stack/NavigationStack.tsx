import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import TabNavigator from "../navigator/TabNavigator";
import HelpScreen from "../screen/helpScreen/HelpScreen";
import HelpDescriptionScreen from "../screen/helpScreen/HelpDescriptionScreen";
import HelpConfirmationScreen from "../screen/helpScreen/HelpConfirmationScreen";
import LocationRouteScreen from "../screen/location/LocationRouteScreen";
import NotificationHistory from "../screen/notification/NotificationHistory";
import LocationHistory from "../screen/location/LocationHistory";
import EmergencyContactListScreen from "../screen/emergencyContactList/EmergencyContactListScreen";
import SubscriptionScreen from "../screen/subscription/SubscriptionScreen";
import PhoneNumberScreen from "../screen/authentication/PhoneNumberScreen";
import { useSelector } from "react-redux";
import LiveLocationRouteScreen from "../screen/location/LiveLocationRouteScreen";
import SplashScreen from "../screen/SplashScreen";



const Stack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();
const NotificationStack = createNativeStackNavigator();
const HelpScreenStack = createNativeStackNavigator();
const HelpDescriptionStack = createNativeStackNavigator();
const LocationStack = createNativeStackNavigator();
const AccountStack = createNativeStackNavigator();
const SubscriptionStack = createNativeStackNavigator();

const NavigationStack: React.FC = () => {
  
    return (
      
        <Stack.Navigator>
          <Stack.Screen name="TabNavigator" component={TabNavigator} options={{headerShown: false}}/>
          <Stack.Screen name="HelpScreen" component={HelpScreen} options={{headerShown: false}} />
          <Stack.Screen name="HelpDescription" component={HelpDescriptionScreen} options={{headerShown:false}}/>
          <Stack.Screen name="HelpConfirmation" component={HelpConfirmationScreen} options={{headerShown:false}}/>
          <Stack.Screen name="LocationRouting" component={LocationRouteScreen} options={{headerShown:false}} />
          <Stack.Screen name="Notification" component={NotificationHistory} options={{headerShown:false}} />
          <Stack.Screen name="Location" component={LocationHistory} options={{headerShown:false}} />
          <Stack.Screen name="EmergencyContactList" component={EmergencyContactListScreen} options={{headerShown:false}}/>
          <Stack.Screen name="Subscription" component={SubscriptionScreen} options={{headerShown:false}} />
          <Stack.Screen name="LiveLocationRoute" component={LiveLocationRouteScreen} options={{headerShown:false}} />
          
        </Stack.Navigator>
    
    );
}

const HomeStackNavigator = () => {
    return(
         <HomeStack.Navigator>
             <HomeStack.Screen name="Notification" component={NotificationHistory} options={{headerShown:false}} />
             <HomeStack.Screen name="EmergencyContactList" component={EmergencyContactListScreen} options={{headerShown:false}} />
             <HomeStack.Screen name="HelpScreen" component={HelpScreen} options={{headerShown:false}} />
         </HomeStack.Navigator>
    )
}

const NotificationStackNavigator = () => {
    return(
        <NotificationStack.Navigator>
               <NotificationStack.Screen name="LiveLocationRoute" component={LiveLocationRouteScreen} options={{headerShown:false}} /> 
        </NotificationStack.Navigator>
    ) 
}

const HelpScreenStackNavigator = () => {
  return(
     <HelpScreenStack.Navigator>
              <HelpScreenStack.Screen  name="LocationRouting" component={LocationRouteScreen} options={{headerShown:false}} />
              <HelpScreenStack.Screen name="HelpDescription" component={HelpDescriptionScreen} options={{headerShown:false}}/>
              <HelpScreenStack.Screen name="TabNavigator" component={TabNavigator} options={{headerShown: false}}/>
     </HelpScreenStack.Navigator>
  )
}

const HelpDescriptionStackNavigator = () => {
  return(
      <HelpDescriptionStack.Navigator>
              <HelpDescriptionStack.Screen name="HelpConfirmation" component={HelpConfirmationScreen} options={{headerShown:false}}/>
              <HelpDescriptionStack.Screen name="TabNavigator" component={TabNavigator} options={{headerShown: false}}/>
      </HelpDescriptionStack.Navigator>
  )
}

const LocationStackNavigator = () => {
   return(
      <LocationStack.Navigator>
              <LocationStack.Screen name="Location" component={LocationHistory} options={{headerShown:false}} />
      </LocationStack.Navigator>
   )
}

const AccountStackNavigator = () => {
  return(
      <AccountStack.Navigator>
             <AccountStack.Screen name="Subscription" component={SubscriptionScreen} options={{headerShown:false}} />
      </AccountStack.Navigator>
  )
}

  
export default NavigationStack;