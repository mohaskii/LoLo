# Creating Capacitor Native Plugins (Android)

## Overview
This workflow documents how to create custom Capacitor plugins in the LoLo project,
based on the CameraStream PoC implementation.

## Project Structure

```
capacitor/
├── capacitor.config.json         # appId: com.Lolo.app
├── package.json                  # Capacitor dependencies
└── android/
    └── app/src/main/
        ├── AndroidManifest.xml
        ├── res/layout/activity_main.xml   # FrameLayout root
        └── java/com/Lolo/app/
            ├── MainActivity.java          # Plugin registration
            └── plugins/
                └── CameraStreamPlugin.java
```

## Step-by-step Pattern

### 1. Create the Java Plugin Class
- Place in `capacitor/android/app/src/main/java/com/Lolo/app/plugins/`
- Extend `com.getcapacitor.Plugin`
- Use `@CapacitorPlugin(name = "PluginName")` annotation
- Use `@PluginMethod` for methods callable from JS
- Use `@Permission` and `@PermissionCallback` for runtime permissions
- Use `android.util.Log` for logging (NOT `getBridge().getLogger()` — unavailable in Cap 8)

### 2. Register in MainActivity
```java
// MUST be called BEFORE super.onCreate()
registerPlugin(MyPlugin.class);
super.onCreate(savedInstanceState);
```

### 3. Create JS/TS Wrapper
```ts
import { registerPlugin } from '@capacitor/core'

export interface MyPlugin {
  myMethod(): Promise<void>
}

const MyPlugin = registerPlugin<MyPlugin>('PluginName')
export default MyPlugin
```

### 4. Sync & Build
```bash
cd capacitor && npx cap sync android
cd capacitor/android && ./gradlew assembleDebug
```

## Key Gotchas
- Capacitor 8's `Bridge` has NO `getLogger()` method — use `android.util.Log`
- `registerPlugin()` must be called BEFORE `super.onCreate()` in `MainActivity`
- Layout uses `FrameLayout` with id `main_frame_layout` (not CoordinatorLayout)
- Use `getActivity().getResources().getIdentifier()` for resource lookups (avoids R.id import issues)
- The `activity_main.xml` uses `com.getcapacitor.CapacitorWebView` with `id="@+id/webview"`
