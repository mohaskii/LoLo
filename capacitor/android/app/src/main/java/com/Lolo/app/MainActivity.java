package com.Lolo.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.Lolo.app.plugins.CameraStreamPlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(CameraStreamPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
