package com.Lolo.app.plugins;

import android.Manifest;
import android.hardware.Camera;
import android.util.Log;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.view.ViewGroup;
import android.widget.FrameLayout;

import androidx.annotation.NonNull;

import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

import java.io.IOException;

@CapacitorPlugin(
    name = "CameraStream",
    permissions = {
        @Permission(strings = { Manifest.permission.CAMERA }, alias = "camera")
    }
)
@SuppressWarnings("deprecation") // Using deprecated Camera API intentionally for PoC
public class CameraStreamPlugin extends Plugin implements SurfaceHolder.Callback {

    private static final String TAG = "CameraStreamPlugin";

    private Camera camera;
    private SurfaceView cameraSurfaceView;
    private SurfaceHolder surfaceHolder;
    private boolean isCameraPreviewShowing = false;
    private FrameLayout mainFrameLayout;

    @Override
    public void load() {
        super.load();
        // Grab the FrameLayout root from our custom activity_main.xml
        mainFrameLayout = getActivity().findViewById(
            getActivity().getResources().getIdentifier(
                "main_frame_layout", "id", getActivity().getPackageName()
            )
        );
    }

    @PluginMethod
    public void startCamera(PluginCall call) {
        if (getPermissionState("camera") != PermissionState.GRANTED) {
            requestPermissionForAlias("camera", call, "cameraPermissionCallback");
            return;
        }
        internalStartCamera(call);
    }

    @PermissionCallback
    private void cameraPermissionCallback(PluginCall call) {
        if (getPermissionState("camera") == PermissionState.GRANTED) {
            internalStartCamera(call);
        } else {
            call.reject("Camera permission denied.");
        }
    }

    private void internalStartCamera(PluginCall call) {
        if (isCameraPreviewShowing) {
            call.resolve();
            return;
        }

        getActivity().runOnUiThread(() -> {
            try {
                // Create the SurfaceView if it doesn't exist yet
                if (cameraSurfaceView == null && mainFrameLayout != null) {
                    cameraSurfaceView = new SurfaceView(getContext());
                    surfaceHolder = cameraSurfaceView.getHolder();
                    surfaceHolder.addCallback(this);

                    // Calculate 40% of screen height for the camera preview
                    int screenHeight = getActivity().getResources().getDisplayMetrics().heightPixels;
                    int previewHeight = (int) (screenHeight * 0.40);

                    FrameLayout.LayoutParams layoutParams = new FrameLayout.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT,
                        previewHeight
                    );

                    // Insert at index 0 — behind the WebView
                    mainFrameLayout.addView(cameraSurfaceView, 0, layoutParams);

                    // Make the WebView transparent so the camera shows through
                    getBridge().getWebView().setBackgroundColor(android.graphics.Color.TRANSPARENT);
                }

                // Open the camera
                if (camera == null) {
                    camera = Camera.open();
                    camera.setDisplayOrientation(90); // Portrait mode
                }

                camera.setPreviewDisplay(surfaceHolder);
                camera.startPreview();
                isCameraPreviewShowing = true;
                call.resolve();
            } catch (IOException e) {
                Log.e(TAG, "Failed to start camera preview: " + e.getMessage(), e);
                call.reject("Failed to start camera preview: " + e.getMessage());
            } catch (RuntimeException e) {
                Log.e(TAG, "Camera is in use or not available: " + e.getMessage(), e);
                call.reject("Camera is in use or not available: " + e.getMessage());
            }
        });
    }

    @PluginMethod
    public void stopCamera(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            if (camera != null) {
                camera.stopPreview();
                camera.release();
                camera = null;
            }
            if (cameraSurfaceView != null && mainFrameLayout != null) {
                mainFrameLayout.removeView(cameraSurfaceView);
                cameraSurfaceView = null;
                surfaceHolder = null;
            }
            isCameraPreviewShowing = false;

            // Restore WebView background
            getBridge().getWebView().setBackgroundColor(android.graphics.Color.WHITE);
            call.resolve();
        });
    }

    // ── SurfaceHolder.Callback ──

    @Override
    public void surfaceCreated(@NonNull SurfaceHolder holder) {
        if (camera != null) {
            try {
                camera.setPreviewDisplay(holder);
            } catch (IOException e) {
                Log.e(TAG, "Error setting camera preview display", e);
            }
        }
    }

    @Override
    public void surfaceChanged(@NonNull SurfaceHolder holder, int format, int width, int height) {
        if (camera != null) {
            try {
                camera.stopPreview();
                camera.startPreview();
            } catch (Exception e) {
                Log.e(TAG, "Error restarting camera preview", e);
            }
        }
    }

    @Override
    public void surfaceDestroyed(@NonNull SurfaceHolder holder) {
        if (camera != null) {
            camera.stopPreview();
            camera.release();
            camera = null;
            isCameraPreviewShowing = false;
        }
    }

    @Override
    protected void handleOnDestroy() {
        super.handleOnDestroy();
        if (camera != null) {
            camera.stopPreview();
            camera.release();
            camera = null;
            isCameraPreviewShowing = false;
        }
    }
}
