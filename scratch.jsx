useEffect(() => { // Binds keyboard shortcuts for desktop users
  const handleKeyDown = (event) => {
    const undoPressed = (event.metaKey || event.ctrlKey ) && event.key === 'z';
    if (undoPressed) {
      event.preventDefault();
      setHistory(prev => {
        const { currIdx } = prev;
        return {
          ...prev,
          currIdx: Math.max(0, currIdx - 1)
        }
      });
    }

    const { snapshots, currIdx } = history;
    const aDrawingIsSelected = snapshots[currIdx].find(drawing => drawing.isSelected) !== undefined;
    const deletePressed = ['Delete', 'Backspace'].includes(event.key);
    if (aDrawingIsSelected && deletePressed) {
      event.preventDefault();
      deleteSelectedDrawing();
    }
  };

  window.addEventListener('keydown', handleKeyDown);

  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  }
}, [history]);