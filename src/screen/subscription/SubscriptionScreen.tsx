import * as React from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import CustomHeader from '../../component/CustomHeader';
import SubscriptionCard from '../../component/SubscriptionCard';
import { useState } from 'react';
import PaymentCard from '../../component/PaymentCard';

interface SubscriptionScreenProps {}

const SubscriptionScreen = (props: SubscriptionScreenProps) => {
    const [selectedSubscription, setSelectedSubscription] = useState<string | null>(null);
    const [selectedSubscriptionPrice , setSelectedSubscriptionPrice] = useState('');
    const [isBottomSheetVisible , setBottomSheetVisible] = useState(false);

    const handleSelectSubscription = (subscriptionType: string , price:string) => {
      setSelectedSubscription(subscriptionType);
      setSelectedSubscriptionPrice(price);
      console.log("type" , subscriptionType , price);
    };
    
    const handleSubscribeBtn = () => {
       setBottomSheetVisible(true);
    }
    
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

      {isBottomSheetVisible && (
        <PaymentCard setBottomSheetVisible={setBottomSheetVisible} price={selectedSubscriptionPrice} />
      )}
    </>
  );
};

const styles = StyleSheet.create({
    container: {
       flex:1,
       backgroundColor:'white'
    }
});
  
export default SubscriptionScreen;

