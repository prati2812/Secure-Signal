import React, {useState, useRef, useMemo, useEffect} from 'react';
import {View, Text, TextInput, TouchableOpacity , StyleSheet , ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Image, Dimensions, StatusBar, Pressable} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HandleError from '../../component/useError';
import auth from '@react-native-firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { requestUserPermission } from '../../utils/NotificationService';
import instance from '../../axios/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';


interface OtpNumberScreenProps {
  navigation: any; 
}  

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;


const OtpNumberScreen: React.FC<OtpNumberScreenProps> = ({navigation}) => {
  const regex = /[.,+\-' ']/;
  const [otp, setOtp] = useState('');
  const [isError, setIsError] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const [isIndicatorVisible, setIndicatorVisible] = useState(false);
  const [isResendEnabled, setIsResendEnabled] = useState(false); 
  const [timeLeft, setTimeLeft] = useState(30); 
  

  const verificationId = useSelector((state : any) => state.verification.verificationId);
  const phoneNumber = useSelector((state:any) =>  state.userProfile.phoneNumber);
  

  const onPress = () => inputRef.current?.focus();

  useEffect(() => {
    requestUserPermission();
  },[]);

  useEffect(() => {
    if (timeLeft === 0) {
      setIsResendEnabled(true);
      return;
    }

    const timerId = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timerId);
  }, [timeLeft]);


  const handleResendCode = async() => {
    try{
      if (!isResendEnabled) return;
      await auth().signInWithPhoneNumber(phoneNumber,true);
     setTimeLeft(30);
     setIsResendEnabled(false);
    }
    catch(error){
       console.log(error);
       
    }
    
  };
  

  // Otp Number Verification
  const handleOtpNumber = async() => {
    if(!isError){
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
         `${error}`,
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
    }
    
    
  };

  // Otp filled in boxes
  const otpContent = useMemo(
    () => (
      <View style={styles.otpContainerView}>
        {Array.from({length: 6}).map((_, i) => (
          <Text
            key={i}
            onPress={onPress}
            style={[styles.otpTextStyle, otp[i] ? styles.otpFilledStyle : {}]}>
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
    }
    else if(regex.test(text)){
      setIsError(true);
      setOtp(text);
    } 
    else if ((text.length < 6)) {
      setIsError(true);
      setOtp(text);
    }
    else{
      setIsError(false);
      setOtp(text);
    } 
    
  }

  const isDisabled = isError || isIndicatorVisible;
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#3ebb6e'}/>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.select({ios: 0, android: 500})}>
        <View style={{alignItems: 'center', flex: 1, justifyContent: 'center'}}>
          <Image
            style={{
              width: width / 1.7,
              height: height / 4,
              resizeMode: 'cover',
            }}
            source={require('../../assets/image/otpNumberVerification.png')}
          />
        </View>
        <View style={{width: '100%', height: '75%'}}>
          <View style={styles.bottomSheet}>
            <Pressable style={styles.iconArrowBackView} onPress={() => navigation.navigate('PhoneNumber')}>
              <Text style={styles.iconArrowBack}>
                <Icon name="keyboard-backspace" size={40} />
              </Text>
            </Pressable>
            <View style={styles.otpnNumberTextView}>
              <Text style={styles.otpNumberText}>
                Enter the code we just texted you
              </Text>
            </View>
            <View style={styles.otpNumberViewTextTextInput}>
              <TextInput
                maxLength={6}
                ref={inputRef}
                style={styles.otpTextInput}
                onChangeText={otpValidation}
                value={otp}
                keyboardType="number-pad"
                onSubmitEditing={handleOtpNumber}
              />
              {otpContent}
            </View>
            {isError && otp.length >= 1 && otp.length <= 6 && regex.test(otp) ? (
                 <View style={{marginTop: 23, marginLeft: -2}}>
                        <HandleError title="Please enter the valid code" />
                 </View>
      ) : isError ? (
        <View style={{marginTop: 23, marginLeft: -2}}>
          <HandleError title="Please enter the code" />
        </View>
      ) : null}
           <View style={styles.otpNumberResendCodeStyle}>
              <TouchableOpacity
              onPress={handleResendCode}
              disabled={!isResendEnabled}>
              <View style={styles.otpNumberResendCodeText}>
                <Text style={[styles.otpNumberResendCode , isResendEnabled && {color:'#3ebb6e'}]}>Resend Code</Text>
              </View>
              </TouchableOpacity>
              <View style={styles.otpNumberResendCodeTextTimer}>
                <Text style={[styles.otpNumberResendCodeTimer , !isResendEnabled && {color:'#3ebb6e'}]}>{`00:${timeLeft < 10 ? `0${timeLeft}` : timeLeft}`}</Text>
              </View>
            </View> 

            <View style={styles.verifyCodeBtnView}>
              <TouchableOpacity 
                   style={[styles.verifyBtnCode , isError && styles.verifyCodeBtnDisable]} 
                   onPress={handleOtpNumber}
                   disabled={isDisabled}>
                <View style={styles.btnView}>
                  {
                    isIndicatorVisible ? <ActivityIndicator size={25} color={'white'}/> 
                       :  <Text style={styles.verifyCode}>Next</Text>   
                  }
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flex: 1,
    backgroundColor: '#3ebb6e',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    borderTopRightRadius: 45,
    borderTopLeftRadius: 45,
  },
  iconArrowBackView: {
    marginTop: 20,
  },
  iconArrowBack: {
    justifyContent: 'center',
    marginLeft: 10,
    color: 'black',
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
    textAlign: 'center',
  },
  otpNumberViewTextTextInput: {
    marginHorizontal: 20,
    marginTop: 10,
  },
  otpTextInput: {
    height: 60,
    width: '100%',
    marginBottom:-60,
    opacity:0,
  },
  otpContainerView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  otpTextStyle: {
    height: 60,
    width: 50,
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 28,
    textAlignVertical: 'center',
    textAlign: 'center',
    color: 'black',
    backgroundColor: '#F3FAFF',
    borderColor: '#3ebb6e',
    elevation: 3,
  },
  otpFilledStyle: {
    backgroundColor: '#F3FAFF',
    overflow: 'hidden',
    borderColor: 'gray',
  },
  otpNumberResendCodeStyle: {
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  otpNumberResendCodeText: {
    paddingLeft: 20,
  },
  otpNumberResendCode: {
    color: 'gray',
    fontSize: 14,
    fontWeight: '500',
  },
  otpNumberResendCodeTextTimer: {
    paddingRight: 20,
  },
  otpNumberResendCodeTimer: {
    fontSize: 14,
    fontWeight: '500',
  },
  verifyCodeBtnView: {
    flex: 1,
    justifyContent: 'flex-end',
    margin: 20,
    marginBottom: 10,
    marginTop:-10
  },
  verifyBtnCode: {
    backgroundColor: '#3ebb6e',
    padding: 13,
    borderRadius: 10,
    elevation: 3,
  },
  verifyCodeBtnDisable:{
    backgroundColor: '#74d198', 
  },
  btnView: {
    alignItems: 'center',
    margin: 1,
  },
  verifyCode: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },

    
});



export default OtpNumberScreen;
