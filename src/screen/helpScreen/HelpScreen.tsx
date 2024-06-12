import React, {useState , useEffect, useCallback} from 'react';
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  Pressable,
  Image,
  ScrollView,
  Dimensions,
  BackHandler,
  NativeEventEmitter,
  NativeModules,
  Linking,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconFont from 'react-native-vector-icons/FontAwesome';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import { useSelector } from 'react-redux';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import CustomHeader from '../../component/CustomHeader';


const width = Dimensions.get('window').width;

interface HelpScreenProps {
  navigation: any;
  route: any;
}



const HelpScreen: React.FC<HelpScreenProps> = ({navigation , route}) => {
  
  const [complaintType, setComplaintType] = useState({
    isVictim: false,
    isWitness: false,
    query: '',
  });

  const protectorData = useSelector((state:any) => state.protector.protectorData);
  const mapNumber = route.params?.mapNumber ?? undefined;
   
  const handleComplaint = (role:string) => {
    if(mapNumber === 1){
      if(role === "Victim"){
        setComplaintType({
           isVictim:true,
           isWitness:false,
           query:"I'm a victim"
        })
      }
      else if(role === "Witness"){
        setComplaintType({
          isVictim:false,
          isWitness:true,
          query:"I'm a witness"
        })  
      } 
    }
    else if(mapNumber === 2){
      if(role === "Victim"){
        setComplaintType({
           isVictim:true,
           isWitness:false,
           query:"I'm a injured"
        })
      }
      else if(role === "Witness"){
        setComplaintType({
          isVictim:false,
          isWitness:true,
          query:"Someone is injured"
        })  
      }
    }
     
  }

  const handleHelpButton = () => {
    if(complaintType.query){
      let query = complaintType.query;
      navigation.navigate('HelpDescription' , {query , mapNumber});
    }
  }

  const handleLocationMap = () => {
    if(mapNumber !== undefined){
      navigation.navigate('LocationRouting' , {mapNumber});
      // Linking.openURL('geo:21.145345,72.7567583;u=35');
    }
  }

  const getProtectorLocation = (mapNumber : number) => {
    if (mapNumber === 1 &&  protectorData && protectorData.policeStationLocation) {
      return protectorData.policeStationLocation;
    }
    if (mapNumber === 2 && protectorData && protectorData.hospitalLocation) {
      return protectorData.hospitalLocation;
    }
    return { latitude: 37.78825, longtitude: -122.4324 };
  }
  
  
  const location = getProtectorLocation(mapNumber);
  console.log(location);
  
    
  return (
    <SafeAreaView style={styles.helpScreenMain}>
      <StatusBar backgroundColor={'#3ebb6e'} />
      <CustomHeader
          name={'Complaint'}
          backIcon={'keyboard-backspace'}
          backCall={() => navigation.goBack()}
        />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.whatHappenedView}>
          <Text style={styles.whatHappenedText}>What happened ?</Text>
        </View>

        {/* location map */}
        <View style={styles.locationMapView}>
          <Pressable
            style={styles.locationmapContainer}
            onPress={() => handleLocationMap()}>
            <MapView
              style={styles.locationMap}
              provider={PROVIDER_GOOGLE}
              scrollEnabled={false}
              zoomEnabled={false}
              region={{
                latitude: location.latitude,
                longitude: location.longtitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}>
              {
                <Marker coordinate={{latitude: location.latitude, 
                                     longitude: location.longtitude}}>
                  {mapNumber === 1 ? (
                    <Icon name="local-police" size={40} color={'#5F4C24'} />
                  ) : mapNumber === 2 ? (
                    <Icon name="local-hospital" size={40} color={'red'} />
                  ) : (
                    <Marker
                      coordinate={{latitude: 37.78825, longitude: -122.4324}}
                    />
                  )}
                </Marker>
              }
            </MapView>
          </Pressable>
        </View>

        {/* Query Button */}
        <View style={styles.queryBtnView}>
          <Pressable onPress={() => handleComplaint("Victim")}>
            <View
              style={[styles.queryBtn, complaintType.isVictim && styles.activeBackground]}>
              <Text>
                <Icon
                  name="warning"
                  size={35}
                  style={[styles.icon, complaintType.isVictim && styles.activeIcon]}
                />
              </Text>
              <Text
                style={[styles.textStyle, complaintType.isVictim && styles.activeTextStyle]}>
                { mapNumber === 1 ? "I'm a victim" : "I'm a injured"}  
                
              </Text>
            </View>
          </Pressable>

          <Pressable onPress={() => handleComplaint("Witness")}>
            <View
              style={[styles.queryBtn, complaintType.isWitness && styles.activeBackground]}>
              <Text>
                <Icon
                  name="visibility"
                  size={35}
                  style={[styles.icon, complaintType.isWitness && styles.activeIcon]}
                />
              </Text>
              <Text
                style={[styles.textStyle, complaintType.isWitness && styles.activeTextStyle]}>
                {
                  mapNumber === 1 ? "I'm a witness" : "Someone is injured"
                }  
                
              </Text>
            </View>
          </Pressable>
        </View>

        <Pressable onPress={() => handleHelpButton()}>
          <View style={styles.helpBtnView}>
            <View style={[styles.helpBtn , !complaintType.query && {backgroundColor:'#FDA993'}]}>
              <Text>
                <IconFont name="bell" size={30} color={'white'} />
              </Text>
              <Text style={styles.helpBtnStyle}>Help</Text>
            </View>
          </View>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  helpScreenMain: {
    flex: 1,
    backgroundColor: 'white',
  },
  whatHappenedView: {
    marginTop: 20,
    marginLeft:10,
  },
  whatHappenedText: {
    marginLeft: 24,
    fontSize: 25,
    color: 'black',
    fontWeight: '600',
  },
  locationMapView: {
    marginTop: 10,
    width: width,
    height: 340,
    padding: 10,
  },
  locationmapContainer: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    marginLeft: 18,
    marginRight: 18,
    elevation: 5,
  },
  locationMap:{
    flex:1,
  },
  queryBtnView:{
    flexDirection:'row',
    marginTop:5,
    justifyContent:'space-around',
    padding:10,
  },
  queryBtn:{
    backgroundColor:'lightgray' ,  
    borderRadius:10, 
    overflow:'hidden',
    elevation:5,
    alignItems:'center',
    justifyContent:'center', 
    flexDirection:'row',
    padding:10,
    gap:5
  },
  textStyle:{
    fontSize:18,
    textAlign:'center',
    color:'black', 
  },
  activeBackground:{
    backgroundColor:'#3ebb6e',
  },
  icon:{
    color:'black',
  },
  activeIcon:{
    color:'white',
  },
  activeTextStyle:{
    color:'white',
  },
  helpBtnView:{
    marginTop:'10%',
    marginBottom:10,
  },
  helpBtn:{
    backgroundColor:'#FB6D48',
    padding:13,
    marginLeft:24,
    marginRight:24,
    borderRadius:25,
    alignItems:'center',
    justifyContent:'center',
    flexDirection:'row',
    gap:10,
    elevation:5,
  },
  helpBtnStyle:{
    color:'white',
    fontSize:20,
    fontWeight:'600',
  }

});

export default HelpScreen;
