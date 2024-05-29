import * as React from 'react';
import { Text, View, StyleSheet, StatusBar, ScrollView, Image, Pressable } from 'react-native';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import base64 from 'base64-js';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Modal } from 'react-native-paper';
import CustomHeader from '../../component/CustomHeader';


interface ComplaintScreenProps {
    navigation:any;  
}

const ComplaintScreen:React.FC<ComplaintScreenProps> = ({navigation}) => {
 const complaintData = useSelector((state:any) => state.userProfile.complaint);
 const [visible, setVisible] = React.useState(false);
 const [imageUri , setImageUri] = React.useState<string | null>('');
 const [isCompleted , setCompletedButton] = useState(false);
 const [isNotCompleted , setNotCompletedButton] = useState(false);
 const [isStatus , setStatus] = useState('');

const showModal = (imageUrl : string) => {
  setVisible(true)
  setImageUri(imageUrl);
};

const handleCompleted = () => {
    setCompletedButton(true);
    setNotCompletedButton(false);
    setStatus("Completed");
}

const handleNotCompleted = () => {
   setNotCompletedButton(true);
   setCompletedButton(false);
   setStatus("NotCompleted");
}

const handleSave = () => {
    
}

const hideModal = () => setVisible(false);
 
 
  return (
    <>
      <View style={styles.container}>
        <StatusBar backgroundColor={'#3ebb6e'} />
        <CustomHeader
          name={'Complaint Preview'}
          backIcon="keyboard-backspace"
          backCall={() => navigation.goBack()}
          icon={isStatus.length === 0 ? '' : 'check'}
          call={handleSave}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingTop: 20, paddingBottom: 20}}>
          <View style={styles.complaintMessageView}>
            <View style={styles.complaintMessage}>
              <Text style={styles.complaintTitle}>{`Complainer : `}</Text>
              <Text style={styles.message}>
                {complaintData.complaints.complaintBy}
              </Text>
            </View>
          </View>

          <View style={styles.complaintMessageView}>
            <View style={styles.complaintMessage}>
              <Text style={styles.complaintTitle}>{`Complaint : `}</Text>
              <Text style={styles.message}>
                {complaintData.complaints.complaint.trim()}
              </Text>
            </View>
          </View>

          <View style={styles.complaintMessageView}>
            <View style={styles.complaintMessage}>
              <Text style={styles.complaintTitle}>{`IsInjured : `}</Text>
              <Text style={styles.message}>
                {complaintData.complaints.isInjured}
              </Text>
            </View>
          </View>

          {complaintData.complaintsImageBuffer !== undefined && (
            <View style={styles.complaintMessageView}>
              <Text style={styles.complaintTitle}>{`Incident Photos : `}</Text>
              <View style={styles.complaintImageView}>
                {complaintData.complaintsImageBuffer !== undefined &&
                  complaintData.complaintsImageBuffer.map(
                    (item: any, index: number) => {
                      const base64Image = base64.fromByteArray(
                        item.imageBuffer.data,
                      );
                      const imageUrl = `data:image/jpeg;base64,${base64Image}`;

                      return (
                        <Pressable
                          key={index}
                          onPress={() => showModal(imageUrl)}>
                          <View style={styles.complaintImage} key={index}>
                            <Image
                              key={index}
                              source={{
                                uri: imageUrl
                                  ? imageUrl
                                  : 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
                              }}
                              style={{flex: 1}}
                              resizeMode="cover"
                            />
                          </View>
                        </Pressable>
                      );
                    },
                  )}
              </View>
            </View>
          )}

          <View style={styles.complaintMessageView}>
            <Text style={styles.complaintTitle}>{`Incident Location : `}</Text>
            <View style={{marginTop: 10}}>
                <View
                  style={{
                    width: '100%',
                    height: 300,
                    borderRadius: 10,
                    overflow: 'hidden',
                  }}>
                  <MapView
                    style={{flex: 1}}
                    provider={PROVIDER_GOOGLE}
                    scrollEnabled={false}
                    zoomEnabled={true}
                    region={{
                      latitude:
                        complaintData.complaints.complaintLocation.latitude,
                      longitude:
                        complaintData.complaints.complaintLocation.longtitude,
                      latitudeDelta: 0.015,
                      longitudeDelta: 0.0121,
                    }}>
                    <Marker
                      coordinate={{
                        latitude:
                          complaintData.complaints.complaintLocation.latitude,
                        longitude:
                          complaintData.complaints.complaintLocation.longtitude,
                      }}>
                      <Icon name="location-pin" size={40} color={'#5F4C24'} />
                    </Marker>
                  </MapView>
                </View>
            </View>
          </View>

          <View style={styles.questionOptionSelectionView}>
             
             <Pressable onPress={() => handleCompleted()} style={{flex:1}}>
              <View style={[styles.questionOptionView , isCompleted && styles.activateOptionView]}>
                   <Text style={[styles.option , isCompleted && styles.activateOption]}>
                         Completed
                   </Text>
              </View>
              </Pressable>

              <Pressable onPress={()=> handleNotCompleted()} style={{flex:1}}>
              <View style={[styles.questionOptionView , isNotCompleted && styles.activateOptionView]}>
                   <Text style={[styles.option , isNotCompleted && styles.activateOption]}>
                         Not Completed 
                   </Text>
              </View>
              </Pressable>

          </View>   




        </ScrollView>

       
      </View>
      {
        <>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={styles.containerStyle}>
            <Image
              source={{
                uri: imageUri
                  ? imageUri
                  : 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
              }}
              style={{flex: 1}}
              resizeMode="cover"
            />
          </Modal>
        </>
      }
    </>
  );
};

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'white'
    },
    complaintMessageView:{
        marginTop:5,
        marginLeft:15,
        marginRight:15,
        marginBottom:15,
        backgroundColor:'white',
        padding:10,
        borderRadius:10,
        elevation:7,
    },
    complaintMessage:{
        flexDirection:'row',
        alignItems:'center',
        flexWrap:'wrap',
    },
    complaintTitle:{
        fontWeight:'700',
        fontSize:20,
        color:'black',
    },
    message:{
        color:'black',
        alignItems:'center',
        justifyContent:'center',
        fontSize:16,
    },
    complaintImageView:{
        flexDirection:'row' ,  
        gap:10 , 
        alignItems:'center' ,  
        flexWrap:'wrap', 
        marginLeft:'auto', 
        marginTop:10,
    },
    complaintImage:{
        height:150, 
        width:150 , 
        marginTop:10, 
        backgroundColor:'lightblue' , 
        borderRadius:10,
        overflow:'hidden',
    },
    containerStyle:{
        backgroundColor:'white',
        marginLeft:30,
        marginRight:30,
        height:'70%',
    },
    questionOptionSelectionView:{
      flexDirection:'row',
      marginTop:20,
      marginLeft:15,
      marginRight:15,
      gap:10,
    },
    questionOptionView:{
      flex:1,
      height:60,
      backgroundColor:'lightgray',
      borderRadius:25,
      alignItems:'center',
      justifyContent:'center',
      elevation:5,
    },
    option:{
        color:'black',
        fontSize:20,
        fontWeight:'500',
    },
    activateOptionView:{
      backgroundColor:'#3ebb6e'
    },
    activateOption:{
      color:'white'
    },
    
});
  
export default ComplaintScreen;

