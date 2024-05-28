import React, {useState, useRef, useMemo, useEffect} from 'react';
import {View, Text, TextInput, TouchableOpacity , StyleSheet , ActivityIndicator, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HandleError from '../../hook/useError';
import auth from '@react-native-firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { requestUserPermission } from '../../utils/NotificationService';
import instance from '../../axios/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';


interface OtpNumberScreenProps {
  navigation: any; 
}  

const OtpNumberScreen: React.FC<OtpNumberScreenProps> = ({navigation}) => {
  const regex = /[.,+\-' ']/;
  const [otp, setOtp] = useState('');
  const [isError, setIsError] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const [isIndicatorVisible, setIndicatorVisible] = useState(false);
  const dispatch = useDispatch();

  const verificationId = useSelector((state : any) => state.verification.verificationId);

  const onPress = () => inputRef.current?.focus();

  useEffect(() => {
    requestUserPermission();
  },[]);


  

  // Otp Number Verification
  const handleOtpNumber = async() => {
    
    try
    {

      if(!otp){
        setIsError(true);
        setOtp(otp);
        return false;  
      }
  
      setIndicatorVisible(true);
      const credential = auth.PhoneAuthProvider.credential(verificationId, otp);
      const dataa = await auth().signInWithCredential(credential);
      const userId = dataa.user.uid;
      const phoneNumber = dataa.user.phoneNumber;

      const response = await instance.post("/userAuthentication" , {userId , phoneNumber});
      if(response.status === 201){
         const responseData = await response.data;
         const {token} = responseData;
         AsyncStorage.setItem('token' , token);
      }

      setIndicatorVisible(false); 
      navigation.navigate('EditProfile');
    }
    catch(error)
    {
      setIndicatorVisible(false);
      Alert.alert(
       'Invalid Otp',
       `Please enter the correct otp`,
       [
         {
           text: 'Ohk',
         },
       ],
       {
         cancelable: true,
       },
     );
      console.log(error);     
    }
    
  };

  // Otp filled in boxes
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

  // otp validation
  const otpValidation = (text: string) => {
    if(!text) {
      setIsError(true);
      setOtp(text);
      return false;
    }
    else if(regex.test(text)){
      setIsError(true);
      setOtp(text);
      return false;
    } 
    else if ((text.length < 6)) {
      setIsError(true);
      setOtp(text);
      return false;
    }
    else{
      setIsError(false);
      setOtp(text);
    } 
    
  }

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
          onChangeText={otpValidation}
          value={otp}
          keyboardType="number-pad"
        />
        {otpContent}
      </View>
      {isError && otp.length >= 1 && otp.length <= 6 && regex.test(otp) ? (
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
          style={[style.verifyBtnCode , isError && style.verifyCodeBtnDisable]}
          onPress={() => handleOtpNumber()}
          disabled={isError}>
          <View style={style.btnView}>
              {  isIndicatorVisible ? <ActivityIndicator size={25} color={'white'}/>  
                 : <Text style={style.verifyCode}>Next</Text>
              }   
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
      borderColor:'white',
      elevation:3, 
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
      borderRadius:10,
      elevation:3,
  },
  verifyCodeBtnDisable:{
    backgroundColor: '#74d198', 
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
