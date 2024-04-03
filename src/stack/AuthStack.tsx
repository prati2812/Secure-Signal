import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SplashScreen from "../screen/SplashScreen";
import PhoneNumberScreen from "../screen/authentication/PhoneNumberScreen";
import OtpNumberScreen from "../screen/authentication/OtpNumberScreen";
import EditProfile from "../screen/account/EditProfile";
import TabNavigator from "../navigator/TabNavigator";
import HelpDescriptionScreen from "../screen/helpScreen/HelpDescriptionScreen";
import HelpConfirmationScreen from "../screen/helpScreen/HelpConfirmationScreen";
import LocationRouteScreen from "../screen/location/LocationRouteScreen";
import NotificationHistory from "../screen/notification/NotificationHistory";
import LocationHistory from "../screen/location/LocationHistory";
import EmergencyContactListScreen from "../screen/emergencyContactList/EmergencyContactListScreen";
import SubscriptionScreen from "../screen/subscription/SubscriptionScreen";
import HelpScreen from "../screen/helpScreen/HelpScreen";

const Stack = createNativeStackNavigator();

const AuthStack: React.FC = () => {
    return (
      
        <Stack.Navigator>
          <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
          <Stack.Screen name="PhoneNumber" component={PhoneNumberScreen} options={{ headerShown: false }} />
          <Stack.Screen name="OtpNumber" component={OtpNumberScreen} options={{ headerShown: false }} />
          <Stack.Screen name="EditProfile" component={EditProfile} options={{headerShown: false}}/>
          <Stack.Screen name="TabNavigator" component={TabNavigator} options={{headerShown: false}}/>
          <Stack.Screen name="HelpScreen" component={HelpScreen} options={{headerShown:false}} />
          <Stack.Screen name="HelpDescription" component={HelpDescriptionScreen} options={{headerShown:false}}/>
          <Stack.Screen name="HelpConfirmation" component={HelpConfirmationScreen} options={{headerShown:false}}/>
          <Stack.Screen name="LocationRouting" component={LocationRouteScreen} options={{headerShown:false}} />
          <Stack.Screen name="Notification" component={NotificationHistory} options={{headerShown:false}} />
          <Stack.Screen name="Location" component={LocationHistory} options={{headerShown:false}} />
          <Stack.Screen name="EmergencyContactList" component={EmergencyContactListScreen} options={{headerShown:false}}/>
          <Stack.Screen name="Subscription" component={SubscriptionScreen} options={{headerShown:false}}/>
        </Stack.Navigator>
    
    );
  }
  
  export default AuthStack;
