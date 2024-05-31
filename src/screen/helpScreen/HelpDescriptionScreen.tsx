import { firebase } from '@react-native-firebase/auth';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Text, View, StyleSheet , Pressable , Image, ScrollView, TouchableOpacity, ActivityIndicator} from 'react-native';
import ImagePicker, { openPicker } from 'react-native-image-crop-picker';
import { TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import Geolocation from 'react-native-geolocation-service';
import instance from '../../axios/axiosInstance';
import CustomHeader from '../../component/CustomHeader';



interface ImageInfo {
  uri: string;
  width: number;
  height: number;
  mime: string;
  path: string;
}

interface HelpDescriptionScreenProps {
    navigation: any,
    route: any,
}

const HelpDescriptionScreen: React.FC<HelpDescriptionScreenProps> = ({navigation,route}) => {

    const [isYes , setYesButton] = useState(false);
    const [isNo , setNoButton] = useState(true);
    const [isInjured , setInjured] = useState('No');
    const [complaint, setComplaint] = useState('');
    const [uri , setUri] = useState<ImageInfo[]>([]);
    const [complaint_location, setComplaintLocation] = useState({ latitude: 0, longitude: 0 });
    const [isIndicatorVisible, setIndicatorVisible] = useState(false);
    const nearestPoliceStation = useSelector((state:any) => state.location.nearestPoliceStation);
    const nearestHospital = useSelector((state:any) => state.location.nearestHospital); 
    const userName  = useSelector((state : any) => state.userProfile.userName);
    const protectorData = useSelector((state:any) => state.protector.protectorData);

    const token = useSelector((state : any) => state.userProfile.token);
    const complaintBy = route.params?.query;
    const userId = firebase.auth().currentUser?.uid;
    const phoneNumber = firebase.auth().currentUser?.phoneNumber;
    const mapNumber = route.params?.mapNumber;
    
        
    
    

    useEffect(() => {  
      
      currentLocation();  
      
    },[complaint_location]);


    // Get current user location
    const currentLocation = () => {
      Geolocation.getCurrentPosition(
        position => {
          setComplaintLocation({latitude:position.coords.latitude , longitude:position.coords.longitude});
        },
        error => {
          console.log(error.code, error.message);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    };  


    const handleYes = () => {
        setYesButton(true);
        setNoButton(false);
        setInjured('Yes');
    }

    const handleNo = () => {
        setYesButton(false);
        setNoButton(true);
        setInjured('No');
    }


    // Select Images
    const handleUploadPhotos = () => {
      ImagePicker.openPicker({
        multiple: true,
      }).then(images => {
        const formattedImages = images.map((image: any) => ({
          uri: image.path,
            width: image.width,
            height: image.height,
            mime: image.mime,
            path: image.path,
        }));
        setUri(prevUris => [...prevUris, ...formattedImages]);
      });           
    }

    // Remove image from selected image list
    const removeImage = (data:number) => {
         let newDataList;
         newDataList = uri.filter((item , index) => index!== data);   
         setUri(newDataList);      
    }

    const handleHelpConfirmation = async() => {
   
        setIndicatorVisible(true);
        
        const complaintData = new FormData();
        if(uri){
          for(const image of uri){
            const fileName = image.path.replace('file:///data/user/0/com.reactdemo/cache/react-native-image-crop-picker/' , '');
            complaintData.append('image' , {
              uri: image.path,
              type: image.mime,
              name: fileName,
            });
              
          }      
        } 

        let policeStationId;
        if(mapNumber === 1){
           policeStationId = protectorData.id;
        }
        else{
          const smallestDistanceStation = nearestPoliceStation.nearestPoliceStation.reduce((prev: { distance: number; }, curr: { distance: number; }) => {
            return (prev.distance < curr.distance) ? prev : curr;
          });
          policeStationId = smallestDistanceStation.id;
            
        } 

        let hospitalId;
        if(mapNumber === 2){
             hospitalId = protectorData.id;
        }
        else{
             const smallestDistance = nearestHospital.nearestHospital.reduce((prev: { distance: number; }, curr: { distance: number; }) => {
               return (prev.distance < curr.distance) ? prev : curr;
             });
             hospitalId = smallestDistance.id; 
        }
        console.log(policeStationId , hospitalId);
        
        complaintData.append('policeStationId' , policeStationId);
        complaintData.append('hospitalId', hospitalId);
        complaintData.append('phoneNumber', phoneNumber);
        complaintData.append('userId', userId);
        complaintData.append('complaintBy', complaintBy);
        complaintData.append('complaint', complaint);
        complaintData.append('isInjured', isInjured);
        complaintData.append(
          'complaint_location',
          JSON.stringify({"latitude": complaint_location.latitude , "longtitude": complaint_location.longitude}),
        );
        

      try{

        const response = await instance.post('/uploadComplaints', complaintData);

        if(response.status === 200){
          
          let policeStationId;
          if(mapNumber === 1){
             policeStationId = protectorData.id;
          }
          else{
            const smallestDistanceStation = nearestPoliceStation.nearestPoliceStation.reduce((prev: { distance: number; }, curr: { distance: number; }) => {
              return (prev.distance < curr.distance) ? prev : curr;
            });
            policeStationId = smallestDistanceStation.id;
              
          } 
           const title = 'Complaint';
           const body = 'Complaint sent by '
           const response = await instance.post('/sendComplaintNotification' , {policeStationId , userName , title , body});
     
           if(response.status === 200){
             console.log("complaint , sent");
           }
           else{
             console.log("fail");
             
           }
           
           if(isInjured === "Yes"){
          
             let hospitalId;
             if(mapNumber === 2){
                  hospitalId = protectorData.id;
             }
             else{
                  const smallestDistance = nearestHospital.nearestHospital.reduce((prev: { distance: number; }, curr: { distance: number; }) => {
                    return (prev.distance < curr.distance) ? prev : curr;
                  });
                  hospitalId = smallestDistance.id; 
             }

            const title = 'Complaint';
            const body = 'Complaint sent by '
            const response = await instance.post('/hospital/complaint/sendNotification' , {hospitalId , userName , title , body});
      
            if(response.status === 200){
              console.log("complaint sent to hospital");
            }
            else{
              console.log("fail");
              
            }
           }
     
           setIndicatorVisible(false);
           navigation.navigate('HelpConfirmation');
        }
        else{
            setIndicatorVisible(false);
            console.log("Some problem occured");
            
        }

      }
      catch(err){
        setIndicatorVisible(false);
        console.log(err);
        
      }

        
        

        
    }

    const isDisabled = (!complaint && uri.length === 0) || isIndicatorVisible;

  return (
    <SafeAreaView style={styles.helpDescriptionMain}>
      <CustomHeader
          name={complaintBy}
          backIcon={'keyboard-backspace'}
          backCall={() => navigation.goBack()}
        />  
    
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.whatHappenedView}>
          <Text style={styles.whatHappenedText}>What happened ?</Text>
        </View>

         {/* Complain Chat Box */}
        <View style={styles.multiLineTextInputView}>
              <TextInput
                multiline={true}
                numberOfLines={5}
                placeholder='Enter Complain'
                underlineColorAndroid ='rgba(0,0,0,0)'
                activeUnderlineColor='transparent'
                underlineColor='transparent'
                style={styles.multiLineTextInput}
                onChangeText={(text) => setComplaint(text)}
                value={complaint}
              />
        </View>

        {/* selected images */}
        <ScrollView
           horizontal
           showsHorizontalScrollIndicator={false} 
           style={styles.dataScrollView}> 
          <> 
          { 
            
             uri.length ?
              
                  uri.map((item , index) => (
                    
                    <View style={styles.dataShowView} key={index}>

                      <View style={styles.dataImageView}>
  
                         <Image
                            source={{ uri: item.path }}
                            resizeMode='cover'
                            style={styles.imageView} />
  
                              <TouchableOpacity style={styles.imageCloseIcon} onPress={() => removeImage(index)}>
                                <Icon name='close' size={25} color={'white'} />
                              </TouchableOpacity>
  
  
                      </View>
                    </View>
                  ))  
                
              : null
          }
          </>
        </ScrollView> 

         {/* Upload a photos */}
        <TouchableOpacity style={styles.uploadDataView}
            onPress={()=> handleUploadPhotos()}>
             <TouchableOpacity
                style={styles.uploadPhotoView} 
                onPress={() => handleUploadPhotos()}>
                  <Text style={styles.uploadPhotoText}>
                       Select photos
                  </Text>
             </TouchableOpacity>
        </TouchableOpacity>

         {/* Divider  */}
        <View style={styles.divder}></View>

        <View style={styles.questionTextView}>
              <Text style={styles.questionText}>
                   Is anyone injured?
              </Text>
        </View>

        <View style={styles.questionOptionSelectionView}>
             
             <Pressable onPress={() => handleYes()} style={{flex:1}}>
              <View style={[styles.questionOptionView , isYes && styles.activateOptionView]}>
                   <Text style={[styles.option , isYes && styles.activateOption]}>
                         Yes
                   </Text>
              </View>
              </Pressable>

              <Pressable onPress={()=> handleNo()} style={{flex:1}}>
              <View style={[styles.questionOptionView , isNo && styles.activateOptionView]}>
                   <Text style={[styles.option , isNo && styles.activateOption]}>
                         No 
                   </Text>
              </View>
              </Pressable>

        </View>

        <View style={styles.helpSubmitBtnView}>
              <Pressable onPress={()=> handleHelpConfirmation()}
                disabled={isDisabled}>
              <View style={[styles.helpSubmitBtn , isDisabled && {backgroundColor:'#FDA993'}]}>
                 {
                    isIndicatorVisible ? <ActivityIndicator size={25} color={'white'}/>
                    :   <Text style={styles.helpSubmitText}>
                           I need help
                        </Text>                  
                 }  
                     
              </View>
              </Pressable>    
        </View>


        


      </ScrollView>
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
      helpDescriptionMain: {
         flex:1,
         backgroundColor:'white',
      },
      backPressBtnContainer: {
        flexDirection: 'row',
        padding: 10,
      },
      backPressBtnView: {
        marginTop: 1,
        width: 55,
        height: 55,
        backgroundColor: 'white',
        marginLeft: 15,
        borderRadius: 15,
        elevation: 6,
        alignItems: 'center',
        justifyContent: 'center',
      },
      profileBtnView: {
        marginTop: 1,
        width: 70,
        height: 70,
        backgroundColor: 'white',
        marginRight: 15,
        borderRadius: 47,
        elevation: 6,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      },
      profileImage: {
        width: '100%',
        height: '100%',
        alignSelf: 'center',
        aspectRatio: 1,
      },
      queryText:{
        alignSelf:'center', 
        marginHorizontal:80,
        fontSize:22,
        color:'black',
      },
      whatHappenedView:{
        marginTop:30,
        marginLeft:15, 
      },
      whatHappenedText:{
        paddingLeft:10,
        color:'black',
        fontWeight:'600',
        fontSize:18,
      },
      multiLineTextInputView:{
        marginTop:10,
        marginLeft:15,
        marginRight:15,
        backgroundColor:'lightgray',
        height:150,
        borderRadius:25,
        overflow:'hidden',
        elevation:5,
      },
      multiLineTextInput:{
        backgroundColor:'lightgray' , 
      },
      uploadDataView:{
         marginTop:15, 
         flexDirection:'row',
         marginLeft:10,
         marginRight:10,
         padding:10,
      },
      uploadPhotoView:{
         flex:4,
         paddingLeft:15,
         height:70,
         backgroundColor:'white',
         marginRight:10,
         borderRadius:25,
         borderColor:'green',
         borderWidth:2,
         alignItems:'center',
         justifyContent:'center',
         elevation:5,
      },
      uploadPhotoText:{
         fontSize:20,
         color:'black',
         fontWeight:'500',
      },
      dataScrollView:{
        marginTop:20, 
        marginLeft:20 , 
        flexDirection:'row',
        marginRight:20,
      },
      dataShowView:{
        margin:5
      },
      dataImageView:{ 
        width: 100, 
        height: 100, 
        backgroundColor: 'lightblue', 
        borderRadius: 20, 
        elevation: 6, 
        marginRight:8, 
        margin:5
      },
      imageView:{
        flex: 1, 
        borderRadius: 20,
      },
      imageCloseIcon: { 
        top: -6, 
        right: -6, 
        position: 'absolute', 
        backgroundColor: 'red', 
        borderRadius: 20, 
      },
      divder:{
         marginTop:15,
         marginLeft:20,
         marginRight:20,
         height:2,
         backgroundColor:'lightgray',
         fontWeight:'bold',
      },
      questionTextView:{
        marginTop:10,
        marginLeft:15,
      },
      questionText:{
        paddingLeft:5,
        fontSize:15,
        color:'black',
        fontWeight:'600',
      },
      questionOptionSelectionView:{
        flexDirection:'row',
        marginTop:10,
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
      helpSubmitBtnView:{
         marginTop:50,
         marginLeft:15,
         marginRight:15,
         marginBottom:10,
      },
      helpSubmitBtn:{
         height:60,
         backgroundColor:'#FB6D48',
         borderRadius:22,
         alignItems:'center',
         justifyContent:'center',
         elevation:5,
      },
      helpSubmitText:{
         color:'white',
         fontSize:18,
         fontWeight:'500',
      }
     
});

export default HelpDescriptionScreen;


