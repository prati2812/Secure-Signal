package com.reactdemo

import android.app.ActivityManager
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.view.KeyEvent
import android.widget.Toast
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.ReactInstanceManager
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactContext
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.facebook.react.modules.core.DeviceEventManagerModule


class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    // Start the service
    startService(Intent(this, KeyEventListenerService::class.java))
  }
  override fun getMainComponentName(): String = "ReactDemo"


  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

//  override fun onKeyDown(keyCode: Int, event: KeyEvent?): Boolean{
//    var KeyMessage: String = ""
//    when (keyCode) {
//      KeyEvent.KEYCODE_VOLUME_DOWN -> {
//        Toast.makeText(applicationContext, "Volume Down Key Pressed", Toast.LENGTH_SHORT).show()
//        KeyMessage = "Volume Down Key";
//
//      }
//      KeyEvent.KEYCODE_VOLUME_UP -> {
//        Toast.makeText(applicationContext, "Volume Up Key Pressed", Toast.LENGTH_SHORT).show()
//        KeyMessage = "Volume Up Key";
//
//      }
//      KeyEvent.KEYCODE_BACK -> {
//        Toast.makeText(applicationContext, "Back Key Pressed", Toast.LENGTH_SHORT).show()
//        KeyMessage = "Back Key";
//
//      }
//    }
//    sendEventToReactNative(KeyMessage);
//    return true;
//  }
//
//  private fun sendEventToReactNative(keyMessage: String) {
//    val reactContext: ReactContext? = reactInstanceManager?.currentReactContext
//    reactContext?.let {
//      val params = Arguments.createMap().apply {
//        putString("keyMessage", keyMessage)
//      }
//      reactContext
//              .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
//              .emit("onKeyMessage", params)
//    }
//  }

 



}
