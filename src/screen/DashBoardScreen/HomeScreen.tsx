import React, { useState } from 'react';
import {Text, View, StyleSheet, StatusBar, ScrollView, Dimensions, Pressable, GestureResponderEvent} from 'react-native';
import CustomHeader from '../../component/CustomHeader';
import {SafeAreaView} from 'react-native-safe-area-context';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';


const width =  Dimensions.get('window').width;

interface HomeScreenProps {
  navigation: any; 
  mapNumber:number;
}


const HomeScreen: React.FC<HomeScreenProps> = ({navigation , mapNumber}) => {

  
  const handleLocationMap = (mapNumber:number) => {
    navigation.navigate('HelpScreen', { mapNumber: mapNumber}); 
  }

  return (
    <SafeAreaView style={style.homeMain}>
      <StatusBar backgroundColor={'#3ebb6e'} />

      {/* custom header */}
      <CustomHeader name="Secure Signal" icon="bell" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={style.usernameText}>
          <Text style={style.username}>Hello Pratik</Text>
        </View>

        {/* Guardians Contact List */}
        <View style={style.caretakerView}>
          <Text style={style.caretakerText}>My Caretaker</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={style.caretakerScrollView}>
            <View style={style.contactView}>
              <Text style={style.contactText}>+</Text>
            </View>
            <View style={style.contactView}>
              <Text style={style.contactText}>A</Text>
            </View>
            <View style={style.contactView}>
              <Text style={style.contactText}>B</Text>
            </View>
            <View style={style.contactView}>
              <Text style={style.contactText}>C</Text>
            </View>
            <View style={style.contactView}>
              <Text style={style.contactText}>D</Text>
            </View>
            <View style={style.contactView}>
              <Text style={style.contactText}>A</Text>
            </View>
            <View style={style.contactView}>
              <Text style={style.contactText}>A</Text>
            </View>
            <View style={style.contactView}>
              <Text style={style.contactText}>A</Text>
            </View>
          </ScrollView>
        </View>

        {/* Near Police Station */}
        <View style={style.nearEmergencyStationView}>

          <Text style={style.nearEmergencyStationViewText}>
            Near Police Station
          </Text>

          <View style={style.nearEmergencyStationMapView}>
            <View style={style.mapContainer}>
            <MapView
              onPress={() => handleLocationMap(1)}
              style={style.nearStationMap}
              provider={PROVIDER_GOOGLE}
              scrollEnabled={false}
              zoomEnabled={false}
              region={{
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}>
              <Marker coordinate={{latitude: 37.78825, longitude: -122.4324}} >
                  <Icon name='local-police' size={40} color={'#5F4C24'}/>
              </Marker>
            </MapView>
            </View>
          </View>
        </View>

        {/* Near Hospital */}
        <View style={style.nearEmergencyStationView}>
          <Text style={style.nearEmergencyStationViewText}>
            Near Hospital
          </Text>
          <View style={style.nearEmergencyStationMapView}>
           <View style={style.mapContainer}>
            <MapView
              onPress={() => handleLocationMap(2) }
              style={style.nearStationMap}
              provider={PROVIDER_GOOGLE}
              scrollEnabled={false}
              zoomEnabled={false}
              region={{
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}>
              <Marker coordinate={{latitude: 37.78825, longitude: -122.4324}} >
                    <Icon name='local-hospital' size={40} color={'red'}/>
              </Marker>
            </MapView>
           </View>  
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};



const style = StyleSheet.create({
  homeMain: {
    flex: 1,
    backgroundColor: 'white',
  },
  usernameText: {
    marginTop: 10,
  },
  username: {
    fontSize: 30,
    paddingLeft: 20,
    color: 'black',
    fontWeight: '500',
  },
  caretakerView: {
    marginTop: 14,
  },
  caretakerText: {
    fontSize: 25,
    paddingLeft: 20,
    color: 'black',
    fontWeight: '500',
  },
  caretakerScrollView: {
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  contactView: {
    backgroundColor: 'lightblue',
    width: 60,
    height: 60,
    borderRadius: 33,
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 7,
    flex: 1,
    elevation:8,
  },
  contactText: {
    fontSize: 35,
    textAlign: 'center',
  },
  nearEmergencyStationView: {
    marginTop: 10,
    marginBottom:10,
  },
  nearEmergencyStationViewText: {
    fontSize: 25,
    paddingLeft: 20,
    color: 'black',
    fontWeight: '500',
  },
  nearEmergencyStationMapView: {
    marginTop: 10,
    width: width,
    height: 175,
  },
  mapContainer:{
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden', 
    backgroundColor:'black',
    marginLeft:18,
    marginRight:18,
    elevation:8,
  },
  nearStationMap: {
    flex: 1,
  },
});

export default HomeScreen;
