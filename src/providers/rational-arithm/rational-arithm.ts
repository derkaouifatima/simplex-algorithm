import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the RationalArithmProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RationalArithmProvider {

  // constructor(public http: HttpClient) {
  //   console.log('Hello RationalArithmProvider Provider');
  // }

  ////////////////////////

  public numerator: number;
  public denominator: number;

  constructor(numerator: number, denominator: number) {
  //  console.log('Hello RationalArithmProvider Provider');
    this.numerator = numerator;
    this.denominator = denominator;


  }
 
  ngOnInit() {

  }

  public addition(fraction: RationalArithmProvider): void {

    this.numerator = this.numerator * fraction.denominator + fraction.numerator * this.denominator;
    this.denominator *= fraction.denominator;
    this.simplification();
  }
  public sustraction(fraction: RationalArithmProvider): void {
    let negatedFraction = new RationalArithmProvider(fraction.numerator, fraction.denominator);
    negatedFraction.negate();
    this.addition(negatedFraction);
  }
  public multiplication(fraction: RationalArithmProvider): void {
    this.numerator *= fraction.numerator;
    this.denominator *= fraction.denominator;
    this.simplification();
  }
  public division(fraction: RationalArithmProvider): void {
    let invertedFraction = new RationalArithmProvider(fraction.numerator, fraction.denominator);
    invertedFraction.invert();
    this.multiplication(invertedFraction);
  }
  public invert(): void {
    let oldNumerator = this.numerator;
    this.numerator = this.denominator;
    this.denominator = oldNumerator;
  }
  public negate(): void {
    this.numerator = -this.numerator;
  }
  public simplification(): void {
    let gcd = this.Pgcd(Math.abs(this.numerator), Math.abs(this.denominator));
    this.numerator /= gcd;
    this.denominator /= gcd;


    if (this.denominator < 0) {
      this.denominator = -this.denominator;
      this.numerator = -this.numerator;
    }
  }
  public Pgcd(a: number, b: number):number  {
    let r = 0;
    let q = 0;

    for (; ;) {
      r = a % b;
      q = (a - r) / b;
      if (r == 0) break;
      a = b;
      b = r;
    }

    return b;

  }
  public toString(): String {
    return this.numerator + " / " + this.denominator;
  }


}
