import React, {useState, useRef, useMemo} from 'react';
import {View, Text, TextInput, TouchableHighlight} from 'react-native';
import style from '../../style/otp-number-screen/style';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HandleError from '../../hook/useError';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';

interface OtpNumberScreenProps {
  navigation: any; // Adjust the type according to your navigation prop type
}

const OtpNumberScreen: React.FC<OtpNumberScreenProps> = ({navigation}) => {
  const [otp, setOtp] = useState('');
  const [isError, setIsError] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const onPress = () => inputRef.current?.focus();
 // const sessionInfo = navigation.getParam('sessionInfo');
 const route = useRoute()
 const sessionInfo = route.params?.sessionInfo; 

  const handleOtpNumber = async() => {
  
    try
    {

      if(!otp) {
        setIsError(true);
        return false;
      } 
      else if (otp.length > 1 && otp.length < 6) {
        setIsError(true);
        return false;
      } 
      else 
      {
        setIsError(false);
      } 

     
      const response = await axios.post('http://10.0.2.2:3000/verify' , {sessionInfo:sessionInfo , otp:otp});

      navigation.navigate('EditProfile');

    }
    catch(error)
    {
      console.error('Error verifying OTP:', error.response ? error.response.data.error : error.message);
    }
    
  };

  const otpContent = useMemo(
    () => (
      <View style={style.otpContainerView}>
        {Array.from({length: 6}).map((_, i) => (
          <Text
            key={i}
            onPress={onPress}
            style={[style.otpTextStyle, otp[i] ? style.otpFilledStyle : {}]}>
            {otp[i]}
          </Text>
        ))}
      </View>
    ),
    [otp],
  );

  return (
    <View style={style.otpNumberMain}>
      <View style={style.iconArrowBackView}>
        <Text
          style={style.iconArrowBack}
          onPress={() => navigation.navigate('PhoneNumber')}>
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
          onChangeText={text => setOtp(text)}
          value={otp}
          keyboardType="number-pad"
        />
        {otpContent}
      </View>
      {isError && otp.length > 1 && otp.length < 6 ? (
        <View style={{marginTop: 23, marginLeft: -2}}>
          <HandleError title="please enter the valid code" />
        </View>
      ) : isError ? (
        <View style={{marginTop: 23, marginLeft: -2}}>
          <HandleError title="please enter the code" />
        </View>
      ) : null}
      <View style={style.otpNumberResendCodeStyle}>
        <View style={style.otpNumberResendCodeText}>
          <Text style={style.otpNumberResendCode}>Resend Code</Text>
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
            <Text style={style.verifyCode}>Next</Text>
          </View>
        </TouchableHighlight>
      </View>
    </View>
  );
};

export default OtpNumberScreen;
