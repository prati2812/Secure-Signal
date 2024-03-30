import React,{useState} from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PaymentCard from './PaymentCard';

interface SubscriptionCardProps {
   subscriptionType:string,
   price:string,
   details:string,
   onSelect: (subscriptionType: string , price:string) => void;
   selected:boolean,
   onPress:any;
}

const SubscriptionCard:React.FC<SubscriptionCardProps> = ({subscriptionType , price , details , onSelect, selected , onPress}) => {
 

  const handlePress = () => {
     onSelect(subscriptionType , price); 
  }
  return (
    <Pressable style={[styles.subscriptionCardView , selected && styles.isSelected]} onPress={handlePress}>

         <View style={styles.subscriptionCardDataView}>
                <Text style={styles.subscriptionCardTypeText}>{subscriptionType}</Text>
                <Text style={styles.subscriptionCardTypePrice}>{price}</Text>
         </View>
         <View style={styles.subscriptionCardDetailsView}>
                <Text style={styles.subscriptionCardDetailsMessage}>{details}</Text>
         </View>

         <TouchableOpacity
           onPress={onPress} 
           style={[styles.subscriptionCardBtnView , selected === false && styles.isNotSelected]}>
                <Text style={styles.subscriptionCardBtnText}>Subscribe Now</Text>
         </TouchableOpacity>
                
    </Pressable>
  );
};

const styles = StyleSheet.create({
  subscriptionCardView: {
    backgroundColor: 'white',
    marginLeft: 15,
    marginRight: 15,
    padding: 15,
    borderRadius: 10,
    elevation: 5,
    gap: 10,
    marginBottom: 15,
    borderColor: 'lightblue',
    borderWidth: 1,
  },
  subscriptionCardDataView:{
    flexDirection:'row',
    justifyContent:'space-between'
  },
  subscriptionCardTypeText:{
    fontSize:28,
    color:'black',
  },
  subscriptionCardTypePrice:{
    fontSize:28,
    color:'black',
  },
  subscriptionCardDetailsView:{
    marginTop:-5
  },
  subscriptionCardDetailsMessage:{
    fontWeight:'500',
  },
  subscriptionCardBtnView:{
    marginTop:10,
    backgroundColor:'#bf1234',
    padding:10,
    borderRadius:10,
    alignItems:'center',
    justifyContent:'center',
  },
  subscriptionCardBtnText:{
    color:'white',
    fontSize:19,
  },
  isSelected:{
    borderColor: '#bf1234',
    borderWidth:2.5,
  },
  isNotSelected:{
    backgroundColor:'gray',

  }

 

  
});


export default SubscriptionCard;


