import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the SimplexProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SimplexProvider {

  constructor() {
    console.log('Hello SimplexProvider Provider');
  }

   tableaux : number[][]; // tableaux
   numberOfConstraints : number; // number of constraints
   numberOfOriginalVariables : number; // number of original variables

    maximizeOrMinimize : boolean;

 MAXIMIZE :boolean = true;
  MINIMIZE :boolean= false;
   basis : number[]; // basis[i] = basic variable corresponding to row i
   public Simplex( tableaux:number[][],  numberOfConstraint:number, numberOfOriginalVariable:number,  maximizeOrMinimize:boolean) {
	  this.maximizeOrMinimize = maximizeOrMinimize;
	  this.numberOfConstraints = numberOfConstraint;
	  this.numberOfOriginalVariables = numberOfOriginalVariable;
	  this.tableaux = tableaux;

	  this.basis =  new Array(this.numberOfConstraints);
	  for (let i = 0; i < this.numberOfConstraints; i++)
	   this.basis[i] = this.numberOfOriginalVariables + i;

	  this.solve();

	 }
   public value(): number {
    // val fct objectif
    // let tab2 :number[];
    return - this.tableaux[this.numberOfConstraints][this.numberOfConstraints + this.numberOfOriginalVariables];
    // return tab2;
  }
 // run simplex algorithm starting from initial BFS
   solve() {

	return new Promise<boolean>(
		(resolve, reject) => {
  
		  var start = new Date().getTime();
		  var f = 1;
		  let sol: any[] = new Array<any>();


  while (true) {
 this.show(f).then(data => {
	console.warn('ROW TAB >>>> ', ' = ', this.result);
  });
   
   let q = 0;
   // find entering column q
   if (this.maximizeOrMinimize) {
    q = this.dantzig();
   } else {
    q = this.dantzigNegative();
   }
   if (q == -1)
    break; // optimal

   // find leaving row p
   let p = this.minRatioRule(q);
   if (p == -1){
   // throw new ArithmeticException("Linear program is unbounded");
console.log("Linear program is unbounded");
reject();}
   // pivot
 
   this.pivot(p, q);

   // update basis
   f = f + 1;
   this.basis[p] = q;

  

 

  //  sol.push(this.show());

}

var end = new Date().getTime();

// Now calculate and output the difference
if (this.solvingTime == 0)
  this.solvingTime = end - start;
console.warn("SOLVING TIME = ", this.solvingTime);
//  this.tableauList.push(this.result);
/// return true;

resolve(true);
});


   // index of a non-basic column with most positive cost
}
public solvingTime: number = 0;
	 dantzig() :number {
	  let q = 0;
	  for (let j = 1; j < this.numberOfConstraints + this.numberOfOriginalVariables; j++)
	   if (this.tableaux[this.numberOfConstraints][j] > this.tableaux[this.numberOfConstraints][q])
	    q = j;

	  if (this.tableaux[this.numberOfConstraints][q] <= 0)
	   return -1; // optimal
	  else
	   return q;
	 }

	 // index of a non-basic column with most negative cost
	dantzigNegative():number {
	  let q = 0;
	  for (let j = 1; j < this.numberOfConstraints + this.numberOfOriginalVariables; j++)
	   if (this.tableaux[this.numberOfConstraints][j] < this.tableaux[this.numberOfConstraints][q])
	    q = j;

	  if (this.tableaux[this.numberOfConstraints][q] >= 0)
	   return -1; // optimal
	  else
	   return q;
	 }

	 // find row p using min ratio rule (-1 if no such row)
	  minRatioRule(q:number) :number{
    let p = -1;
	  for (let i = 0; i < this.numberOfConstraints; i++) {
	   if (this.tableaux[i][q] <= 0)
	    continue;
	   else if (p == -1)
	    p = i;
	   else if ((this.tableaux[i][this.numberOfConstraints
	     + this.numberOfOriginalVariables] / this.tableaux[i][q]) < (this.tableaux[p][this.numberOfConstraints
	     + this.numberOfOriginalVariables] / this.tableaux[p][q]))
	    p = i;
	  }
	  return p;
	 }

	 // pivot on entry (p, q) using Gauss-Jordan elimination
	  pivot( p:number,  q:number):void {

	  // everything but row p and column q
	  for (let i = 0; i <= this.numberOfConstraints; i++)
	   for (let j = 0; j <= this.numberOfConstraints + this.numberOfOriginalVariables; j++)
	    if (i != p && j != q)
	     this.tableaux[i][j] -= this.tableaux[p][j] * this.tableaux[i][q]  / this.tableaux[p][q];

	  // zero out column q
	  for (let i = 0; i <= this.numberOfConstraints; i++)
	   if (i != p)
	    this.tableaux[i][q] = 0.0;

	  // scale row p
	  for (let j = 0; j <= this.numberOfConstraints + this.numberOfOriginalVariables; j++)
	   if (j != q)
	    this.tableaux[p][j] /= this.tableaux[p][q];
	  this.tableaux[p][q] = 1.0;
   }
   


    // return primal solution vector
	  primal():number[] {
	   let x:number[] = new Array(this.numberOfOriginalVariables);
	  for (let i = 0; i < this.numberOfConstraints; i++)
	   if (this.basis[i] < this.numberOfOriginalVariables)
	    x[this.basis[i]] = this.tableaux[i][this.numberOfConstraints   + this.numberOfOriginalVariables];
	  return x;
	 }

	 // print tableaux
	 result = [];
	 row = [];
	 col = [];
   
	 res = [];
	 public sol: string[] = new Array<string>();
	 header: string[] = [];
	 tab: any = new Array<any>();
	 tableauList: any[] = [];



	 public getOptimalSol1() {

		this.sol = [];
	
		// this.loadingMsg = " <p><strong>Chargement en cours...</strong> </p>"
		//         + "<ul>" +
		//         "<li>Articles : " + nbArts0 + "</li>" +
		//         "<li>Reste : " + this.msToTime(estimatedTotalTime) + "</li>" +
		//         "</ul>" +
		//         " <p>Patientez SVP. </p>";
	
	
		for (let i: number = 0; i < this.numberOfConstraints; i++) {
		  if (this.basis[i] < this.numberOfConstraints ){
			this.sol.push("x*_" + (this.basis[i] + 1) + " = " + this.tableaux[i][this.numberOfConstraints + this.numberOfOriginalVariables]);
	
			//   console.log("x_" + this.basis[i] + " = " + this.A_coeff[i][this.M + this.N]);
		  }
		}
		if (this.basis.length) {
		  this.sol.push("Optimal value Z* = " + this.value());
		  this.sol.push("Solving time = " + this.solvingTime + " ms");
		}
		return this.sol;
	  }
	
	  public getOptimalSol(): string {
	
		this.sol = [];
		var resStr = "";
	
		// this.loadingMsg = " <p><strong>Chargement en cours...</strong> </p>"
		//         + "<ul>" +
		//         "<li>Articles : " + nbArts0 + "</li>" +
		//         "<li>Reste : " + this.msToTime(estimatedTotalTime) + "</li>" +
		//         "</ul>" +
		//         " <p>Patientez SVP. </p>";
	
		resStr = '<h4><strong>Optimal solution found </strong> </h4><ul>';
	
		for (let i: number = 0; i < this.numberOfConstraints; i++) {
		  if (this.basis[i] < this.numberOfConstraints) {
			resStr = resStr + ' <li> x*' + (this.basis[i] + 1) + ' = ' + this.tableaux[i][this.numberOfConstraints + this.numberOfOriginalVariables] + '</li>';
			  console.log("x_"  + (this.basis[i] + 1) + ' = ' + this.tableaux[i][this.numberOfConstraints + this.numberOfOriginalVariables]);
		  }
		}
		if (this.basis.length) {
		  resStr = resStr + ' <li> Objective value Z* = ' + this.value() + '</li>';
		  resStr = resStr + ' <li> Solving time = ' + this.solvingTime + ' ms</li></ul>';
		}
		return resStr;
	  }
	



	 show(f: number) {
  
		return new Promise<any>(
		  (resolve, reject) => {
			//  this.row = [];
		   
			console.warn('=========== SHOW CALLED =====================', f);
			this.header = [];
			this.header.push(' ');
			this.header.push('XB');
			for (var i = 1; i < this.numberOfConstraints + this.numberOfOriginalVariables + 1; i++) {
			  this.header.push('x' + i);
			}
			this.header.push('b');
	
	
			// this.result.push(this.header);
	
			// var row =[];
			for (let i: number = 0; i <= this.numberOfConstraints; i++) {
			  this.row = [];
			  if (i != this.numberOfConstraints) {
				console.log('BASIS ', i, ' = ', this.basis[i]);
				this.row.push('x' + (this.basis[i] + 1));
			  } else {
				this.row.push('Cj-Zj');
			  }
			  for (let j: number = 0; j <= this.numberOfConstraints+ this.numberOfOriginalVariables; j++) {
				// console.log("%7.2f", this.A_coeff[i][j]);
				// console.log("\t", this.A_coeff[i][j]);
				// Number((6.688689).toFixed(1));
				if (this.tableaux[i][j] % 1 != 0) {
				  this.row.push(Number(this.tableaux[i][j]).toFixed(2));
				} else {
				  this.row.push(this.tableaux[i][j]);
				 console.log(this.tableaux[i][j]);
				  

				}
	
	
				//  this.A_coeff.push(row);
			  }
			  console.log('ROW ', i, ' = ', this.row);
			  this.result.push(this.row);
	
			  console.log("");
			}
		   // this.tab=[];
			console.log("value = " + this.value());
			this.tab.push("value = " +this.value());
			for (let i: number = 0; i < this.numberOfConstraints; i++) {
			  if (this.basis[i] < this.numberOfConstraints) {
	
				//  console.log("x_" + this.basis[i] + " = " + this.A_coeff[i][this.M + this.N]);
				console.log("x_" + this.basis[i] + " = " + this.tableaux[i][this.numberOfConstraints + this.numberOfOriginalVariables]);
				this.tab.push("x_" + this.basis[i] + " = " + this.tableaux[i][this.numberOfConstraints+ this.numberOfOriginalVariables]);
			   
			  }
			 
			}
			//  return this.result; 
	
			// console.warn('ROW TAB >>>> ', i, ' = ', this.result);
		 
		  
			this.tableauList.push(this.result);
			this.result = [];
	
			//----------------------------
			//console.log('addFamTiers ', fam0);
			resolve();
		  })
	  }
	
	


}






