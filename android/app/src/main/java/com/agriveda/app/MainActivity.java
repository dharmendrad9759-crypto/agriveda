package com.agriveda.app;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.provider.Settings;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import androidx.core.splashscreen.SplashScreen;
import com.getcapacitor.Bridge;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    // Hardware & OS-level protection: block screenshots and screen recording (renders black screen)
    getWindow().setFlags(
        WindowManager.LayoutParams.FLAG_SECURE,
        WindowManager.LayoutParams.FLAG_SECURE
    );

    // Cream blank system splash — exit ASAP so WebView branded splash is the only UI
    final SplashScreen splash = SplashScreen.installSplashScreen(this);
    splash.setKeepOnScreenCondition(() -> false);
    registerPlugin(AgrivedaSettingsPlugin.class);
    super.onCreate(savedInstanceState);
  }

  @Override
  public void onStart() {
    super.onStart();
    // Extra bridge for remote WebView — works even if Capacitor plugin call fails
    Bridge bridge = getBridge();
    if (bridge != null && bridge.getWebView() != null) {
      bridge.getWebView().addJavascriptInterface(new SettingsJsBridge(), "AgrivedaAndroid");
    }
  }

  private void launchAppDetails() {
    Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
    intent.setData(Uri.fromParts("package", getPackageName(), null));
    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    startActivity(intent);
  }

  private void launchLocationSource() {
    Intent intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    startActivity(intent);
  }

  private class SettingsJsBridge {
    @JavascriptInterface
    public void openAppDetails() {
      runOnUiThread(MainActivity.this::launchAppDetails);
    }

    @JavascriptInterface
    public void openLocationSource() {
      runOnUiThread(MainActivity.this::launchLocationSource);
    }

    @JavascriptInterface
    public void setScreenProtection(boolean enable) {
      runOnUiThread(() -> {
        if (enable) {
          getWindow().setFlags(
              WindowManager.LayoutParams.FLAG_SECURE,
              WindowManager.LayoutParams.FLAG_SECURE
          );
        } else {
          getWindow().clearFlags(WindowManager.LayoutParams.FLAG_SECURE);
        }
      });
    }
  }
}
