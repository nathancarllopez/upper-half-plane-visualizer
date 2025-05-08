import { createContext, useEffect, useReducer, useRef } from 'react';

import universalStateReducer from './universalStateReducer';
import { initialUniversalState } from './initialUniversalState';
import useCoordinateFunctions from '../hooks/useCoordinateFunctions';

export const UniversalStateContext = createContext(null);
export const UniversalStateDispatchContext = createContext(null);
export const CoordFuncContext = createContext(null);
export const AnimationDataContext = createContext(null);

export function UniversalStateProvider({ children }) {
  const [universalState, universalDispatch] = useReducer(universalStateReducer, initialUniversalState);

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited');
    
    if (hasVisited !== 'true') {
      localStorage.setItem('hasVisited', 'true');
      // universalDispatch({ type: "firstVisit" });
      // To do: Create guided tour with react-joyride
    }
  }, []);

  const { canvasInfo } = universalState;
  const { unitsPerPixel, originCoords } = canvasInfo;
  const coordFuncs = useCoordinateFunctions(unitsPerPixel, originCoords);

  const animationShapeRef = useRef(null);
  const animationFuncRef = useRef(null);
  const animationData = { animationShapeRef, animationFuncRef };

  return (
    <UniversalStateContext.Provider value={universalState}>
      <UniversalStateDispatchContext.Provider value={universalDispatch}>
        <CoordFuncContext.Provider value={coordFuncs}>
          <AnimationDataContext.Provider value={animationData}>
            { children }
          </AnimationDataContext.Provider>
        </CoordFuncContext.Provider>
      </UniversalStateDispatchContext.Provider>
    </UniversalStateContext.Provider>
  );
}