import * as React from 'react';
import { Text, View, StyleSheet, ScrollView, Alert, TextInput, Button } from 'react-native';
import CustomHeader from '../../component/CustomHeader';
import SubscriptionCard from '../../component/SubscriptionCard';
import { useState } from 'react';
import PaymentCard from '../../component/PaymentCard';
import { initPaymentSheet, presentPaymentSheet, useStripe , Address , BillingDetails, useConfirmPayment, CardField} from '@stripe/stripe-react-native';
import axios from 'axios';
import { firebase } from '@react-native-firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import CrossLine from '../../component/CrossLine';
import LinearGradient from 'react-native-linear-gradient';
import { IS_SUBSCRIBED } from '../../redux/subscription/action';
import { addImageUri } from '../../redux/userprofile/action';



interface SubscriptionScreenProps {
  navigation:any;
}

const SubscriptionScreen:React.FC<SubscriptionScreenProps> = ({navigation}) => {
    const [selectedSubscription, setSelectedSubscription] = useState<string | null>(null);
    const [selectedSubscriptionPrice , setSelectedSubscriptionPrice] = useState('');
    const [isBottomSheetVisible , setBottomSheetVisible] = useState(false);
    const subScriptionType = useSelector((state:any) => state.subscription.subScriptionType);
    const subScriptionEndTime = useSelector((state:any) => state.subscription.subScriptionEndTime);
    const isSubscribed = useSelector((state:any) => state.subscription.isSubscribed);
    const token = useSelector((state : any) => state.userProfile.token);
    const userId = firebase.auth().currentUser?.uid;
    const dispatch = useDispatch();    
    
    
  
    const handleSelectSubscription = async(subscriptionType: string , price:string) => {
   
      setSelectedSubscription(subscriptionType);
      setSelectedSubscriptionPrice(price);
    };
    

    const handleSubscribeBtn = async () => {
     
      if(subScriptionType){
          
          Alert.alert("Alert" , 
             `You already subscribed ${subScriptionType} subscription`); 
      }
      else{
        try {
          let amount = selectedSubscriptionPrice;
          let totalAmount = amount.replace('₹', '');
          console.log(totalAmount);
 
          const response = await axios.post(
            'http://10.0.2.2:3000/payment',
            {
              totalAmount,
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            },
          );
 
          const {paymentIntent, ephemeralKey, customer} = await response.data;
 
          const {error: paymentSheetError} = await initPaymentSheet({
            merchantDisplayName: 'Secure Signal',
            customerId: customer,
            customerEphemeralKeySecret: ephemeralKey,
            paymentIntentClientSecret: paymentIntent,
          });
 
          if (paymentSheetError) {
            Alert.alert('Something went wrong', paymentSheetError.message);
            return;
          }
 
          const {error: paymentError} = await presentPaymentSheet();
 
          if (paymentError) {
            Alert.alert(
              `Error code: ${paymentError.code}`,
              paymentError.message,
            );
            return;
          } 
          else {
            await axios.post('http://10.0.2.2:3000/paymentSucess' , 
            {userId , selectedSubscription},
            {
              headers: {
               'Content-Type': 'application/json',
              },
            })
             .then(()=>{
               dispatch(addImageUri(userId , token));
               
               navigation.navigate('Home');
            }).catch((error) =>{
                console.log(error);
            });
 
            
          }
        } catch (error) {
          console.log(error);
        } 
      }


       
    };
   
       
     
      
    
    
  return (
    <>
      <View style={styles.container}>
        <CustomHeader
          name={'Subscriptions'}
          backIcon={'keyboard-backspace'}
          backCall={() => navigation.navigate('TabNavigator')}
        />

        <ScrollView style={{marginTop: 30}}>
          <SubscriptionCard
            subscriptionType={'Monthly'}
            price={'₹199'}
            details={'Get ready for Securrance.'}
            onSelect={handleSelectSubscription}
            selected={selectedSubscription === 'Monthly'}
            onPress={handleSubscribeBtn}
          />

          <SubscriptionCard
            subscriptionType={'Quarterly'}
            price={'₹399'}
            details={'Get ready for Securrance.'}
            onSelect={handleSelectSubscription}
            selected={selectedSubscription === 'Quarterly'}
            onPress={handleSubscribeBtn}
          />

          <SubscriptionCard
            subscriptionType={'Yearly'}
            price={'₹999'}
            details={'Get ready for Securrance.'}
            onSelect={handleSelectSubscription}
            selected={selectedSubscription === 'Yearly'}
            onPress={handleSubscribeBtn}
          />
        </ScrollView>

        {
           isSubscribed === true &&   <LinearGradient
           start={{x: 0, y: 0}} end={{x: 1, y: 0}} 
           colors={['#2e6faf' , '#28dfdb']}
           style={styles.subscribedToast}>
 
             <Text style={{fontSize:15, fontWeight:'bold' , color:'white'}}>
               {`Currently you subscribed ${subScriptionType} Subscription ${'\n'}Your plan end date is ${subScriptionEndTime}`}
             </Text>
         </LinearGradient>
        }
        
      </View>

      {/* {isBottomSheetVisible && (
        <PaymentCard setBottomSheetVisible={setBottomSheetVisible} price={selectedSubscriptionPrice} />
      )} */}
    </>
  );
};

const styles = StyleSheet.create({
    container: {
       flex:1,
       backgroundColor:'white'
    },
    subscribedToast:{
      padding: 16,
      borderTopLeftRadius:20,
      borderTopRightRadius:20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      left: 0,
      right: 0,
      backgroundColor:'linear-gradient(0deg, rgba(34,193,195,1) 0%, rgba(253,187,45,1) 100%)',
      elevation:3,
      
    },
});
  
export default SubscriptionScreen;

