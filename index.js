/**
 * @format
 */

import {AppRegistry} from 'react-native';
import { Provider } from 'react-redux';
import App from './App';
import {name as appName} from './app.json';
import store from './src/redux/store'
import messaging from '@react-native-firebase/messaging';



const AppRedux = () => (
    <Provider store={store}>
         <App/>
    </Provider>
)

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  
});

AppRegistry.registerComponent(appName, () => AppRedux);
