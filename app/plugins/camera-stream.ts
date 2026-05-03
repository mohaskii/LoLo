import { registerPlugin } from '@capacitor/core'

export interface CameraStreamPlugin {
  startCamera(): Promise<void>
  stopCamera(): Promise<void>
}

const CameraStream = registerPlugin<CameraStreamPlugin>('CameraStream')

export default CameraStream
