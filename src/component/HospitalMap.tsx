import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';

interface HospitalMapProps {
  onMarkerPress: (station: any) => void;
}

const HospitalMap:React.FC<HospitalMapProps> = ({onMarkerPress}) => {

  const nearestHospital = useSelector((state:any) => state.location.nearestHospital);  
  return (
    <>
       {
                  nearestHospital && nearestHospital.nearestHospital &&
                   nearestHospital.nearestHospital.map((station: any)=> (
                    <Marker
                    key={station.id}
                    onPress={() => onMarkerPress(station)}
                    coordinate={{
                      latitude: station && station.hospitalLocation
                          ?  station.hospitalLocation.latitude
                          : 37.78825,
                      longitude: station && station.hospitalLocation 
                          ? station.hospitalLocation.longtitude
                          : -122.4324,
                    }}>
                    <Icon name="local-hospital" size={40} color={'#008ECC'} />
                  </Marker>
                    
                   ))
        }
    </>
  );
};

export default HospitalMap;

const styles = StyleSheet.create({
  container: {}
});
