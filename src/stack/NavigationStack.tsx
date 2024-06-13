import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HelpScreen from "../screen/helpScreen/HelpScreen";
import HelpDescriptionScreen from "../screen/helpScreen/HelpDescriptionScreen";
import HelpConfirmationScreen from "../screen/helpScreen/HelpConfirmationScreen";
import LocationRouteScreen from "../screen/location/LocationRouteScreen";
import NotificationHistory from "../screen/notification/NotificationHistory";
import LocationHistory from "../screen/location/LocationHistory";
import EmergencyContactListScreen from "../screen/emergencyContactList/ContactListScreen/EmergencyContactListScreen";
import SubscriptionScreen from "../screen/subscription/SubscriptionScreen/SubscriptionScreen";
import LiveLocationRouteScreen from "../screen/location/LiveLocationRouteScreen";
import ComplaintListScreen from "../screen/complaints/ComplaintListScreen";
import ComplaintScreen from "../screen/complaints/ComplaintScreen";
import TopTabNavigator from "../navigator/TopTabNavigator";
import HomeScreen from "../screen/dashBoardScreen/HomeScreen/HomeScreen";



const Stack = createNativeStackNavigator();


const NavigationStack: React.FC = () => {
  
    return (
      
        <Stack.Navigator>
          <Stack.Screen name="HomeScreen" component={HomeScreen} options={{headerShown:false}} />
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
          <Stack.Screen name="TopTabNavigator" component={TopTabNavigator} options={{headerShown:false}} />
           
        </Stack.Navigator>
    
    );
}



  
export default NavigationStack;