import * as React from 'react';
import { Text, View, StyleSheet, Pressable, Animated, Dimensions } from 'react-native';

interface WarningSheetProps {
    setWarningSheetVisible:any;
}

const height = Dimensions.get('screen').height;

const WarningSheet:React.FC<WarningSheetProps> = ({setWarningSheetVisible}) => {
    const slide = React.useRef(new Animated.Value(300)).current; 
  // BottomSheet Slide Up Animatiom
  
  const slideUp = () => {
    Animated.timing(slide, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };


  // BottomSheet Slide Down Animation
  const slideDown = () => {
   
    Animated.timing(slide, {
      toValue: 300,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  React.useEffect(() => { 
    
    slideUp()
  },[])




 // Close BottomSheet
  const closeModal = () => {
    
     slideDown();
     setTimeout(() => {
        setWarningSheetVisible(false);
     },800);
  }

  return (
    <>
    <Pressable style={styles.container}>
        <View style={{position:'absolute' , top:0, left:0, right:0 , alignItems:'center',marginTop: height/4}}>
                <Text style={{fontSize:20}}>Live Location is Sharing,{/n} if you do not want share your live location please tap volume down button 3 times</Text>
        </View>
      
    </Pressable>
  </>
  );
};

export default WarningSheet;

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
        color:'#00000080',
    },
    
});

