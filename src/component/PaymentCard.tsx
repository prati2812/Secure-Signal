import React,{useState} from 'react';
import { useEffect } from 'react';
import { Text, View, StyleSheet, Pressable, TouchableOpacity, TextInput, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface PaymentCardProps {
  setBottomSheetVisible:any;
  price:string;
}

const PaymentCard:React.FC<PaymentCardProps> = ({setBottomSheetVisible,price}) => {
  const [cardNumber , setCardNumber] = useState(String);
  const [expirationData, setExpirationData] = useState(String);
  const [cvc , setCVC] = useState(String);
  const slide = React.useRef(new Animated.Value(300)).current;

  const slideUp = () => {
    Animated.timing(slide, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  const slideDown = () => {
   
    Animated.timing(slide, {
      toValue: 300,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    slideUp()
  })

  const closeModal = () => {
     slideDown();
     setTimeout(() => {
      setBottomSheetVisible(false);
     },800);
  }

  const dataPrint = () => {
    console.log("card number" , cardNumber , "Expiration" , expirationData , "CVC" , cvc);
    
    
  }

  return (
    <Pressable style={styles.container} onPress={closeModal}>
      <Pressable style={{width: '100%', height: '45%'}}>
        <Animated.View style={[styles.bottomSheet , {transform: [{ translateY: slide}]}]}>
          <TouchableOpacity style={styles.closeIcon} onPress={closeModal}>
            <Icon name="close" size={25} color={'black'} />
          </TouchableOpacity>

          <View style={styles.paymentTitleView}>
            <Text style={styles.paymentTitle}>
              Add your payment information
            </Text>
          </View>

          <View style={styles.cardDetailsView}>

            <View style={styles.cardNumberDataView}>
                <Text style={styles.cardText}>Card Number</Text>
                  <View style={styles.cardNumberHolderView}>
                    <Icon name="credit-card" size={25} color={'gray'} />
                    <TextInput
                      style={styles.cardNumberInput}
                      keyboardType="numeric"
                      placeholder="Card Number"
                      onChangeText={(text) => setCardNumber(text)}
                    />
                  </View>
            </View>

            <View style={styles.cardDataView}>

              <View style={styles.cardDataContainer}>
                  <Text style={styles.cardText}>Expiration</Text>
                  <View style={styles.cardNumberHolderView}>
                    <Icon name="credit-card" size={25} color={'gray'} />
                    <TextInput
                      style={styles.cardNumberInput}
                      keyboardType="numeric"
                      placeholder="MM/YY"
                      onChangeText={(text) => setExpirationData(text)}
                    />
                  </View>
              </View>

              <View style={styles.cardDataContainer}>
                  <Text style={styles.cardText}>CVC</Text>
                  <View style={styles.cardNumberHolderView}>
                    <Icon name="credit-card" size={25} color={'gray'} />
                    <TextInput
                      secureTextEntry={true}
                      style={styles.cardNumberInput}
                      keyboardType="numeric"
                      placeholder="CVC"
                      onChangeText={(text) => setCVC(text)}
                    />
                  </View>
              </View>

            </View>

            <TouchableOpacity style={styles.paymentButton} onPress={() => dataPrint()}>
                   <Text style={styles.paymentText}>Pay {price}</Text>
            </TouchableOpacity>

          </View>
        </Animated.View>
      </Pressable>
    </Pressable>
  );
};

export default PaymentCard;

const styles = StyleSheet.create({
  container: {
    position:'absolute',
    flex:1,
    backgroundColor:'#00000080',
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
    borderTopLeftRadius:25,
    borderTopRightRadius:25,
  },
  closeIcon:{
    marginTop:15,
    marginLeft:15,
  },
  paymentTitleView:{
    marginTop:10,
    marginLeft:15,
  },
  paymentTitle:{
    color:'black',
    fontSize:22,
    fontWeight:'600',
  },
  cardDetailsView:{
    marginTop:15,
    marginLeft:15,
    marginRight:15,
    backgroundColor:'#f8f8ff',
    elevation:2,
    borderRadius:10,
    borderColor:'lightgray',
    borderWidth:1,
  },
  cardNumberDataView:{
    marginTop:15,
    marginLeft:15,
    marginBottom:5,
    marginRight:15,
    gap:5,
  },
  cardText:{
    fontSize:17,
    fontWeight:'500',
    color:'gray',
  },
  cardNumberHolderView:{
    backgroundColor:'white',
    borderRadius:10,
    borderColor:'gray',
    elevation:2,
    borderWidth:0.5,
    flexDirection:'row',
    gap:1,
    alignItems:'center',
    paddingLeft:5,
  },
  cardNumberInput:{
    marginLeft:10,
    fontSize:17,
    color:'black',
    fontWeight:'500',
  },
  cardDataView:{
    flexDirection:'row',
    marginTop:10,
    marginLeft:15,
    marginBottom:5,
    marginRight:15,
    alignItems:'center',
    justifyContent:'center',
    gap:15,
  },
  cardDataContainer:{
    flex:1,
  },
  paymentButton:{
    marginTop:10,
    marginLeft:15,
    marginRight:15,
    marginBottom:15,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#0080ff',
    padding:10,
    borderRadius:10,
    elevation:2,
  },
  paymentText:{
    color:'white',
    fontSize:19,
    fontWeight:'500'
  }

});
