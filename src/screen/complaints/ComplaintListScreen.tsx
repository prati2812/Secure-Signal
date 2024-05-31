import * as React from 'react';
import { Text, View, StyleSheet, StatusBar, ActivityIndicator, FlatList, RefreshControl } from 'react-native';
import CustomHeader from '../../component/CustomHeader';
import { useDispatch, useSelector } from 'react-redux';
import ComplaintsCard from '../../component/ComplaintsCard';
import { COMPLAINT, fetchUserComplaints } from '../../redux/userprofile/action';
import { useState } from 'react';
import { dispatchStore } from '../account/EditProfile';
import { firebase } from '@react-native-firebase/auth';


interface ComplaintListScreenProps {
   navigation:any;
}

const ComplaintListScreen:React.FC<ComplaintListScreenProps> = ({navigation}) => {
  const complaints = useSelector((state:any) => state.userProfile.complaints);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
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
      borderColor={item.complaints.complaintStatus === "Completed" ? '#3ebb6e' : item.complaints.complaintStatus === "Not Completed" ? '#ff0000' : '#d1a500'}    />
  );
  
  const onRefresh = () => {
    setRefreshing(true);
    dispatchStore(fetchUserComplaints(userId));
    setRefreshing(false);
  };




  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#3ebb6e'} />
      <CustomHeader
        name="Complaints"
        backIcon="keyboard-backspace"
        backCall={() => navigation.goBack()}
      />

      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={'#3ebb6e'} />
        </View>
      ) : (
        <FlatList
          data={complaints.sort(
            (
              a: {complaints: {createdAt: string}},
              b: {complaints: {createdAt: string}},
            ) =>
              new Date(b.complaints.createdAt).getTime() -
              new Date(a.complaints.createdAt).getTime(),
          )}
          renderItem={renderComplaint}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{paddingTop: 20, paddingBottom: 10}}
          ListEmptyComponent={
            <View style={{alignItems: 'center'}}>
              <Text style={{fontSize: 25, color: 'black', fontWeight: '700'}}>
                No Complaint
              </Text>
            </View>
          }
          refreshControl={
            <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
            />
          }
          
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
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
});


export default ComplaintListScreen;



