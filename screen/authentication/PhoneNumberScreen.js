import React from "react";
import {Text, TextInput, View , TouchableHighlight } from "react-native";
import style from "../../style/phone-number-screen/style";
import Icon from 'react-native-vector-icons/MaterialIcons';



const PhoneNumberScreen = ({navigation}) => {
   return(
        <View style={style.phoneNumberMain}>
              
              <View style={style.iconArrowBackView}>
                    <Text style={style.iconArrowBack}>
                        <Icon name="keyboard-backspace" size={40}/>
                    </Text>
              </View>

              <View style={style.phoneNumberView}>
                    <Text style={style.phoneNumberText}>
                        Enter your phone number
                    </Text>
              </View>
              
              <View style={style.phoneNumebrTextInputView}>
                  <View style={style.phoneNumberTextInput}>
                       <TextInput 
                          style={style.phoneNumber} 
                          placeholder="Phone number"
                          keyboardType="numeric"
                          maxLength={10}/>
                  </View>
              </View>
              
              <View style={style.informationView}>
                  <Text style={style.informationText}>
                    We'll send you a verification code. Message and 
                    data rates may apply.    
                  </Text> 
              </View>

              <View style={style.sendCodeBtnView}>
                    <TouchableHighlight 
                        style={style.sendBtnCode} 
                        onPress={()=>navigation.navigate('OtpNumber')}>

                        <View style={style.btnView}>
                           <Text style={style.sendCode}>
                              Send Code
                           </Text>
                        </View>

                    </TouchableHighlight>
              </View>

        </View>
   )    
}


export default PhoneNumberScreen;