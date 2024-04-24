import * as React from 'react';
import { Text, View, StyleSheet, ScrollView, Alert, TextInput, Button } from 'react-native';
import CustomHeader from '../../component/CustomHeader';
import SubscriptionCard from '../../component/SubscriptionCard';
import { useState } from 'react';
import PaymentCard from '../../component/PaymentCard';
import { initPaymentSheet, presentPaymentSheet, useStripe , Address , BillingDetails, useConfirmPayment, CardField} from '@stripe/stripe-react-native';
import axios from 'axios';




interface SubscriptionScreenProps {}

const SubscriptionScreen = (props: SubscriptionScreenProps) => {
    const [selectedSubscription, setSelectedSubscription] = useState<string | null>(null);
    const [selectedSubscriptionPrice , setSelectedSubscriptionPrice] = useState('');
    const [isBottomSheetVisible , setBottomSheetVisible] = useState(false);
    const { confirmPayment, loading } = useConfirmPayment();
    const stripe = useStripe();
    
  
    const handleSelectSubscription = async(subscriptionType: string , price:string) => {
      setSelectedSubscription(subscriptionType);
      setSelectedSubscriptionPrice(price);
      console.log("type" , subscriptionType , price);
          
      
    };
    
    const handleSubscribeBtn = async() => {
     const name = 'Test';
     const totalAmount= 100;
     const response = await axios.post('http://10.0.2.2:3000/payment', {
        totalAmount , name},{
          headers: {
            'Content-Type': 'application/json',
          },
     }) 

     const { paymentIntent, ephemeralKey, customer}  = await response.data;

     console.log(paymentIntent);
     console.log(ephemeralKey);
     console.log(customer);

     const address: Address = {
      city: 'San Francisco',
      country: 'AT',
      line1: '510 Townsend St.',
      line2: '123 Street',
      postalCode: '94102',
      state: 'California',
    };
    const billingDetails: BillingDetails = {
      name: 'Jane Doe',
      email: 'foo@bar.com',
      phone: '555-555-555',
      address: address,
    };
     
     
    const { error } = await initPaymentSheet({
      merchantDisplayName: "Merchant",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
    });




  const { error1 } = await presentPaymentSheet();

  if (error1) {
    Alert.alert(`Error code: ${error1.code}`, error1.message);
  }
    
     
   
  
  };
   
       
     
        //setBottomSheetVisible(true);
    
    
  return (
    <>      
      <View style={styles.container}>
        <CustomHeader name={'Subscriptions'} icon={''} />
       
        <ScrollView style={{marginTop: 30}}>
          <SubscriptionCard
            subscriptionType={'Monthly'}
            price={'$4.99'}
            details={'Get ready for Securrance.'}
            onSelect={handleSelectSubscription}
            selected={selectedSubscription === 'Monthly'}
            onPress={handleSubscribeBtn}
          />

          <SubscriptionCard
            subscriptionType={'Quarterly'}
            price={'$10.99'}
            details={'Get ready for Securrance.'}
            onSelect={handleSelectSubscription}
            selected={selectedSubscription === 'Quarterly'}
            onPress={handleSubscribeBtn}
          />

          <SubscriptionCard
            subscriptionType={'Yearly'}
            price={'$20.99'}
            details={'Get ready for Securrance.'}
            onSelect={handleSelectSubscription}
            selected={selectedSubscription === 'Yearly'}
            onPress={handleSubscribeBtn}
          />
        </ScrollView>
      
      
       
   

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
});
  
export default SubscriptionScreen;

