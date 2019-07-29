import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SimplexProvider } from '../../providers/simplex/simplex';
import {RationalArithmProvider} from '../../providers/rational-arithm/rational-arithm';
import {SimplexFractionProvider} from '../../providers/simplex-fraction/simplex-fraction';
import { t } from '@angular/core/src/render3';

enum Constraint { lessThan, equal, greatherThan }

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
	  
export class ListPage {
  public bArray: any = [];
  public cArray: any = [];
  private M: number; //nombres de contrainte
  private N: number; //nombre de variable
  public cArrayStr: string[] = [];
  a:number [][]; // tableaux
  numberOfConstraints:number; // number of constraints
   numberOfOriginalVariables:number; // number of original variables
 // public model:any;
  public A_matrix: any = new Array<number>();
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mySimplex :SimplexProvider,public mySimplex_fraction : SimplexFractionProvider) {

    console.log('navParams VARIABLES : ', this.navParams.get('NB_VARS'));
    console.log('navParams CONSTRAINTS : ', this.navParams.get('NB_CONS'));
  

  this.inititialize();
  }
 

   Modeler( constraintLeftSide:number[][],  constraintRightSide:number[],constraintOperator: Constraint[] ,

     objectiveFunction: number[] ) :void{
  
    this.numberOfConstraints = constraintRightSide.length;
    this.numberOfOriginalVariables = objectiveFunction.length;
    this.a = new Array(this.numberOfConstraints+ 1);
    for (let i: number = 0; i < this.numberOfConstraints; i++) {
      this.a[i] = new Array(this.numberOfConstraints + this.numberOfConstraints + 1).fill(0);
      for (let j: number = 0; j < this.numberOfOriginalVariables; j++) {
        this.a[i][j] = constraintLeftSide[i][j];
      }
    }
    this.a[this.numberOfConstraints] = new Array(this.numberOfConstraints+ this.numberOfOriginalVariables + 1).fill(0);
 for (let j: number = this.numberOfOriginalVariables; j < this.numberOfConstraints + this.numberOfOriginalVariables; j++)
  { //les coef de var de base
      this.a[j - this.numberOfOriginalVariables][j] = 1.0;
    }
  
    for (let i: number = 0; i < this.numberOfConstraints; i++) { //b  
      this.a[i][this.numberOfConstraints+ this.numberOfOriginalVariables] = constraintRightSide[i];
    }

      // initialize slack variable
      for (let i = 0; i < this.numberOfConstraints; i++) {
        let slack = 0;
        switch (constraintOperator[i]) {
        case Constraint.greatherThan:
         slack = -1;
         break;
        case Constraint.lessThan:
         slack = 1;
         break;
        default:
        }
        this.a[i][this.numberOfOriginalVariables + i] = slack;
       }




    for (let j: number = 0; j < this.numberOfOriginalVariables; j++) {  //ci-zj
      this.a[this.numberOfConstraints][j] = objectiveFunction[j];
    }
    console.log("------------ END INIT Simplex tableau -------------");
   

  }


  a_fraction:number[][];
  
  public fractionsimplex1:RationalArithmProvider[][];

  Modeler_fraction( constraintLeftSide:any[][],constraintRightSide:any[],
    constraintOperator:Constraint[],objectiveFunction:any[]):void{
 
   this.numberOfConstraints = constraintRightSide.length;
   this.numberOfOriginalVariables = objectiveFunction.length;
   this.a_fraction = new Array(this.numberOfConstraints+ 1);
   this.fractionsimplex1=new Array(this.numberOfConstraints +1);
   for (let i: number = 0; i < this.numberOfConstraints; i++) {
     this.a_fraction[i] = new Array(this.numberOfConstraints + this.numberOfConstraints + 1).fill(0);
     this.fractionsimplex1[i]=new  Array(this.numberOfConstraints + this.numberOfConstraints + 1).fill(0);
     for (let j: number = 0; j < this.numberOfOriginalVariables; j++) {
       this.a_fraction[i][j] = constraintLeftSide[i][j];
       this.fractionsimplex1[i][j] =constraintLeftSide[i][j];
     }
   }
   this.a_fraction[this.numberOfConstraints] = new Array(this.numberOfConstraints+ this.numberOfOriginalVariables + 1).fill(0);
   this.fractionsimplex1[this.numberOfConstraints] = new Array(this.numberOfConstraints+ this.numberOfOriginalVariables + 1).fill(0);

   for (let j: number = this.numberOfOriginalVariables; j < this.numberOfConstraints + this.numberOfOriginalVariables; j++) { 
     //les coef de var de base
     this.a_fraction[j - this.numberOfOriginalVariables][j] = 1.0;
     this.fractionsimplex1[j - this.numberOfOriginalVariables][j] = new RationalArithmProvider(1,1) ;
   }
 
   for (let i: number = 0; i < this.numberOfConstraints; i++) { //b  
     this.a_fraction[i][this.numberOfConstraints+ this.numberOfOriginalVariables] = constraintRightSide[i];
     this.fractionsimplex1[i][this.numberOfConstraints+ this.numberOfOriginalVariables] = constraintRightSide[i];
     
   }

     // initialize slack variable
     for (let i = 0; i < this.numberOfConstraints; i++) {
       let slack = 0;
       switch (constraintOperator[i]) {
       case Constraint.greatherThan:
        slack = -1;
        break;
       case Constraint.lessThan:
        slack = 1;
        break;
       default:
       }
       this.a_fraction[i][this.numberOfOriginalVariables + i] = slack;
       this.fractionsimplex1[i][this.numberOfOriginalVariables + i ]= new RationalArithmProvider(slack,1);
      }




   for (let j: number = 0; j < this.numberOfOriginalVariables; j++) {  //ci-zj
     this.a_fraction[this.numberOfConstraints][j] = objectiveFunction[j];
     this.fractionsimplex1[this.numberOfConstraints][j] = objectiveFunction[j];
   }
   console.log("------------ END INIT Simplex tableau -------------");
  

 }
  
  private   MAXIMIZE  :boolean= false;
  private   MINIMIZE :boolean= false;

  objectiveFunc:any[] = [   1000, 1200 ];
	   constraintLeftSide :any[][]= [[10, 5], [2, 3], [1, 0], [0, 1]];
	constraintOperator: Constraint[]  = [ Constraint.lessThan,Constraint.lessThan, Constraint.lessThan, Constraint.lessThan ];
   constraintRightSide:any[] = [ 200,60,18,20];
   // model:any ;
 solve_LP() {
   this.MAXIMIZE=true;
  this.Modeler(this.A_matrix, this.bArray, this.constraintOperator, this.cArray);
  console.log("CALLING Simplex Algo...\n");
  this.mySimplex.Simplex(this.a,this.numberOfConstraints,this.numberOfOriginalVariables ,this.MAXIMIZE);
  let  x:number[] = this.mySimplex.primal();
  for (let  i = 0; i < x.length; i++)
 //  System.out.println("x[" + i + "] = " + x[i]);
 // System.out.println("Solution: " + simplex.value());
console.log("x[" + i + "] = " + x[i]);
console.log("Solution: " + this.mySimplex.value());

this.sol.push(this.mySimplex.value());
this.sol.push("showOptimalSol --->> ", this.mySimplex.getOptimalSol());
this.mySimplex.solve().then(data => {
  this.MAXIMIZE = data;
});

return this.sol;


 }
 sol = [];



 private   MAXIMIZE_fraction  :boolean= false;
 solve_LP_fraction() {
  this.MAXIMIZE_fraction=true;
 this.Modeler_fraction(this.A_matrix, this.bArray, this.constraintOperator, this.cArray);
 console.log("CALLING Simplex Algo...\n");
 this.mySimplex_fraction.init_Simplex_Tableau1(this.A_matrix,this.bArray,this.objectiveFunc ,this.MAXIMIZE_fraction
  );

console.log("Solution: " + this.mySimplex_fraction.value1());

this.sol_fraction.push(this.mySimplex_fraction.value1());
this.sol_fraction.push("showOptimalSol --->> ", this.mySimplex_fraction.getOptimalSol1());
this.mySimplex_fraction.solve1().then(data => {
 this.MAXIMIZE_fraction = data;
});

return this.sol_fraction;


}
sol_fraction = [];

  
 sol1=[];
 objectiveFunc1:any[] =  [-9, -12, -10];
	   constraintLeftSide1 :any[][]=[[3, 3, 4], [2, 2, 1], [1, 4, 5]];
   constraintRightSide1:any[] =[60, 52, 18];
 solve_LP_min() {
  this.MINIMIZE=false;
 this.Modeler(this.A_matrix, this.bArray, this.constraintOperator, this.cArray);
 console.log("CALLING Simplex Algo...\n");
 this.mySimplex.Simplex(this.a,this.numberOfConstraints,this.numberOfOriginalVariables ,this.MINIMIZE);
 let  x:number[] = this.mySimplex.primal();
 for (let  i = 0; i < x.length; i++)
//  System.out.println("x[" + i + "] = " + x[i]);
// System.out.println("Solution: " + simplex.value());
console.log("x[" + i + "] = " + x[i]);
console.log("Solution: " + this.mySimplex.value());

this.sol1.push(this.mySimplex.value());
this.sol1.push("showOptimalSol --->> ", this.mySimplex.getOptimalSol());
this.mySimplex.solve().then(data => {
 this.MINIMIZE = data;
});

return this.sol1;


}



private   MINIMIZE_fraction  :boolean= false;
solve_LP_fraction_min() {
 this.MAXIMIZE_fraction=false;
this.Modeler_fraction(this.A_matrix, this.bArray, this.constraintOperator, this.cArray);
console.log("CALLING Simplex Algo...\n");
this.mySimplex_fraction.init_Simplex_Tableau1(this.A_matrix,this.bArray,this.cArray ,this.MINIMIZE_fraction

 );

console.log("Solution: " + this.mySimplex_fraction.value1());

this.sol_fraction_MIN.push(this.mySimplex_fraction.value1());
this.sol_fraction_MIN.push("showOptimalSol --->> ", this.mySimplex_fraction.getOptimalSol1());
this.mySimplex_fraction.solve1().then(data => {
this.MINIMIZE_fraction = data;
});

return this.sol_fraction;


}
sol_fraction_MIN = [];


public rest: string;
public aff: string;
public decimal = new Option("decimal");
  public fraction = new Option("fraction");
  public Max = new Option("Max");
  public Min = new Option("Min");
  cal() {

    console.warn("this.rest && this.aff >>>> ", this.rest, "  -- ", this.aff);
    if (this.rest && this.aff) {
      if (this.rest == "decimal") {
        if (this.aff == "Max") { return this.solve_LP(); }
        else {
          if (this.aff == "Min") { return  this.solve_LP_min(); }
        }
      }
      else {
        if (this.rest == "fraction") {
          if (this.aff == "Max") { return this.solve_LP_fraction();
           }
          else {
            if (this.aff == "Min") { return    this.solve_LP_fraction_min(); // this.solve_LP_Min_farction(); 
            }
          }

        }
      }

    }
  }
 
  AddContraintes() {
    this.bArray.push(0);
    // this.bArray.push({ 'value': '' });
    this.A_matrix.push({ 'value': '' });
  }
  removeContraintes(idx) { 
    this.bArray.splice(idx, 1); }
  AddVariable() {
    this.cArray.push(0);
    // this.cArray.push({ 'value': '' });
  }
  remoVevariable(idx1) { 
    this.cArray.splice(idx1, 1); }
  inititialize() {

    this.N = this.navParams.get("NB_VARS");
    this.M = this.navParams.get("NB_CONS");

    console.log('N = ', this.N);
    console.log('M = ', this.M);
    if (this.N != undefined || this.M != undefined) {
      for (let i = 0; i < this.N; i++) {
        this.cArray.push({ 'value': '' });
      } 
      for (let i = 0; i < this.M; i++) {
        this.A_matrix.push({ 'value': '' });
        this.bArray.push({ 'value': '' });
      }
    }
  }
}
