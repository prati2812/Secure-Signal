import React from "react";
import { Text, TextInput, View } from "react-native";
import style from "../../style/phone-number-screen/style";

const PhoneNumberScreen = () => {
   return(
        <View style={style.phoneNumberMain}>
              <View style={style.phoneNumberView}>
                    <Text style={style.phoneNumberText}>Enter your phone number</Text>
              </View>
              
              <View style={style.phoneNumebrTextInputView}>
                  <View style={style.phoneNumberTextInput}>
                       <TextInput 
                          style={style.phoneNumber} 
                          placeholder="Phone number"
                          keyboardType="numeric"/>
                  </View>
              </View>
              
              <View style={style.informationView}>
                  <Text style={style.informationText}>
                    We'll send you a verification code. Message and 
                    data rates may apply.    
                  </Text> 
              </View>

        </View>
   )    
}


export default PhoneNumberScreen;