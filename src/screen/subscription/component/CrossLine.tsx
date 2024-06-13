import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';


const { width, height } = Dimensions.get('window');

const CrossLine = () => {
  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <Text style={styles.bannerText}>subscribed</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: width * 0.3,
    height: height * 0.1,
    overflow: 'hidden',
    transform:[{ rotate: "360deg" }]
  },
  banner: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'red',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderBottomLeftRadius: 10,
  },
  bannerText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CrossLine;