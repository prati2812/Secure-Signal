import React, {useState, useRef, useMemo} from 'react';
import {View, Text, TextInput, TouchableOpacity , StyleSheet} from 'react-native';
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
      
      navigation.navigate('EditProfile');

    }
    catch(error)
    {
      
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
        <TouchableOpacity
          style={style.verifyBtnCode}
          onPress={() => handleOtpNumber()}>
          <View style={style.btnView}>
            <Text style={style.verifyCode}>Next</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  otpNumberMain: {
      flex: 1,
      backgroundColor: '#FFFFFF',
  },
  iconArrowBackView: {
      marginTop: 20
  },
  iconArrowBack: {
      justifyContent: 'center',
      marginLeft: 10,
      color: 'black'
  },
  otpnNumberTextView: {
      marginTop: 10,
      justifyContent: 'center',
      alignItems: 'center',
  },
  otpNumberText: {
      fontSize: 25,
      color: 'black',
      fontWeight: '500',
      padding: 10,
      textAlign: 'center'
  },
  otpNumberViewTextTextInput:{
      marginHorizontal:20
  },
  otpTextInput:{
      height:0,
      width:0, 
  },
  otpContainerView:{
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'space-between',
  },
  otpTextStyle: {
      height: 60,
      width: 50,
      borderWidth: 1,
      borderRadius: 10,
      fontSize: 28,
      textAlignVertical:'center',
      textAlign:'center',
      color:'black',
      backgroundColor:'#F3FAFF',
      borderColor:'white' 
  },
  otpFilledStyle: {
      backgroundColor: '#F3FAFF',
      overflow: 'hidden',
      borderColor:'gray'
  },
  otpNumberResendCodeStyle:{
      marginTop:10,
      flexDirection:'row',
      justifyContent:'space-between'
  },
  otpNumberResendCodeText:{
      paddingLeft:20,
  },
  otpNumberResendCode:{
      color:'black',
      fontSize:14,
      fontWeight:'500'
  },
  otpNumberResendCodeTextTimer:{
      paddingRight:20,
  },
  otpNumberResendCodeTimer:{
      fontSize:14,
      fontWeight:'500',
  },
  verifyCodeBtnView:{
      flex:1,
      justifyContent:'flex-end',
      margin:20,
      marginBottom:30,
  },
  verifyBtnCode:{
      backgroundColor:'#3ebb6e',
      padding:13,
      borderRadius:10
  },
  btnView:{
      alignItems:'center',
      margin:1
  },
  verifyCode: {
      color: 'white',
      fontSize: 18,
      fontWeight: '700'
  }
  
});



export default OtpNumberScreen;
