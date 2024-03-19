import React, { useState } from "react";
import { Text, TextInput, View, TouchableOpacity } from "react-native";
import style from "../../style/phone-number-screen/style";
import Icon from 'react-native-vector-icons/MaterialIcons';
import HandleError from "../../hook/useError";
import axios from "axios";

interface PhoneNumberScreenProps {
  navigation: any; 
}

const PhoneNumberScreen: React.FC<PhoneNumberScreenProps> = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [sessionInfo , setSessionInfo] = useState('');
  const [isError, setIsError] = useState(false);

  const handlePhoneNumber = async() => {
    try {
      if (!phoneNumber) {
        return setIsError(true);
      } else {
        setIsError(false);
      }

      if (phoneNumber.length < 10) {
        return setIsError(true);
      } else {
        setIsError(false);
      }

      let phoneno = '+91'+phoneNumber.toString();
      console.log(phoneno);
      
      const response = await axios.post('http://10.0.2.2:3000' , {phoneNumber:phoneno});
     
      setSessionInfo(response.data.sessionInfo);
      navigation.navigate('OtpNumber' ,{ sessionInfo: sessionInfo });
    } catch (error) 
    {
      console.error('Error sending OTP:', error.response ? error.response.data.error : error.message);
    }
  
  }

  return (
    <View style={style.phoneNumberMain}>
      <View style={style.iconArrowBackView}>
        <Text style={style.iconArrowBack}>
          <Icon name="keyboard-backspace" size={40} />
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
            value={phoneNumber}
            onChangeText={(text) => setPhoneNumber(text)}
            maxLength={10} />
        </View>
      </View>
      {isError && phoneNumber.length < 10 && phoneNumber.length >= 1 ?
        <HandleError title="please enter valid phone number" />
        : isError ? <HandleError title="please enter phone number" /> : null
      }
      <View style={style.informationView}>
        <Text style={style.informationText}>
          We'll send you a verification code. Message and
          data rates may apply.
        </Text>
      </View>
      
      <View style={style.sendCodeBtnView}>
        <TouchableOpacity
          style={style.sendBtnCode}
          onPress={() => handlePhoneNumber()}>
          <View style={style.btnView}>
            <Text style={style.sendCode}>
              Send Code
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default PhoneNumberScreen;
