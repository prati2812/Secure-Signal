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
import ComplaintListScreen from "../screen/complaints/ComplaintListScreen";
import ComplaintScreen from "../screen/complaints/ComplaintScreen";



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
          <Stack.Screen name="ComplaintList" component={ComplaintListScreen} options={{headerShown:false}} />
          <Stack.Screen name="Complaint"  component={ComplaintScreen} options={{headerShown:false}}/>
           
        </Stack.Navigator>
    
    );
}



  
export default NavigationStack;