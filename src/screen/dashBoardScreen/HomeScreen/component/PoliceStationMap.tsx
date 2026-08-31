import * as React from 'react';
import { StyleSheet } from 'react-native';
import {Marker} from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';

interface PoliceStationMapProps {
  onMarkerPress: (station: any) => void;
}

const PoliceStationMap:React.FC<PoliceStationMapProps> = ({onMarkerPress}) => {
 
 const [isInfoSheetVisible , setInfoSheetVisible] = React.useState(false); 
 const nearestPoliceStation = useSelector((state:any) => state.location.nearestPoliceStation);  
 
  return (
      <>
         {nearestPoliceStation &&
                      nearestPoliceStation.nearestPoliceStation &&
                      nearestPoliceStation.nearestPoliceStation.map(
                        (station: any) => (
                          <Marker
                            key={station.id}
                            onPress={() => onMarkerPress(station)}
                            coordinate={{
                              latitude:
                                station && station.policeStationLocation
                                  ? station.policeStationLocation.latitude
                                  : 37.78825,
                              longitude:
                                station && station.policeStationLocation
                                  ? station.policeStationLocation.longtitude
                                  : -122.4324,
                            }}>
                            <Icon
                              name="local-police"
                              size={40}
                              color={'#5F4C24'}
                            />
                          </Marker>
                        ),
          )}
          
         
                    
      </>
  );
};

export default PoliceStationMap;

const styles = StyleSheet.create({
  container: {}
});
