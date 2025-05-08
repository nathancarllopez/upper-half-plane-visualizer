import ComplexNumber from "./ComplexNumber.js";

export default class Mobius {
  /**
   * All parameters are instances of the ComplexNumber class
   * see complexNumbers.js
   */
  constructor(a, b, c, d) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.coefficients = [a, b, c, d];
  }

  apply(coords) {
    const z = new ComplexNumber(coords.mathX, coords.mathY);

    const numerator = (this.a.times(z)).plus(this.b);
    const denominator = (this.c.times(z)).plus(this.d);
    
    return numerator.dividedBy(denominator);
  }

  compose(that) {
    const newA = (this.a.times(that.a)).plus(this.b.times(that.c));
    const newB = (this.a.times(that.b)).plus(this.b.times(that.d));
    const newC = (this.c.times(that.a)).plus(this.d.times(that.c));
    const newD = (this.c.times(that.b)).plus(this.d.times(that.d));

    return new Mobius(newA, newB, newC, newD);
  }

  inverse() {
    const newA = this.d;
    const newB = this.b.scale(-1);
    const newC = this.c.scale(-1);
    const newD = this.a;

    return new Mobius(newA, newB, newC, newD);
  }
  
  static cayley() {
    const a = new ComplexNumber(1);
    const b = new ComplexNumber(0, -1);
    const c = new ComplexNumber(1);
    const d = new ComplexNumber(0, 1);

    return new Mobius(a, b, c, d);
  }

  static unitCircleRotation(theta) {
    const a = new ComplexNumber(Math.cos(theta), Math.sin(theta));
    const b = new ComplexNumber();
    const c = new ComplexNumber();
    const d = new ComplexNumber(1);

    return new Mobius(a, b, c, d);
  }

  static rotateAboutI(theta) {
    const cayley = Mobius.cayley();
    const cayleyInv = cayley.inverse();
    const unitCircleRotation = Mobius.unitCircleRotation(theta);

    return cayleyInv.compose(unitCircleRotation.compose(cayley));
  }

  static bringPointToI(coords) {
    const { mathX } = coords;
    const parabolic = new Mobius(
      new ComplexNumber(1),
      new ComplexNumber(-mathX, 0),
      new ComplexNumber(),
      new ComplexNumber(1)
    );

    const { im } = parabolic.apply(coords);
    const scaleDown = new Mobius(
      new ComplexNumber(1 / im),
      new ComplexNumber(),
      new ComplexNumber(),
      new ComplexNumber(1)
    );

    return scaleDown.compose(parabolic);
  }

  static rotateAboutPoint(coords, theta) {
    const bringToI = Mobius.bringPointToI(coords);
    const bringToIInverse = bringToI.inverse();
    const rotateAboutI = Mobius.rotateAboutI(theta);

    return bringToIInverse.compose(rotateAboutI.compose(bringToI));
  }

  static moveZeroToward(coords, distToMove) {
    const unscaledP = new ComplexNumber(coords.mathX, coords.mathY);
    const scaleFactor = Math.tanh(distToMove / 2) / unscaledP.modulus;
    const p = unscaledP.scale(scaleFactor);

    const a = new ComplexNumber(1);
    const b = p;
    const c = p.conjugate();
    const d = new ComplexNumber(1);

    return new Mobius(a, b, c, d);
  }

  static translateBetweenPoints(coords1, coords2, distToTranslate) {
    const bringPoint1ToI = Mobius.bringPointToI(coords1);
    const bringPoint1ToIInv = bringPoint1ToI.inverse();
    const cayley = Mobius.cayley();
    const cayleyInv = cayley.inverse();

    const { re, im } = cayley.compose(bringPoint1ToI).apply(coords2);
    const moveZeroTowardP = Mobius.moveZeroToward({ mathX: re, mathY: im }, distToTranslate);

    return bringPoint1ToIInv.compose(cayleyInv.compose(moveZeroTowardP.compose(cayley.compose(bringPoint1ToI))));
  }
}