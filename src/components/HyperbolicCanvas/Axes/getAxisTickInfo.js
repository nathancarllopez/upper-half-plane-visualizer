export default function getAxisTickInfo(originCoords, axisTickSeparation, unitsPerPixel) {
  const vertTicks = [];
  const posHorzTicks = [];
  const negHorzTicks = [];
  let position;
  let counter;

  if (0 <= originCoords.x && originCoords.x <= window.innerWidth) {
    position = originCoords.y;
    counter = 0;
    while (position > 0) {
      position -= axisTickSeparation;
      counter += 1;

      vertTicks.push({
        position,
        label: axisTickSeparation * counter * unitsPerPixel
      });
    }
  }

  if (originCoords.x <= window.innerWidth) {
    position = originCoords.x
    counter = 0;
    while (position < window.innerWidth) {
      position += axisTickSeparation;
      counter += 1;

      if (position >= 0) {
        posHorzTicks.push({
          position,
          label: axisTickSeparation * counter * unitsPerPixel
        });
      }
    }
  }
  
  if (originCoords.x >= 0) {
    position = originCoords.x;
    counter = 0
    while (position > 0) {
      position -= axisTickSeparation;
      counter += 1;

      if (position <= window.innerWidth) {
        negHorzTicks.push({
          position,
          label: -axisTickSeparation * counter * unitsPerPixel
        });
      }
    }
  }

  return { vertTicks, posHorzTicks, negHorzTicks }
}