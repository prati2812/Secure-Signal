package com.reactdemo

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.view.KeyEvent

class KeyEventReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context?, intent: Intent?) {
        if (intent?.action == Intent.ACTION_MEDIA_BUTTON) {
            val event = intent.getParcelableExtra<KeyEvent>(Intent.EXTRA_KEY_EVENT)
            if (event?.keyCode == KeyEvent.KEYCODE_VOLUME_UP && event.action == KeyEvent.ACTION_DOWN) {
                // Send the event to React Native
                // For simplicity, let's assume you have a method sendEventToReactNative in your MainActivity
                MainActivity.sendEventToReactNative("Volume Up Key Pressed")
            }
        }
    }
}