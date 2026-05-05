import { registerPlugin } from '@capacitor/core'

export interface CameraStreamPlugin {
  startCamera(options?: { mode?: 'fullscreen' | '40percent' }): Promise<void>
  stopCamera(): Promise<void>
  startStream(options: { url: string; key: string }): Promise<void>
  stopStream(): Promise<void>
}

const CameraStream = registerPlugin<CameraStreamPlugin>('CameraStream')

export default CameraStream
