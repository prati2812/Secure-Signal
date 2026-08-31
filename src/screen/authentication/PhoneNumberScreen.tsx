import React, {  useState } from "react";
import { Text, TextInput, View, TouchableOpacity, StyleSheet, StatusBar, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Image,  Pressable} from "react-native";
import HandleError from "../../component/useError";
import auth from '@react-native-firebase/auth';
import { useDispatch } from "react-redux";
import { addVerificationId } from "../../redux/credential/action";
import { height, regex, width } from "../../utils/constant";



interface PhoneNumberScreenProps {
  navigation: any; 
}



const PhoneNumberScreen: React.FC<PhoneNumberScreenProps> = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isError, setIsError] = useState(false);
  const [isIndicatorVisible, setIndicatorVisible] = useState(false);
  const dispatch = useDispatch();


  // Phone number validation
  const phoneNumberValidation = (text:string) => {
    if (!text) {
      setIsError(true);
      setPhoneNumber(text);
    } 
    else if (text.length < 10) {
      setIsError(true);
      setPhoneNumber(text);
    } 
    else if(regex.test(text)) {
       setIsError(true);
       setPhoneNumber(text);
    }
    else{
      setPhoneNumber(text);
      setIsError(false);
    }
    
    
  
  }

  // Phone Number Verification
  const handlePhoneNumber = async () => {
    if(!isError){
      try {

        let phoneNo = '+91' + phoneNumber;
        dispatch({
          type: 'ADD_USER_PHONE_NUMBER',
          payload: phoneNo,
        });
  
        setIndicatorVisible(true);
        try {
          const confirmation = await auth().signInWithPhoneNumber(phoneNo);
          
  
          dispatch(addVerificationId(confirmation.verificationId));
  
          setIndicatorVisible(false);
          navigation.navigate('OtpNumber');
        } catch (error) {
          setIndicatorVisible(false);
          Alert.alert(
            'Error',
            `${error}`,
            [
              {
                text: 'Ohk',
              },
            ],
            {
              cancelable: false,
            },
          );
        }
      } catch (error) {
        console.log(error);
      } 
    }
    
    
  };


  const isDisabled = isError || isIndicatorVisible || !phoneNumber;

  return (
    <View style={[styles.container]}>
      <StatusBar backgroundColor={'#3ebb6e'}/>  
     <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.select({ios: 0, android: 500})}>   
      <View style={{alignItems: 'center' , flex:1 , justifyContent:'center'}}>
        <Image
          style={{width: width / 1.2, height: height / 3 , resizeMode:'cover'}}
          source={require('../../assets/image/phoneNumber.png')}
        />
      </View>
      <Pressable style={{width: '100%', height: '67%'}}>
        <View style={styles.bottomSheet}>
          <View style={styles.phoneNumberView}>
            <Text style={styles.phoneNumberText}>Enter your phone number</Text>
          </View>
          <View style={styles.phoneNumebrTextInputView}>
            <View style={styles.phoneNumberTextInput}>
              <TextInput
                style={styles.phoneNumber}
                placeholder="Phone number"
                keyboardType="numeric"
                maxLength={10}
                value={phoneNumber}
                onChangeText={phoneNumberValidation}
                onSubmitEditing={handlePhoneNumber}
              />
            </View>
          </View>
          {isError && phoneNumber.length <= 10 && phoneNumber.length >= 1  && regex.test(phoneNumber)?
          <HandleError title="Please enter valid phone number" />
            : isError ? <HandleError title="Please enter phone number" /> : null
          }  

      <View style={styles.informationView}>
        <Text style={styles.informationText}>
          We'll send you a verification code. Message and
          data rates may apply.
        </Text>
      </View>
      
      <View style={styles.sendCodeBtnView}>
         <TouchableOpacity style={[styles.sendBtnCode, isError && styles.sendBtnCodeDisable ]}
                disabled={isDisabled}
                onPress={ () => handlePhoneNumber()}>
         <View style={styles.btnView}>
            {
               isIndicatorVisible ? <ActivityIndicator size={25} color={'white'}/> 
               :   <Text style={styles.sendCode}>
                      Send Code
                  </Text>
            }
          </View>
         </TouchableOpacity>
      </View>

        </View>
      </Pressable>
      </KeyboardAvoidingView>
    </View>
  )  
}

const styles  = StyleSheet.create({
  
  container: {
    position:'absolute',
    flex:1,
    backgroundColor:'#3ebb6e',
    width:'100%',
    height:'100%',
    top: 0,
    left: 0,
    justifyContent:'flex-end',
},
bottomSheet:{
    width:'100%',
    height:'100%',
    backgroundColor:'white',   
    borderTopRightRadius:45,
    borderTopLeftRadius:45,
},
phoneNumberView:{
    marginTop:30,
    alignItems:'center',
    justifyContent:'center',
},
phoneNumberText:{
   fontSize:25,
   color:'black',
   fontWeight:'500',
   padding:10,
   textAlign:'center'
},
phoneNumebrTextInputView:{
    backgroundColor:'white',
    padding:20
 },
 phoneNumberTextInput:{
    backgroundColor:'#F3FAFF',
    margin:2,
    padding:10,
    borderRadius:15,
    elevation:3,
 },
 phoneNumber:{
    fontSize:20,
    color:'black'  
 },
 informationView:{
    margin:-10,
    justifyContent:'center', 
 },
 informationText:{
    color:'black',
    fontSize:16,
    paddingLeft:35,
    paddingRight:35,
    fontWeight:'400'
 },
 sendCodeBtnView:{
     flex:1,
     justifyContent:'flex-end',
     margin:20,
     marginBottom:10,
 },
 sendBtnCode:{
     backgroundColor:'#3ebb6e',
     padding:13,
     borderRadius:10,
     elevation:3,
 },
 sendBtnCodeDisable:{
     backgroundColor: '#74d198', 
 },
 btnView:{
    color:'white',
    alignItems:'center',
    margin:1
 },
 sendCode:{
    color:'white',
    fontSize:18,
    fontWeight:'700'
 },


  


});


export default PhoneNumberScreen;
