import Mobius from "../../../classes/Mobius";

export default function getAnimationFunction(animationShape, getCanvasCoords) {
  const getMobius = (() => {
    const { name, anchors } = animationShape;
    switch(name) {
      case 'rotation': {
        const center = anchors[0]
        return deltaPos => Mobius.rotateAboutPoint(center, deltaPos);
      }

      case 'translation': {
        const [mainAnchor, regAnchor] = anchors;
        return deltaPos => Mobius.translateBetweenPoints(mainAnchor, regAnchor, deltaPos)
      }

      default: {
        throw new Error(`Unexpected animation shape: ${animationShape}`)
      }
    }
  })();

  return (drawing, deltaPos) => {
    const { name, anchors } = drawing;
    if (name === animationShape.name) return drawing;

    const mobius = getMobius(deltaPos);
    return {
      ...drawing,
      anchors: anchors.map(anchor => {
        const { re, im } = mobius.apply(anchor);
        return getCanvasCoords(re, im);
      })
    };
  }
}