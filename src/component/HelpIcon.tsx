//import liraries
import React, { Component, version } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Svg ,Path, G } from 'react-native-svg';

interface HelpIconProps{
  version:string;
}

const HelpIcon:  React.FC<HelpIconProps> = ({version}) => (
 <View> 
  <Svg
    fill="#3ebb6e"
    height="231"
    width="231"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 308.00 308.00"
    enable-background="new 0 0 308 308"
    stroke="#3ebb6e"
    stroke-width="0.0030800000000000003">
    <G id="SVGRepo_bgCarrier" stroke-width="0"></G>
    <G
      id="SVGRepo_tracerCarrier"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke="#CCCCCC"
      stroke-width="3.696"></G>
    <G id="SVGRepo_iconCarrier">
      {null}
      <G>
        {null}
        <Path d="m170,61.279v-45.279c0-8.837-7.163-16-16-16-8.837,0-16,7.163-16,16v45.279c5.212-0.838 10.555-1.279 16-1.279 5.444,0 10.787,0.441 16,1.279z"></Path>{null}
        <Path d="m236.872,103.713l33.483-33.483c6.249-6.248 6.249-16.379 0-22.627-6.246-6.247-16.377-6.249-22.627,0l-32.93,32.93c8.529,6.5 15.991,14.331 22.074,23.18z"></Path>{null}
        <Path d="m71.128,103.713c6.083-8.85 13.545-16.68 22.074-23.18l-32.93-32.929c-6.248-6.248-16.379-6.248-22.627,0-6.249,6.248-6.249,16.379 0,22.627l33.483,33.482z"></Path>{null}
        <Path d="m254.5,227.764c-3.765-1.143-7.755-1.764-11.889-1.764h-0.111v-65.5c0-48.799-39.701-88.5-88.5-88.5-48.799,0-88.5,39.701-88.5,88.5v65.5h-0.11c-4.134,0-8.124,0.621-11.89,1.764-16.827,5.109-29.111,20.762-29.111,39.236 0,22.607 18.393,41 41,41h177.222c22.607,0 41-18.393 41-41 0-18.474-12.284-34.127-29.111-39.236z"></Path>{null}
      </G>{null}
    </G>
  </Svg>
  </View>
);





export default HelpIcon;



