package com.agriveda.app;

import android.content.Intent;
import android.net.Uri;
import android.provider.Settings;
import android.view.WindowManager;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/** Opens real Android Settings screens & enforces app privacy / anti-screenshot flags. */
@CapacitorPlugin(name = "AgrivedaSettings")
public class AgrivedaSettingsPlugin extends Plugin {

  @PluginMethod
  public void openAppDetails(PluginCall call) {
    try {
      Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
      intent.setData(Uri.fromParts("package", getContext().getPackageName(), null));
      intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
      getActivity().startActivity(intent);
      call.resolve();
    } catch (Exception e) {
      call.reject("Could not open app settings", e);
    }
  }

  @PluginMethod
  public void openLocationSource(PluginCall call) {
    try {
      Intent intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
      intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
      getActivity().startActivity(intent);
      call.resolve();
    } catch (Exception e) {
      call.reject("Could not open location settings", e);
    }
  }

  @PluginMethod
  public void setScreenProtection(PluginCall call) {
    boolean enable = call.getBoolean("enable", true);
    try {
      getActivity().runOnUiThread(() -> {
        if (enable) {
          getActivity().getWindow().setFlags(
              WindowManager.LayoutParams.FLAG_SECURE,
              WindowManager.LayoutParams.FLAG_SECURE
          );
        } else {
          getActivity().getWindow().clearFlags(WindowManager.LayoutParams.FLAG_SECURE);
        }
      });
      call.resolve();
    } catch (Exception e) {
      call.reject("Could not change screen protection", e);
    }
  }
}
