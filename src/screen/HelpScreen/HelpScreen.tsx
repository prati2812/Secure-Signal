import React, {useState , useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  Pressable,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconFont from 'react-native-vector-icons/FontAwesome';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import { useRoute } from '@react-navigation/native';

const width = Dimensions.get('window').width;

interface HelpScreenProps {
  navigation: any;
}

const HelpScreen: React.FC<HelpScreenProps> = ({navigation}) => {
  
  const [isVictim , setVictimButton] = useState(false);
  const [isWitness , setWitnessButton] = useState(false);
  const [query , setQuery] = useState('');

  const route  = useRoute();
  const mapNumber = route.params?.mapNumber;

  console.log("numberr" , mapNumber);
  
 
  
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
      navigation.navigate('HelpDescription' , {query});
    }
  }
   
    
  return (
    <SafeAreaView style={styles.helpScreenMain}>
      <StatusBar backgroundColor={'white'} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile */}
        <View style={styles.backPressBtnContainer}>
        <Pressable onPress={() => navigation.navigate('Home')}>
          <View style={styles.backPressBtnView}>
           
              <Text>
                <Icon name="arrow-back" size={35} color={'black'} />
              </Text>
          </View>
          </Pressable>  

          <View style={styles.profileBtnView}>
            <Pressable onPress={() => navigation.navigate('Profile')}>
              <Image
                resizeMode="cover"
                source={require('../../assets/image/boy.png')}
                style={styles.profileImage}
              />
            </Pressable>
          </View>
        </View>

        <View style={styles.whatHappenedView}>
          <Text style={styles.whatHappenedText}>What {'\n'}happened ?</Text>
        </View>

        {/* location map */}
        <View style={styles.locationMapView}>
          <Pressable style={styles.locationmapContainer} onPress={() => navigation.navigate('LocationRouting')}>
            <MapView
              style={styles.locationMap}
              provider={PROVIDER_GOOGLE}
              scrollEnabled={false}
              zoomEnabled={false}
              region={{
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}>
              {
                 mapNumber == 1 ?
                        <Marker coordinate={{latitude: 37.78825, longitude: -122.4324}}>
                             <Icon name='local-police' size={40} color={'#5F4C24'}/>
                        </Marker>         
                    : mapNumber == 2 ?
                    <Marker coordinate={{latitude: 37.78825, longitude: -122.4324}}>
                             <Icon name='local-hospital' size={40} color={'red'}/>
                    </Marker> : 
                      <Marker coordinate={{latitude: 37.78825, longitude: -122.4324}}/>
                     
              }  
              
            </MapView>
          </Pressable>
        </View>


        {/* Query Button */}
        <View style={styles.queryBtnView}>

            <Pressable onPress={() => handleVictim()}>
            <View style={[styles.queryBtn , isVictim && styles.activeBackground]}>
                <Text>
                    <Icon name="warning" size={35} style={[styles.icon , isVictim && styles.activeIcon]}/>
                </Text>
                <Text style={[styles.textStyle , isVictim && styles.activeTextStyle]}>
                      I'm a{"\n"}victim
                </Text>
            </View>
            </Pressable>

            <Pressable onPress={() => handleWitness()}>
            <View style={[styles.queryBtn , isWitness && styles.activeBackground]}>
                <Text>
                    <Icon name="visibility" size={35} style={[styles.icon , isWitness && styles.activeIcon]}/>
                </Text>
                <Text style={[styles.textStyle , isWitness && styles.activeTextStyle]}>
                      I'm a{"\n"}witness
                </Text>
                  
            </View>
            </Pressable>    
        </View>

        <Pressable onPress={()=> handleHelpButton()}> 
        <View style={styles.helpBtnView}>
             <View style={styles.helpBtn}>
                  <Text>
                        <IconFont name='bell' size={30} color={'white'}/>
                  </Text>
                  <Text style={styles.helpBtnStyle}>
                       Help
                  </Text>
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
  backPressBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  whatHappenedView: {
    marginTop: 10,
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
    marginTop:12,
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
