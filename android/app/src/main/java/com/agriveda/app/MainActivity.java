package com.agriveda.app;

import android.os.Bundle;
import androidx.core.splashscreen.SplashScreen;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    // Must run before super — keeps branded splash, blocks default launcher-icon flash
    SplashScreen.installSplashScreen(this);
    super.onCreate(savedInstanceState);
  }
}
