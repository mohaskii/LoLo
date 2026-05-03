import { render } from 'preact'
import { CameraPoCPage } from './screens/CameraPoC.tsx'

const root = document.getElementById('app')
if (!root) throw Error('unable to find root element #app')
render(<CameraPoCPage />, root)
