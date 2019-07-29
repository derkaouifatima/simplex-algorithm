import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RationalArithmProvider } from '../rational-arithm/rational-arithm';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { TitleCasePipe } from '@angular/common';

/*
  Generated class for the RationnalSimplexProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
let a1: RationalArithmProvider;
@Injectable()
export class SimplexFractionProvider {
   private a: RationalArithmProvider[][]; //matrice des contraintes
  private M: number; //nombres de contrainte
  private N: number; //nombre de variable
  public basis: number[]; //tableau pour afficher- resultat
  public optBasis: any[]; //tableau pour afficher- resultat
  //a1: RationalArithmProvider;
  tab:any= new Array<any>();
  public A_coeff:   any[][];
   public fractionsimplex : RationalArithmProvider;
   public fractionsimplex1:RationalArithmProvider[][];
   
   public EPSILON = 1.0E-10;
   public sol: any[] = new Array<any>();
   header_fraction: string[] = [];
  
   maximizeOrMinimize : boolean;
 
   tableauList_fraction: any[] = [];
   // tableau: Array<{ cj: any, xb: any, body: any, cjMinusZj: any }> = [];
   public solvingTime: number = 0; 
  constructor() {

  }
  public init_Simplex_Tableau1(a: any[][], b: any[], c: any[]  ,maximizeOrMinimize:boolean) {
	  this.maximizeOrMinimize = maximizeOrMinimize;
    this.M = b.length;
    this.N = c.length;

    console.log("Hello from Simplex service....\n");

    this.A_coeff = new Array(this.M + 1);
    this.fractionsimplex1=new Array(this.M +1);
   /** */
   
    for (let i: number = 0; i < this.M; i++) {
      this.A_coeff[i] = new Array(this.M + this.N + 1).fill(0);
      this.fractionsimplex1[i]=new Array(this.M + this.N + 1).fill(0);
      for (let j: number = 0; j < this.N; j++) {
        /** */
     

     this.A_coeff[i][j] =a[i][j];
    this.fractionsimplex1[i][j] =a[i][j];
      }
    }

    this.A_coeff[this.M] = new Array(this.M + this.N + 1).fill(0);
this.fractionsimplex1[this.M] = new Array(this.M + this.N + 1).fill(0);
    for (let j: number = this.N; j < this.M + this.N; j++) {
      //les coef de var de base
    // this.A_coeff[j - this.N][j]= new RationalArithmProvider(1,1);
     // this.A_coeff[j - this.N][j].division(this.A_coeff[j - this.N][j]);
// this.A_coeff[j - this.N][j] = s;

    this.A_coeff[j - this.N][j] = 1.0;
  ///this.fractionsimplex1[j - this.N][j] = new RationalArithmProvider(1,1);
 this.fractionsimplex1[j - this.N][j] = new RationalArithmProvider(1,1) ;
    }
    for (let j: number = 0; j < this.N; j++) {
      //ci-zj
       this.A_coeff[this.M][j] = c[j];
       this.fractionsimplex1[this.M][j] = c[j];
   
    }
    for (let i: number = 0; i < this.M; i++) {
      //b 
      this.A_coeff[i][this.M + this.N] = b[i];
      this.fractionsimplex1[i][this.M + this.N] = b[i];
     
    }

    console.log("------------ END INIT Simplex tableau -------------");
    /*
        for (let i: number = 0; i <= this.M; i++) {
          console.log("----- Line: ", i);
          for (let j: number = 0; j <= this.M + this.N; j++) {
            console.log("%7.2f", this.A_coeff[i][j]);
          }
          console.log("-/-/-/-/-");
        }*/

    this.basis = new Array(this.M);
    for (let i: number = 0; i < this.M; i++) {
      this.basis[i] = this.M + i;
    }
  }
  ////////
  public value1(): any {
    // val fct objectif
  this.fractionsimplex1[this.M][this.M + this.N] = this.A_coeff[this.M][this.M + this.N];

        return -this.fractionsimplex1[this.M][this.M + this.N];
  }

  solve1() {

    return new Promise<boolean>(
      (resolve, reject) => {
    
        var start = new Date().getTime();
        var f = 1;
        let sol: any[] = new Array<any>();
  
  
    while (true) {
   this.showTab(f).then(data => {
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
   
     this.pivot1(p, q);
  
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

     dantzig() :number {
      let q = 0;
      for (let j = 1; j < this.M + this.N; j++)
       if (this.A_coeff[this.M][j] > this.A_coeff[this.M][q])
        q = j;
  
      if (this.A_coeff[this.M][q] <= 0)
       return -1; // optimal
      else
       return q;
     }
  
     // index of a non-basic column with most negative cost
    dantzigNegative():number {
      let q = 0;
      for (let j = 1; j < this.M + this.N; j++)
       if (this.A_coeff[this.M][j] < this.A_coeff[this.M][q])
        q = j;
  
      if (this.A_coeff[this.M][q] >= 0)
       return -1; // optimal
      else
       return q;
     }
  
     // find row p using min ratio rule (-1 if no such row)
      minRatioRule(q:number) :number{
      let p = -1;
      for (let i = 0; i < this.M; i++) {
       if (this.A_coeff[i][q] <= 0)
        continue;
       else if (p == -1)
        p = i;
       else if ((this.A_coeff[i][this.M
         + this.N] / this.A_coeff[i][q]) < (this.A_coeff[p][this.M
         + this.N] / this.A_coeff[p][q]))
        p = i;
      }
      return p;
     }
  
  public pivot1(p: number, q: number): void {
    for (let i: number = 0; i <= this.M; i++) {
      for (let j: number = 0; j <= this.M + this.N; j++) {
        if (i != p && j != q) {
          if (this.A_coeff[i][j] % 1 != 0) {
            this.A_coeff[i][j]=(Number(this.A_coeff[i][j]).toFixed(2));
          
              this.fractionsimplex1[i][j]=new RationalArithmProvider(this.A_coeff[i][j],1)
              this.fractionsimplex1[p][j]=new RationalArithmProvider(this.A_coeff[p][j] * this.A_coeff[i][q] ,this.A_coeff[p][q]);
              this.fractionsimplex1[i][j].sustraction( this.fractionsimplex1[p][j]);
                this.A_coeff[i][j] -= this.A_coeff[p][j] * this.A_coeff[i][q] / this.A_coeff[p][q]; 
            
            
         
          }
          else{
         //this.fractionsimplex= new RationalArithmProvider(this.A_coeff[p][j] * this.A_coeff[i][q] , this.A_coeff[p][q]);
          //this.fractionsimplex1[i][j]= this.A_coeff[i][j] ;
this.fractionsimplex1[i][j]=new RationalArithmProvider(this.A_coeff[i][j] ,1);
      //  let a1 =  this.fractionsimplex1[i][j]/(this.fractionsimplex);
    this.fractionsimplex1[p][j]=new RationalArithmProvider(this.A_coeff[p][j] * this.A_coeff[i][q] ,this.A_coeff[p][q]);
this.fractionsimplex1[i][j].sustraction( this.fractionsimplex1[p][j]);
      this.A_coeff[i][j] -= this.A_coeff[p][j] * this.A_coeff[i][q] / this.A_coeff[p][q]; 
      
    }}
   

      }
    }
    for (let i: number = 0; i <= this.M; i++) {
      if (i != p) {
     //   this.A_coeff[i][q] =new RationalArithmProvider(0,1);
       this.A_coeff[i][q] = 0;
     this.fractionsimplex1[i][p]=this.A_coeff[i][q] ;
      }
    }
    for (let j: number = 0; j <= this.M + this.N; j++) {
      if (j != q) {
         if (this.A_coeff[p][j] %1!=0 && this.A_coeff[p][q] %1!=0  ){
        this.A_coeff[p][j]=Number(this.A_coeff[p][j]).toFixed(2);
        this.A_coeff[p][q]=Number(this.A_coeff[p][q]).toFixed(2);
        this.fractionsimplex1[p][j] = new RationalArithmProvider(   this.A_coeff[p][j] ,this.A_coeff[p][q]);
  this.fractionsimplex1[p][j].simplification();
   this.A_coeff[p][j] /= this.A_coeff[p][q];
  
 
      
          //this.A_coeff[p][j] /= this.A_coeff[p][q];
        // console.log("%7.2f",  this.A_coeff[p][j]);
         console.log("%7.2f",   this.fractionsimplex1[p][j])
      }
     

  }
  else{
    this.fractionsimplex1[p][j] = new RationalArithmProvider(   this.A_coeff[p][j] ,this.A_coeff[p][q]);
  this.fractionsimplex1[p][j].simplification();
   this.A_coeff[p][j] /= this.A_coeff[p][q];
  
 
      
          //this.A_coeff[p][j] /= this.A_coeff[p][q];
        // console.log("%7.2f",  this.A_coeff[p][j]);
         console.log("%7.2f",   this.fractionsimplex1[p][j])

  }
 // this.fractionsimplex= new RationalArithmProvider( this.A_coeff[p][j] , this.A_coeff[p][q]);
   //  this.fractionsimplex.simplification;
  //this.A_coeff[p][j]= new RationalArithmProvider( this.A_coeff[p][j] , this.A_coeff[p][q]);

}


//this.A_coeff[p][q]=new RationalArithmProvider(1,1);
 
this.A_coeff[p][q] = 1;
this.fractionsimplex1[p][q]= new RationalArithmProvider(1,1); 
this.fractionsimplex1[p][q].simplification();

    this.basis[p] = q;

}
  public sol1: any[] = new Array<any>();
  public getOptimalSol1() {
  this.sol1=[];
  var resStr = "";

  // this.loadingMsg = " <p><strong>Chargement en cours...</strong> </p>"
  //         + "<ul>" +
  //         "<li>Articles : " + nbArts0 + "</li>" +
  //         "<li>Reste : " + this.msToTime(estimatedTotalTime) + "</li>" +
  //         "</ul>" +
  //         " <p>Patientez SVP. </p>";

  resStr = '<h4><strong>Optimal solution found </strong> </h4><ul>';

    for (let i: number = 0; i < this.M; i++) {
      if (this.basis[i] < this.M) {
       // this.A_coeff[i][this.M + this.N]= this.fractionsimplex1[i][this.M + this.N];
       // sol.push("x_" + this.basis[i] + " = " + this.A_coeff[i][this.M + this.N]);
     //   this.sol1.push("x_" + this.basis[i] + " = " + this.fractionsimplex1[i][this.M + this.N]);
     resStr = resStr + ' <li> x*' + (this.basis[i] + 1) + ' = ' +  this.fractionsimplex1[i][this.M + this.N] + '</li>';
        //   console.log("x_" + this.basis[i] + " = " + this.A_coeff[i][this.M + this.N]);
      }
    }
    if (this.basis.length){
   
    /*  this.sol1.push("Objective value = " + this.value1());
      this.sol1.push("Solving time = " + this.solvingTime + " ms");*/
      resStr = resStr + ' <li> Objective value Z* = ' + this.value1() + '</li>';
      resStr = resStr + ' <li> Solving time = ' + this.solvingTime + ' ms</li></ul>';
    }
    return resStr;
     // sol.push("Objective value = " + this.value1());

  
  }
  result = []; 
  row = [];
  col = [];

  res = [];
  showTab(f: number){ 
    return new Promise<any>(
      (resolve, reject) => {
        console.warn('=========== SHOW CALLED =====================', f);
    
        this.header_fraction = [];
        this.header_fraction.push(' ');
        this.header_fraction.push('XB');
 
    for (var i = 1; i < this.M + this.N + 1; i++) {
      this.header_fraction.push('x' + i);
    }
    this.header_fraction.push('b');
    for (let i: number = 0; i <= this.M; i++) {
      this.row = [];
      if (i != this.M) {
        console.log('BASIS ', i, ' = ', this.basis[i]);
        this.row.push('x' + (this.basis[i] + 1));
      } else {
        this.row.push('Cj-Zj');
      }
      for (let j: number = 0; j <= this.M + this.N; j++) {
                    // console.log("%7.2f", this.A_coeff[i][j]);
            // console.log("\t", this.A_coeff[i][j]);
            // Number((6.688689).toFixed(1));
            
              // console.log("%7.2f", this.A_coeff[i][j]);
              if(this.A_coeff[i][j] %1 !=0){
                this.A_coeff[i][j]=Number(this.A_coeff[i][j]).toFixed(2);
                console.log("%7.2f", this.fractionsimplex1[i][j]);
              //  this.fractionsimplex1[i][j].simplification();
                this.row.push(this.fractionsimplex1[i][j]);
              }
              else{
                console.log("%7.2f", this.fractionsimplex1[i][j]);
              this.row.push(this.fractionsimplex1[i][j]);
              }
              
          

            
              
      } 
      console.log('ROW ', i, ' = ', this.row);
       this.result.push(this.row);
      console.log("");
    }

    console.log("value = " + this.value1());
    this.tab.push("value = " , this.value1());

    for (let i: number = 0; i < this.M; i++) {
      if (this.basis[i] < this.M) {
    
       
      //  console.log("x_" + this.basis[i] + " = " + this.A_coeff[i][this.M + this.N]);
        console.log("x_" + this.basis[i] + " = " + this.fractionsimplex1[i][this.M + this.N]);
        this.tab.push("x_" + this.basis[i] + " = " +  this.fractionsimplex1[i][this.M + this.N]);
      
      }
    } 
     this.tableauList_fraction.push(this.result);
     this.result = [];
     resolve();
      })
    // return this.res;
  }
 

}
