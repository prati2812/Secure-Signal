import * as React from 'react';
import { Text, View, StyleSheet, StatusBar, ActivityIndicator, FlatList, RefreshControl } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import ComplaintsCard from '../../component/ComplaintsCard';
import { COMPLAINT, fetchUserComplaints } from '../../redux/userprofile/action';
import { useState } from 'react';
import { dispatchStore } from '../account/EditProfile';
import { firebase } from '@react-native-firebase/auth';
import { FAB } from 'react-native-paper';
import ComplaintFilterBottomSheet from '../../component/ComplaintFilterBottomSheet';


interface ComplaintListScreenProps {
   navigation:any;
}

const ComplaintListScreen:React.FC<ComplaintListScreenProps> = ({navigation}) => {
  const complaints = useSelector((state:any) => state.userProfile.complaints);
  const complaintStatus = useSelector((state:any) => state.userProfile.complaintStatus);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isComplaintBottomSheetVisible , setComplaintBottomSheetVisible] = useState(false);
  const userId = firebase.auth().currentUser?.uid;
  
  const dispatch = useDispatch();
 
  const handleDetails = (item:Object) => {
    console.log(item);
    dispatch({
       type:COMPLAINT,
       payload:item,
    })

    navigation.navigate('Complaint');
    
  }


  const getStatusIcon = (item: { complaints: { isInjured: any; complaintStatus: any; policeStationStatus: any; hospitalStatus: any; }; }) => {
    const { isInjured, complaintStatus, policeStationStatus, hospitalStatus } = item.complaints;
    

    if (complaintStatus === 'Completed') {
      return 'thumbs-up';
    }
  
    if (complaintStatus === 'NotCompleted') {
      return 'thumbs-down';
    }
  
    if(complaintStatus === "pending" && isInjured === "No"){
        if(!policeStationStatus){
           return 'clock';
        }
        else if(policeStationStatus && (policeStationStatus === "Not Completed")){
           return 'window-close'; 
        }
        return 'thumbs-down';
    }
    if(complaintStatus === "pending" && isInjured === "Yes"){
       if(!policeStationStatus && !hospitalStatus){
          return 'clock';
       }
       else if((policeStationStatus || hospitalStatus) && 
            ((policeStationStatus === "Completed" || policeStationStatus === "Not Completed") || 
              (hospitalStatus === "Completed" || hospitalStatus === "Not Completed"))){
                 return 'thumbs-down';
       }

    }
  
    return 'clock'; 
  };

  const getStatusColor = (item: { complaints: { isInjured: any; complaintStatus: any; policeStationStatus: any; hospitalStatus: any; }; }) => {
    const { isInjured, complaintStatus, policeStationStatus, hospitalStatus } = item.complaints;
    

    if (complaintStatus === 'Completed') {
      return 'green';
    }
  
    if (complaintStatus === 'NotCompleted') {
      return 'red';
    }
  
    if(complaintStatus === "pending" && isInjured === "No"){
        if(!policeStationStatus){
           return '#e1ad01';
        }
        else if(policeStationStatus && (policeStationStatus === "Completed" || policeStationStatus === "Not Completed")){
           return 'red'; 
        }
    }
    if(complaintStatus === "pending" && isInjured === "Yes"){
       if(!policeStationStatus && !hospitalStatus){
          return '#e1ad01';
       }
       else if((policeStationStatus || hospitalStatus) && 
            ((policeStationStatus === "Completed" || policeStationStatus === "Not Completed") || 
              (hospitalStatus === "Completed" || hospitalStatus === "Not Completed"))){
                 return 'red';
       }

    }
  
    return '#e1ad01'; 
  };

  
  const renderComplaint = ({ item }: { item: any }) => (
   
    <ComplaintsCard
      icon={'person'}
      message={item.complaints.complaint.trim()}
      time={new Date(item.complaints.createdAt).toLocaleDateString('en-GB') +
        ' ' +
        new Date(item.complaints.createdAt).toLocaleTimeString()}
      color={'#3ebb6e'}
      isRead={true}
      handleDetails={() => handleDetails(item)} 
      statusIcon={getStatusIcon(item)}
      statusIconColor={getStatusColor(item)}/>
  );
  
  const onRefresh = () => {
    setRefreshing(true);
    dispatchStore(fetchUserComplaints(userId));
    setRefreshing(false);
  };


  const filteredComplaints = complaints.filter((item: { complaints: {
    hospitalStatus: any;
    policeStationStatus: any; complaintStatus:any; 
}; }) => {
    if (complaintStatus === 'All') return true;
    else if(complaintStatus === "Accepted"){
      return item.complaints.complaintStatus === "Completed" && complaintStatus === "Accepted";
    }
    else if(complaintStatus === "Rejected"){
      return (item.complaints.complaintStatus === "Not Completed" || item.complaints.complaintStatus === "pending") && (item.complaints.policeStationStatus || item.complaints.hospitalStatus) && complaintStatus === "Rejected";
    }
    else if(complaintStatus === "Pending"){
      return item.complaints.complaintStatus === "pending" && (!item.complaints.policeStationStatus && !item.complaints.hospitalStatus) && complaintStatus === "Pending";
    } 
    
  
  });


  return (
    <>
    <View style={styles.container}>
      <StatusBar backgroundColor={'#3ebb6e'} />
     

      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={'#3ebb6e'} />
        </View>
      ) : (
        <><FlatList
            data={filteredComplaints.sort(
              (
                a: { complaints: { createdAt: string; }; },
                b: { complaints: { createdAt: string; }; }
              ) => new Date(b.complaints.createdAt).getTime() -
                new Date(a.complaints.createdAt).getTime()
            )}
            renderItem={renderComplaint}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ paddingTop: 20, paddingBottom: 10 }}
            ListEmptyComponent={<View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 25, color: 'black', fontWeight: '700' }}>
                No Complaint
              </Text>
            </View>}
            refreshControl={<RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh} />}

            showsVerticalScrollIndicator={false} />
            
            
            {
               complaints.length > 0 && 
               <FAB
               style={styles.fab}
               icon="filter-outline"
               color='white'
               onPress={() => setComplaintBottomSheetVisible(true)} />
 
            }
            </>
      )}
    </View>
    {
       isComplaintBottomSheetVisible && <ComplaintFilterBottomSheet setComplaintBottomSheetVisible={setComplaintBottomSheetVisible} />
    }
    </>
  );
};



const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 20,
    right: 0,
    bottom: 25,
    backgroundColor:'#3ebb6e',
    borderRadius:30,
  },
});


export default ComplaintListScreen;



