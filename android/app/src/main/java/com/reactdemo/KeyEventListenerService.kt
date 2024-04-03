package com.reactdemo

import android.app.Service
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.IBinder
import android.view.KeyEvent
import android.widget.Toast
import androidx.core.content.ContextCompat.registerReceiver
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactContext
import com.facebook.react.modules.core.DeviceEventManagerModule

class KeyEventListenerService : Service() {
    private var receiver: KeyEventReceiver? = null

    override fun onBind(intent: Intent?): IBinder? {
        return null
    }

    override fun onCreate() {
        super.onCreate()
        receiver = KeyEventReceiver()
        val filter = IntentFilter().apply {
            addAction(Intent.ACTION_MEDIA_BUTTON)
        }
        registerReceiver(receiver, filter)
    }

    override fun onDestroy() {
        super.onDestroy()
        unregisterReceiver(receiver)
    }
}