package com.reactdemo

import android.app.ActivityManager
import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.view.KeyEvent
import android.widget.Toast
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
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


//    if (!foregroundServiceRunning()) {
//      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
//        val i: Intent = Intent(this, KeyEventDetectService::class.java)
//        startForegroundService(i)
//      }
//    }
    
  }

  override fun getMainComponentName(): String = "ReactDemo"


  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  override fun onKeyDown(keyCode: Int, event: KeyEvent?): Boolean{
    var KeyMessage: String = ""
    when (keyCode) {
      KeyEvent.KEYCODE_VOLUME_DOWN -> {
        KeyMessage = "VOLUME_DOWN_KEY";

      }
      KeyEvent.KEYCODE_VOLUME_UP -> {
        KeyMessage = "VOLUME_UP_KEY";

      }

    }
    KeyMessage?.let { sendEventToReactNative(it) }

    return true;
  }
//
//  private fun handleKeyEvent(keyCode: Int) {
//    when (keyCode) {
//      KeyEvent.KEYCODE_VOLUME_DOWN -> {
//        // Handle volume down key
//        sendEventToReactNative("Volume Down Key")
//      }
//      KeyEvent.KEYCODE_VOLUME_UP -> {
//        // Handle volume up key
//        sendEventToReactNative("Volume Up Key")
//      }
//      KeyEvent.KEYCODE_BACK -> {
//        // Handle back key
//        sendEventToReactNative("Back Key")
//      }
//    }
//  }
//
   private fun sendEventToReactNative(keyMessage: String) {
    val reactContext: ReactContext? = reactInstanceManager?.currentReactContext
    reactContext?.let {
      val params = Arguments.createMap().apply {
        putString("keyMessage", keyMessage)
      }
      reactContext
              .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
              .emit("onKeyMessage", params)
    }
  }
//
//
//  fun foregroundServiceRunning(): Boolean {
//    val activityManager = getSystemService(ACTIVITY_SERVICE) as ActivityManager
//    for (services in activityManager.getRunningServices(Int.MAX_VALUE)) {
//      if (KeyEventDetectService::class.java.getName() == services.service.className) {
//        return true
//      }
//    }
//    return false
//  }
//




}
