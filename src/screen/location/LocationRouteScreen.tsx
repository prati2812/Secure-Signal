import axios from 'axios';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Text, View, StyleSheet ,StatusBar , ActivityIndicator} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import  poyline from 'google-polyline';
import { useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Geolocation from 'react-native-geolocation-service';
import { useSelector } from 'react-redux';
import { RAPID_API_BASE_URL, X_RAPID_API_HOST, X_RAPID_API_KEY } from '@env';

interface LocationRouteScreenProps {}
const LocationRouteScreen = (props: LocationRouteScreenProps) => {
  const [origin, setOrigin] = useState({ latitude: 0, longitude: 0 });
  const [destination, setDestination] = useState({ latitude: 22.3072, longitude: 73.1812 });
  const [routeData, setRouteData] = useState<{ routes: any[] } | null>(null);
  const [coordinates, setCoordinates] = useState<[number, number][]>([]);
  const nearestPoliceStation = useSelector((state:any) => state.location.nearestPoliceStation);
  const nearestHospital = useSelector((state:any) => state.location.nearestHospital);
  const protectorData = useSelector((state:any) => state.protector.protectorData);
  const route  = useRoute();
  const mapNumber = (route.params as { mapNumber?: number })?.mapNumber;

  useEffect(() => {
     
    if(mapNumber === 1){
      if(nearestPoliceStation !== null){
        const latitude = protectorData.policeStationLocation.latitude;
        const longtitude = protectorData.policeStationLocation.longtitude;
        setDestination({latitude:latitude , longitude:longtitude});
       
      }
    }
    else{
      if(nearestHospital !== null){
        const latitude = nearestHospital.nearestHospital.hospitalLocation.latitude;
        const longtitude = nearestHospital.nearestHospital.hospitalLocation.longtitude;
        setDestination({latitude:latitude , longitude:longtitude});
      }
    }
      
  },[]);
  

  useEffect(() => {
    const currentLocation = () => {
      Geolocation.getCurrentPosition(
        position => {
          setOrigin({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        error => {
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    };
    currentLocation();
  }, []);

  useEffect(() => {
    fetchRouteData();
 },[destination])


 useEffect(() => {
     try{
         if (routeData && routeData.routes && routeData.routes.length > 0) {
             const routeGeometry = routeData.routes[0].geometry;
             const data = poyline.decode(routeGeometry);
             setCoordinates(data); 
            
             
         }
     }
     catch(error){
         console.log(error);
         
     }
     
 }, [routeData]);

  
  const fetchRouteData = async () => {
      
    const options = {
      method: 'GET',
      url: `${RAPID_API_BASE_URL}/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}`,
      params: {
        alternatives: 'true'
      },
      headers: {
        'X-RapidAPI-Key': X_RAPID_API_KEY,
        'X-RapidAPI-Host': X_RAPID_API_HOST
      }
    };

    try {
      const response = await axios.request(options);
      setRouteData(response.data);
    } catch (error) {
      console.error(error);
    }
  }
  

  
  
   


  return (
    <View style={styles.mapContainer}>
      <StatusBar backgroundColor={'green'}/>
      {coordinates.length > 0 ? (
        <MapView
          style={styles.locationMap}
          initialRegion={{
            latitude: (origin.latitude + destination.latitude) / 2,
            longitude: (origin.longitude + destination.longitude) / 2,
            latitudeDelta: Math.abs(origin.latitude - destination.latitude) * 1.5,
            longitudeDelta: Math.abs(origin.longitude - destination.longitude) * 1.5,
          }}
        >
          <Polyline
            coordinates={coordinates.map(coordinate => ({
              latitude: coordinate[0],
              longitude: coordinate[1]
            }))}
            strokeWidth={4}
            strokeColor="blue"
          />
          <Marker
          coordinate={{
            latitude: origin.latitude,
            longitude: origin.longitude,
          }}
          title="Origin"
          description="Starting Point"
        />
        {
          mapNumber == 1 ?
                        <Marker
                          coordinate={{
                              latitude: destination.latitude,
                              longitude: destination.longitude,}}
                              title="Destination"
                              description="End Point">
                                  <Icon name='local-police' size={40} color={'#5F4C24'}/>  
                        </Marker>  
                  : mapNumber == 2 ?
                        <Marker
                          coordinate={{
                              latitude: destination.latitude,
                              longitude: destination.longitude,}}
                              title="Destination"
                              description="End Point">
                                  <Icon name='local-hospital' size={40} color={'red'}/>  
                        </Marker>
                  :
                        <Marker
                          coordinate={{
                              latitude: destination.latitude,
                              longitude: destination.longitude,}}
                              title="Destination"
                              description="End Point" />
                        
        }
        
        </MapView>
      ) : (
             <View style={{flex:1, alignItems:'center' , justifyContent:'center'}}>
               <ActivityIndicator size={45} color={'green'} />
             </View>  
        
      )}
    </View>
  );
};
  


const styles = StyleSheet.create({
    mapContainer: {
      flex:1,
      backgroundColor:'white',
    },
    locationMap:{
      flex:1,  
    }
});
  

export default LocationRouteScreen;
