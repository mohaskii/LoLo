import { render } from 'preact'
import { Camera } from '@capacitor/camera';
import { useState } from 'preact/hooks';

// Take a picture or video, or load from the library

const App = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<any>(null);

  const takePicture = async () => {
    try {
      const result = await Camera.takePhoto({
        quality: 90,
        includeMetadata: true,
      });

      // result.webPath can be set directly as the src of an image element
      setCapturedImage(result.webPath || null);

      // On native: pass result.uri to the Filesystem API to get the full-resolution base64,
      // or use result.thumbnail for a lower-resolution base64 preview.
      // On Web: result.thumbnail contains the full image base64 encoded.

      console.log('Format:', result.metadata?.format);
      console.log('Resolution:', result.metadata?.resolution);
      setMetadata(result.metadata);
    } catch (e) {
      const error = e as any;
      // error.code contains the structured error code (e.g. 'OS-PLUG-CAMR-0003')
      // when thrown by the native layer. See the Errors section for all codes.
      const message = error.code ? `[${error.code}] ${error.message}` : error.message;
      console.error('takePhoto failed:', message);
    }
  };

  const clearImage = () => {
    setCapturedImage(null);
    setMetadata(null);
  };

  return (
    <div class='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4'>
      <div class='text-center space-y-6 p-8 bg-white rounded-xl shadow-lg max-w-md w-full'>
        <h1 class='text-3xl font-bold text-gray-800 mb-4'>Camera App</h1>
        <p class='text-gray-600 mb-6'>Take high-quality photos with metadata using Capacitor Camera.</p>

        {capturedImage ? (
          <div class='space-y-4'>
            <div class='relative'>
              <img 
                src={capturedImage} 
                alt="Captured" 
                class='w-full h-64 object-cover rounded-lg shadow-md'
              />
            </div>

            {metadata && (
              <div class='text-left bg-gray-50 p-4 rounded-lg'>
                <h3 class='font-semibold text-gray-700 mb-2'>Image Metadata:</h3>
                {metadata.format && (
                  <p class='text-sm text-gray-600'>Format: {metadata.format}</p>
                )}
                {metadata.resolution && (
                  <p class='text-sm text-gray-600'>
                    Resolution: {metadata.resolution.width}x{metadata.resolution.height}
                  </p>
                )}
              </div>
            )}

            <div class='space-y-3'>
              <button 
                type='button' 
                onClick={takePicture}
                class='w-full py-3 px-6 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors'
              >
                📷 Take Another Picture
              </button>
              <button 
                type='button' 
                onClick={clearImage}
                class='w-full py-3 px-6 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors'
              >
                🗑️ Clear Image
              </button>
            </div>
          </div>
        ) : (
          <div class='space-y-4'>
            <div class='w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300'>
              <div class='text-center'>
                <span class='text-6xl text-gray-400'>📷</span>
                <p class='text-gray-500 mt-2'>No image captured yet</p>
              </div>
            </div>

            <button 
              type='button' 
              onClick={takePicture}
              class='w-full py-3 px-6 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors'
            >
              📷 Take Picture
            </button>
          </div>
        )}

        <div class='flex items-center justify-center space-x-4 pt-4'>
          <span class='text-sm text-gray-500'>📱 Mobile ready</span>
          <span class='text-sm text-gray-500'>⚡ High quality</span>
          <span class='text-sm text-gray-500'>📊 With metadata</span>
        </div>
      </div>
    </div>
  );
}

const root = document.getElementById('app')
if (!root) throw Error('unable to find root element #app')
render(<App />, root)
