import Toolbar from './components/Toolbar/Toolbar';
import Toaster from './components/Toaster/Toaster';
import Information from './components/Information/Information';
import { UniversalStateProvider } from './contexts/UniversalStateProvider';
import HyperbolicCanvas from './components/HyperbolicCanvas/HyperbolicCanvas';
import ControlPanelOrganizer from './components/ControlPanel/ControlPanelOrganizer';

export default function App() {
  return (
    <UniversalStateProvider>
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
      }}
    >
      <Information/>

      <Toolbar/>

      <HyperbolicCanvas/>

      <ControlPanelOrganizer/>

      <Toaster/>
    </div>
    </UniversalStateProvider>
  );
}