import React, { useState } from "react";
import { Text, TextInput, View, TouchableOpacity } from "react-native";
import style from "../../style/phone-number-screen/style";
import Icon from 'react-native-vector-icons/MaterialIcons';
import HandleError from "../../hook/useError";

interface PhoneNumberScreenProps {
  navigation: any; 
}

const PhoneNumberScreen: React.FC<PhoneNumberScreenProps> = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isError, setIsError] = useState(false);

  const handlePhoneNumber = () => {
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

    navigation.navigate('OtpNumber');
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
