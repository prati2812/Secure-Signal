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
  
  const [isVictim , setVictimButton] = useState(false);
  const [isWitness , setWitnessButton] = useState(false);
  const [query , setQuery] = useState('');
  const imageUri = useSelector((state:any) => state.userProfile.imageUri);
  const nearestPoliceStation = useSelector((state:any) => state.location.nearestPoliceStation);
  const nearestHospital = useSelector((state:any) => state.location.nearestHospital);
  const protectorData = useSelector((state:any) => state.protector.protectorData);
  const mapNumber = route.params?.mapNumber ?? undefined;
  
 
  console.log(protectorData);
  
  
 
  
  const handleVictim = () => {
     setVictimButton(true);
     setWitnessButton(false);
     setQuery("I'm a victim");
  }

  const handleWitness = () => {
     setVictimButton(false);
     setWitnessButton(true);
     setQuery("I'm a witness");
  }

  const handleHelpButton = () => {
    if(query){
      navigation.navigate('HelpDescription' , {query , mapNumber});
    }
  }

  const handleLocationMap = () => {
    if(mapNumber !== undefined){
      navigation.navigate('LocationRouting' , {mapNumber});
      // Linking.openURL('geo:21.145345,72.7567583;u=35');
    }
  }
   
    
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
          <Text style={styles.whatHappenedText}>What {'\n'}happened ?</Text>
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
                latitude: mapNumber === 1 ? 
                            protectorData && protectorData.policeStationLocation ? 
                            protectorData.policeStationLocation.latitude : 37.78825 : 
                            protectorData && protectorData.hospitalLocation ? protectorData.hospitalLocation.latitude : 37.78825,
                longitude: mapNumber === 1 ? 
                           protectorData && protectorData.policeStationLocation ? 
                           protectorData.policeStationLocation.longtitude : -122.4324 :
                           protectorData && protectorData.hospitalLocation ? protectorData.hospitalLocation.longtitude : -122.4324  ,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}>
              {
                <Marker coordinate={{latitude: mapNumber === 1 ? 
                                              protectorData && protectorData.policeStationLocation ? 
                                              protectorData.policeStationLocation.latitude : 37.78825 : 
                                              protectorData && protectorData.hospitalLocation ? protectorData.hospitalLocation.latitude : 37.78825, 
                                     longitude: mapNumber === 1 ? 
                                                protectorData && protectorData.policeStationLocation ? 
                                                protectorData.policeStationLocation.longtitude : -122.4324 :
                                                protectorData && protectorData.hospitalLocation ? protectorData.hospitalLocation.longtitude : -122.4324}}>
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
          <Pressable onPress={() => handleVictim()}>
            <View
              style={[styles.queryBtn, isVictim && styles.activeBackground]}>
              <Text>
                <Icon
                  name="warning"
                  size={35}
                  style={[styles.icon, isVictim && styles.activeIcon]}
                />
              </Text>
              <Text
                style={[styles.textStyle, isVictim && styles.activeTextStyle]}>
                I'm a{'\n'}victim
              </Text>
            </View>
          </Pressable>

          <Pressable onPress={() => handleWitness()}>
            <View
              style={[styles.queryBtn, isWitness && styles.activeBackground]}>
              <Text>
                <Icon
                  name="visibility"
                  size={35}
                  style={[styles.icon, isWitness && styles.activeIcon]}
                />
              </Text>
              <Text
                style={[styles.textStyle, isWitness && styles.activeTextStyle]}>
                I'm a{'\n'}witness
              </Text>
            </View>
          </Pressable>
        </View>

        <Pressable onPress={() => handleHelpButton()}>
          <View style={styles.helpBtnView}>
            <View style={[styles.helpBtn , !query && {backgroundColor:'#FDA993'}]}>
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
    fontSize: 33,
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
    width:100, 
    backgroundColor:'lightgray' , 
    height:110, 
    borderRadius:20, 
    overflow:'hidden',
    elevation:5,
    alignItems:'center',
    justifyContent:'center', 
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
    marginTop:'15%',
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
