import React from 'react';
import {Text, View, StyleSheet, StatusBar, ScrollView, Dimensions, Pressable, GestureResponderEvent} from 'react-native';
import CustomHeader from '../component/CustomHeader';
import {SafeAreaView} from 'react-native-safe-area-context';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';

const width =  Dimensions.get('window').width;

const HomeScreen = () => {

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
              <Text style={style.contactText}>A</Text>
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
            <View style={style.contactView}>
              <Text style={style.contactText}>A</Text>
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
            <MapView
              style={style.nearStationMap}
              provider={PROVIDER_GOOGLE}
              region={{
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}>
              <Marker coordinate={{latitude: 37.78825, longitude: -122.4324}} />
            </MapView>
          </View>
        </View>

        {/* Near Hospital */}
        <View style={style.nearEmergencyStationView}>
          <Text style={style.nearEmergencyStationViewText}>
            Near Police Station
          </Text>
          <View style={style.nearEmergencyStationMapView}>
            <MapView
              style={style.nearStationMap}
              provider={PROVIDER_GOOGLE}
              region={{
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}>
              <Marker coordinate={{latitude: 37.78825, longitude: -122.4324}} />
            </MapView>
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
    marginBottom: 10,
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
  },
  contactText: {
    fontSize: 35,
    textAlign: 'center',
  },
  nearEmergencyStationView: {
    marginTop: 10,
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
    height: 170,
  },
  nearStationMap: {
    flex: 1,
    marginLeft: 18,
    marginRight: 18,
    borderRadius: 100,
  },
});

export default HomeScreen;
