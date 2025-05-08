const DEFAULT_PANEL_INFO = (title) => {
  return { title, placement: { left: 0, bottom: 0 }, wasDragged: false, key: performance.now() };
}

export default function universalStateReducer(universalState, action) {
  const { canvasInfo, toolbar, activeToasts, controlPanels } = universalState;
  const { cursorCoords, originCoords, unitsPerPixel, snapshots, currIdx, isAnimating, animationSpeed } = canvasInfo;
  const { zoomSensitivity, darkMode } = toolbar;

  const currentDrawings = snapshots[currIdx];
  const allOlderDrawings = snapshots.slice(0, currIdx);
  const allDrawingsToPresent = [ ...allOlderDrawings, currentDrawings ];

  const logActions = false;
  // const logActions = true;
  if (logActions && action.type !== 'setCursorCoords') {
    console.log(action);
    console.log(universalState);
  }

  switch(action.type) {
    case 'toggleDarkMode': {
      const docEl = document.documentElement;
      if (darkMode) {
        docEl.removeAttribute('data-bs-theme');
      } else {
        docEl.setAttribute('data-bs-theme', "dark");
      }

      return {
        ...universalState,
        toolbar: {
          ...toolbar,
          darkMode: !darkMode
        }
      };
    }
    case 'toggleToolbarBoolean': {
      const { id } = action;
      const currBool = toolbar[id];

      return {
        ...universalState,
        toolbar: { ...toolbar, [id]: !currBool }
      };
    }
    case 'updateToolbarValue': {
      const { id, value } = action;

      return {
        ...universalState,
        toolbar: { ...toolbar, [id]: value }
      }
    }
    case 'toggleDropdown': {
      const { dropdownName } = action;

      return {
        ...universalState,
        toolbar: { ...toolbar, openDropdown: dropdownName }
      };
    }

    case 'flipAnimationSpeed': {
      return {
        ...universalState,
        canvasInfo: { ...canvasInfo, animationSpeed: -animationSpeed }
      }
    }
    case 'changeAnimationSpeed': {
      const { newSpeed } = action;

      return {
        ...universalState,
        canvasInfo: { ...canvasInfo, animationSpeed: newSpeed }
      }
    }
    case 'toggleIsAnimating': {
      return {
        ...universalState,
        canvasInfo: { ...canvasInfo, isAnimating: !isAnimating }
      }
    }

    case 'undo': {
      const prevCurrIdx = Math.max(0, currIdx - 1);
      const prevDrawings = snapshots[prevCurrIdx];

      const { hasAnimShape, hasSelectedDrawing } = prevDrawings.reduce((flags, drawing) => {
        return {
          hasAnimShape: flags.hasAnimShape || drawing.isAnimationShape,
          hasSelectedDrawing: flags.hasSelectedDrawing || drawing.isSelected
        };
      }, { hasAnimShape: false, hasSelectedDrawing: false });

      const undonePanels = [];
      if (hasAnimShape) {
        undonePanels.push(DEFAULT_PANEL_INFO("Animations"));
      }
      if (hasSelectedDrawing) {
        undonePanels.push(DEFAULT_PANEL_INFO("Styles"))
      }

      return {
        ...universalState,
        canvasInfo: {
          ...canvasInfo,
          currIdx: prevCurrIdx
        },
        controlPanels: undonePanels
      }
    };
    case 'redo': {
      const nextCurrIdx = Math.min(snapshots.length - 1, currIdx + 1);
      const nextDrawings = snapshots[nextCurrIdx];

      const { hasAnimShape, hasSelectedDrawing } = nextDrawings.reduce((flags, drawing) => {
        return {
          hasAnimShape: flags.hasAnimShape || drawing.isAnimationShape,
          hasSelectedDrawing: flags.hasSelectedDrawing || drawing.isSelected
        };
      }, { hasAnimShape: false, hasSelectedDrawing: false });

      const redonePanels = [];
      if (hasAnimShape) {
        redonePanels.push(DEFAULT_PANEL_INFO("Animations"));
      }
      if (hasSelectedDrawing) {
        redonePanels.push(DEFAULT_PANEL_INFO("Styles"))
      }

      return {
        ...universalState,
        canvasInfo: {
          ...canvasInfo,
          currIdx: nextCurrIdx
        },
        controlPanels: redonePanels
      };
    };
    case 'clear': {
      return {
        ...universalState,
        canvasInfo: {
          ...canvasInfo,
          snapshots: [ ...allDrawingsToPresent, [] ],
          currIdx: currIdx + 1
        },
        controlPanels: []
      };
    };

    case 'resetAxes': {
      const stdOriginCoords = { x: window.innerWidth / 2, y: window.innerHeight * 0.9 };
      const resetSnapshots = allDrawingsToPresent.map(
        snapshot => snapshot.map(drawing => ({
          ...drawing,
          anchors: drawing.anchors.map(anchor => ({
            ...anchor,
            canvasX: Math.floor(stdOriginCoords.x + anchor.mathX),
            canvasY: Math.floor(originCoords.y - anchor.mathY)
          }))
        }))
      )

      return {
        ...universalState,
        canvasInfo: {
          ...canvasInfo,
          unitsPerPixel: 1,
          originCoords: stdOriginCoords,
          snapshots: resetSnapshots
        }
      };
    }
    case 'zooming': {
      const { delta, zoomCenter } = action;
      const zoomFactor = 2 ** (Math.abs(delta) / zoomSensitivity);
      const isZoomingIn = delta < 0;
      
      const zoomedOriginCoords = {
        ...originCoords,
        x: isZoomingIn ?
          zoomCenter.canvasX + (originCoords.x - zoomCenter.canvasX) * zoomFactor :
          zoomCenter.canvasX + (originCoords.x - zoomCenter.canvasX) / zoomFactor
      };
      const zoomedUnitsPerPixel = isZoomingIn ? 
        unitsPerPixel / zoomFactor : unitsPerPixel * zoomFactor;

      const zoomedSnapshots = allDrawingsToPresent.map(
        snapshot => snapshot.map(drawing => ({
          ...drawing,
          anchors: drawing.anchors.map(anchor => {
            const { mathX, mathY } = anchor;
            return {
              mathX,
              mathY,
              canvasX: zoomedOriginCoords.x + mathX / zoomedUnitsPerPixel,
              canvasY: zoomedOriginCoords.y - mathY / zoomedUnitsPerPixel
            };
          })
        }))
      );

      const zoomedCursorCoords = {
        ...cursorCoords,
        mathX: zoomedUnitsPerPixel * (cursorCoords.canvasX - zoomedOriginCoords.x),
        mathY: zoomedUnitsPerPixel * (zoomedOriginCoords.y - cursorCoords.canvasY)
      };

      return {
        ...universalState,
        canvasInfo: {
          ...canvasInfo,
          originCoords: zoomedOriginCoords,
          unitsPerPixel: zoomedUnitsPerPixel,
          cursorCoords: zoomedCursorCoords,
          snapshots: zoomedSnapshots,
        },
      };
    }

    case 'shapeDragStart': {
      return {
        ...universalState,
        canvasInfo: {
          ...canvasInfo,
          shapeIsDragging: true,
        }
      };
    }
    case 'shapeDragMove': {
      const { id, draggedAnchors } = action;
      const draggedDrawings = currentDrawings.map(drawing => {
        if (drawing.id !== id) return drawing;
        return { ...drawing, anchors: draggedAnchors };
      });

      return {
        ...universalState,
        canvasInfo: {
          ...canvasInfo,
          snapshots: [ ...allOlderDrawings, draggedDrawings ],
        }
      };
    }
    case 'shapeDragEnd': {
      return {
        ...universalState,
        canvasInfo: {
          ...canvasInfo,
          shapeIsDragging: false
        }
      };
    }

    case 'canvasDragStart': {
      const { displacementX } = action;

      const displacedDrawings = allDrawingsToPresent.map(
        snapshot => snapshot.map(drawing => {
          return {
            ...drawing,
            anchors: drawing.anchors.map(anchor => {
              return {
                ...anchor,
                canvasX: anchor.canvasX + displacementX
              };
            })
          };
        })
      );

      return {
        ...universalState,
        canvasInfo: {
          ...canvasInfo,
          isAnimating: false,
          canvasIsDragging: true,
          originCoords: { ...originCoords, x: originCoords.x + displacementX },
          snapshots: displacedDrawings
        }
      };
    }
    case 'canvasDragEnd': {
      return {
        ...universalState,
        canvasInfo: {
          ...canvasInfo,
          canvasIsDragging: false
        }
      };
    }

    case 'panelDragStop': {
      const { draggedTitle } = action;

      const draggedPanels = controlPanels.map(panelInfo => {
        const { title } = panelInfo;
        if (title !== draggedTitle) return panelInfo;

        return { ...panelInfo, wasDragged: true };
      });

      return {
        ...universalState,
        controlPanels: draggedPanels
      }
    }
    // case 'hidePanel': {
    //   const { title } = action;

    //   const filteredPanels = controlPanels.filter(panelInfo => panelInfo.title !== title);

    //   return {
    //     ...universalState,
    //     controlPanels: filteredPanels
    //   };
    // } // Filter the panels array
    // case 'showPanel': {}  // Push to the panels array

    case 'addNewDrawing': {
      const { newDrawing } = action;

      const newCurrent = (() => {
        if (newDrawing.isAnimationShape) {
          const noAnimationShapes = currentDrawings.filter(drawing => !(drawing.isAnimationShape || drawing.isActive));
          return [ ...noAnimationShapes, newDrawing ];
        }
        
        if (!newDrawing.isActive) {
          const noActivePoints = currentDrawings.filter(drawing => !drawing.isActive);
          return [ ...noActivePoints, newDrawing ];
        }

        return [ ...currentDrawings, newDrawing ];
      })();

      const newPanels = (() => {
        if (!newDrawing.isAnimationShape) return controlPanels;

        const showingAnimPanel = controlPanels.some(panel => panel.title === "Animations");
        if (showingAnimPanel) return controlPanels;

        return [ ...controlPanels, DEFAULT_PANEL_INFO("Animations")];
      })();

      return {
        ...universalState,
        canvasInfo: {
          ...canvasInfo,
          snapshots: [ ...allDrawingsToPresent, newCurrent ],
          currIdx: currIdx + 1
        },
        controlPanels: newPanels
      };
    }
    // case 'transformDrawings': {
    //   const { mapFunc } = action;
    //   const transformed = currentDrawings.map(drawing => mapFunc(drawing));

    //   return {
    //     ...universalState,
    //     canvasInfo: {
    //       ...canvasInfo,
    //       snapshots: [ ...allOlderDrawings, transformed ]
    //     }
    //   }
    // } // Check for panel
    case 'copyDrawings': {
      const currentDrawingsCopy = [ ...currentDrawings ];

      return {
        ...universalState,
        canvasInfo: {
          ...canvasInfo,
          snapshots: [ ...allDrawingsToPresent, currentDrawingsCopy ],
          currIdx: currIdx + 1
        }
      }
    }
    case 'changeDrawingStyle': {
      const { styleName, value, id } = action;
      const changedDrawings = currentDrawings.map(drawing => {
        if (drawing.id !== id) return drawing;

        return {
          ...drawing,
          styles: { ...drawing.styles, [styleName]: value }
        };
      });

      return {
        ...universalState,
        canvasInfo: {
          ...canvasInfo,
          snapshots: [ ...allDrawingsToPresent, changedDrawings ],
          currIdx: currIdx + 1
        }
      };
    }
    case 'deleteDrawing': {
      const { id } = action;

      let drawingIsAnimationShape;
      const filteredDrawings = currentDrawings.reduce((filtered, drawing) => {
        if (drawing.id !== id) {
          filtered.push(drawing);
          return filtered;
        }

        drawingIsAnimationShape = drawing.isAnimationShape;
        return filtered;
      }, []);

      const filteredPanels = controlPanels.filter(panel => {
        if (drawingIsAnimationShape) {
          return panel.title !== "styles" && panel.title !== "animations";
        }
        
        return panel.title !== "styles"
      });

      return {
        ...universalState,
        canvasInfo: {
          ...canvasInfo,
          snapshots: [ ...allDrawingsToPresent, filteredDrawings ],
          currIdx: currIdx + 1
        },
        controlPanels: filteredPanels
      };
    }
    case 'animateDrawings': {
      const { animationFunc, deltaPos } = action;
      const animated = currentDrawings.map(drawing => animationFunc(drawing, deltaPos));

      return {
        ...universalState,
        canvasInfo: {
          ...canvasInfo,
          snapshots: [ ...allOlderDrawings, animated ]
        }
      }
    }
    case 'updateSelection': {
      const { clickedDrawingId } = action;
      
      const updatedCurrent = currentDrawings.map(drawing => ({
        ...drawing,
        isSelected: drawing.id === clickedDrawingId
      }));

      const updatedPanels = (() => {
        if (clickedDrawingId === undefined) {
          return controlPanels.filter(panel => panel.title !== "Styles");
        }

        const stylePanelShown = controlPanels.some(panel => panel.title === 'Styles');
        if (stylePanelShown) {
          return controlPanels;
        }

        return [ ...controlPanels, DEFAULT_PANEL_INFO("Styles")];
      })();
      
      return {
        ...universalState,
        canvasInfo: {
          ...canvasInfo,
          snapshots: [ ...allOlderDrawings, updatedCurrent ]
        },
        controlPanels: updatedPanels
      }
    }

    case 'setCursorCoords': {
      const { coords } = action;
      return {
        ...universalState,
        canvasInfo: {
          ...canvasInfo,
          cursorCoords: coords
        },
      };
    }

    case 'addActiveToast': {
      const { toastName } = action;
      const toast = {
        name: toastName,
        key: performance.now()
      }

      return {
        ...universalState,
        activeToasts: [ ...activeToasts, toast ]
      };
    }
    case 'removeOldToast': {
      return {
        ...universalState,
        activeToasts: activeToasts.slice(1)
      };
    }

    // case 'firstVisit': {
    //   return { ...universalState, openDrawer: "Information" }
    // }

    default: {
      console.log(action);
      throw new Error(`Unexpected action type in universalStateReducer: ${action.type}`);
    }
  }
}




    // case 'editDrawingStyle': {
    //   const { attribute, value, selectedId } = action;
    //   const editedDrawings = currentDrawings.map(drawing => {
    //     if (drawing.id !== selectedId) return { ...drawing };
    //     return {
    //       ...drawing,
    //       styles: { ...drawing.styles, [attribute]: value }
    //     };
    //   });

    //   return {
    //     ...canvasInfo,
    //     snapshots: [...snapshotsTillCurrent, editedDrawings ],
    //     currIdx: currIdx + 1
    //   };
    // };
    // case 'deleteSelectedDrawing': {
    //   const { selectedId } = action;
      
    //   const filteredCurrent = currentDrawings.filter(drawing => drawing.id !== selectedId);

    //   return {
    //     ...canvasInfo,
    //     snapshots: [ ...snapshotsTillCurrent, filteredCurrent ],
    //     currIdx: currIdx + 1
    //   };
    // }

    // case 'addDrawing': {
    //   const { drawing } = action;

    //   const newDrawings = (() => {
    //     if (drawing.isAnimationShape) {
    //       const noAnimationShapes = currentDrawings.filter(d => !d.isAnimationShape);
    //       return [ ...noAnimationShapes, drawing ];
    //     } else if (!drawing.isActive) {
    //       const noActivePoints = currentDrawings.filter(drawing => !drawing.isActive);
    //       return [ ...noActivePoints, drawing ];
    //     }
    //     return [ ...currentDrawings, drawing ];
    //   })();

    //   return {
    //     ...canvasInfo,
    //     snapshots: [ ...snapshotsTillCurrent, newDrawings ],
    //     currIdx: currIdx + 1
    //   };
    // };
    // case 'duplicateCurrentDrawings': {
    //   return {
    //     ...canvasInfo,
    //     snapshots: [ ...snapshotsTillCurrent, currentDrawings ],
    //     currIdx: currIdx + 1
    //   }
    // }
    // case 'transformCurrentDrawings': {
    //   const { mapFunc } = action;
    //   const previousDrawings = snapshots.slice(0, currIdx);

    //   const transformedCurrent = currentDrawings.map(drawing => mapFunc(drawing));

    //   return {
    //     ...canvasInfo,
    //     snapshots: [ ...previousDrawings, transformedCurrent ]
    //   };
    // };
    // case 'transformAllDrawings': {
    //   const { mapFunc } = action;
      
    //   const transformedSnapshots = snapshotsTillCurrent.map(
    //     snapshot => snapshot.map(drawing => mapFunc(drawing))
    //   );

    //   return {
    //     ...canvasInfo,
    //     snapshots: transformedSnapshots
    //   };
    // }


    // case 'clearActiveAndAnimation': {
    //   const clearedDrawings = currentDrawings.filter(drawing => {
    //     return !drawing.isActive && !drawing.isAnimationShape
    //   });

    //   return {
    //     ...universalState,
    //     canvasInfo: {
    //       ...canvasInfo,
    //       snapshots: [ ...allDrawingsToPresent, clearedDrawings ],
    //       currIdx: currIdx + 1
    //     }
    //   }
    // };