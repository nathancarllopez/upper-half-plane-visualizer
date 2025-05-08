export default class ComplexNumber{
  constructor(re = 0, im = 0) {
    this.re = re;
    this.im = im;
    this.modulus = Math.sqrt(re ** 2 + im ** 2);
  }

  plus(that) {
    return new ComplexNumber(this.re + that.re, this.im + that.im);
  }

  times(that) {
    const prodRe = this.re * that.re - this.im * that.im;
    const prodIm = this.re * that.im + this.im * that.re;

    return new ComplexNumber(prodRe, prodIm);
  }

  conjugate() {
    return new ComplexNumber(this.re, -this.im);
  }

  inverse() {
    const conjugate = this.conjugate();
    const modulusSquared = this.modulus ** 2;

    return new ComplexNumber(conjugate.re / modulusSquared, conjugate.im / modulusSquared);
  }

  dividedBy(that) {
    return this.times(that.inverse());
  }

  scale(lambda) {
    return new ComplexNumber(lambda * this.re, lambda * this.im);
  }
}