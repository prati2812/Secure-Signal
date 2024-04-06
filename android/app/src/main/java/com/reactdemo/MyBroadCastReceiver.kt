package com.reactdemo

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import android.util.Log
import android.view.KeyEvent

class MyBroadCastReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
//        if (intent.action == Intent.ACTION_BOOT_COMPLETED) {
//            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
//                val serviceIntent = Intent(context, KeyEventDetectService::class.java)
//                context.startForegroundService(serviceIntent)
//            }
//        }

        if (Intent.ACTION_MEDIA_BUTTON == intent.action) {
            val event = intent.getParcelableExtra(Intent.EXTRA_KEY_EVENT) as KeyEvent?
            if (KeyEvent.KEYCODE_VOLUME_DOWN == event!!.keyCode) {
                // Handle key press.
                Log.d("KeyPress" , "DOWN");
            }
        }
    }
}
