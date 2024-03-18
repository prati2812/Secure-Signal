import React, { useState, useRef, useMemo } from "react";
import { View, Text, TextInput, TouchableHighlight } from 'react-native';
import style from "../../style/otp-number-screen/style";
import Icon from 'react-native-vector-icons/MaterialIcons';
import HandleError from "../../hook/useError";

interface OtpNumberScreenProps {
  navigation: any; // Adjust the type according to your navigation prop type
}

const OtpNumberScreen: React.FC<OtpNumberScreenProps> = ({ navigation }) => {
  const [text, onChangeText] = useState('');
  const [isError, setIsError] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const onPress = () => inputRef.current?.focus();

  const handleOtpNumber = () => {
    if (!text) {
      setIsError(true);
      return false;
    } else if (text.length > 1 && text.length < 6) {
      setIsError(true);
      return false;
    } else {
      setIsError(false);
      navigation.navigate('EditProfile');
    }
  }

  const otpContent = useMemo(() =>
    <View style={style.otpContainerView}>
      {
        Array.from({ length: 6 }).map((_, i) => (
          <Text
            key={i}
            onPress={onPress}
            style={[style.otpTextStyle, text[i] ? style.otpFilledStyle : {}]}>
            {text[i]}
          </Text>
        ))
      }
    </View>
    , [text]);

  return (
    <View style={style.otpNumberMain}>
      <View style={style.iconArrowBackView}>
        <Text style={style.iconArrowBack} onPress={() => navigation.navigate('PhoneNumber')}>
          <Icon name="keyboard-backspace" size={40} />
        </Text>
      </View>
      <View style={style.otpnNumberTextView}>
        <Text style={style.otpNumberText}>
          Enter the code we just texted you
        </Text>
      </View>
      <View style={style.otpNumberViewTextTextInput}>
        <TextInput
          maxLength={6}
          ref={inputRef}
          style={style.otpTextInput}
          onChangeText={text => onChangeText(text)}
          value={text}
          keyboardType="number-pad"
        />
        {otpContent}
      </View>
      {isError && text.length > 1 && text.length < 6 ?
        <View style={{ marginTop: 23, marginLeft: -2 }}>
          <HandleError title="please enter the valid code" />
        </View> :
        isError ?
          <View style={{ marginTop: 23, marginLeft: -2 }}>
            <HandleError title="please enter the code" />
          </View>
          : null
      }
      <View style={style.otpNumberResendCodeStyle}>
        <View style={style.otpNumberResendCodeText}>
          <Text style={style.otpNumberResendCode}>
            Resend Code
          </Text>
        </View>
        <View style={style.otpNumberResendCodeTextTimer}>
          <Text style={style.otpNumberResendCodeTimer}>00:30</Text>
        </View>
      </View>
      <View style={style.verifyCodeBtnView}>
        <TouchableHighlight
          style={style.verifyBtnCode}
          onPress={() => handleOtpNumber()}>
          <View style={style.btnView}>
            <Text style={style.verifyCode}>
              Next
            </Text>
          </View>
        </TouchableHighlight>
      </View>
    </View>
  )
}

export default OtpNumberScreen;
