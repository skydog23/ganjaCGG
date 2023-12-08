// A simple demo of 2D hyperbolic PGA
// showing how isometries change as the generating bivector P (point)
// moves around. The orbit of a single point Q under the rotor r = e^(tP) is shown.
// User can drag P or Q about.
// 
// Copyright 2021 Charles Gunn
function regenerate() {
Algebra({
    metric:[-1,1,1],
    basis:['1','e0','e1','e2','e01','e02','e12','e012']
}).inline(()=>{
  // standard point definition
  var point = (x,y)=>1e12-x*1e02+y*1e01;
  var line = (x,y,z)=>x*1e1+y*1e2+z*1e0;
  var {sin, cos, E, PI, abs, sign} = Math;
  // force the points to lie on the positive sheet of the hyperboloid
  var hnormalized = (P) => { let Q = P.Normalized; return (Q.e12 < 0) ? -Q : Q; }
  var lerp = (a,b,t)=> (1-t)*a + t*b;
  var num = 51;
  var P = point(0,0);
  var Q = point(.5,0);
 
  var disc = [...Array(100)].map((x,i)=>point(sin(i/50*PI),cos(i/50*PI))).map((x,i,a)=>[x,a[i+1]||a[0]]);    

  var canvas=document.body.appendChild(this.graph(
      ()=>{
      var Pn = hnormalized(P);
      var pn = Pn * 1e012;
      var rotors = [...Array(num)].map((x,i) =>{let t = (PI*((i/(num-1))-(1/2))); return E**((t)*Pn)});
      // // console.log("rotors = ",rotors);
      //var curves = ipts.map((pt,i)=>[lerp(0xff0000, 0x0000ff, i/num), ...rotors.map((rr,ii)=> ((rr >>> pt).Grade(2))).map((x,i,a)=>[x,a[i+1]]).slice(0,-1)]).flat(1);
      var orbit = rotors.map((rr,ii)=> ((rr >>> Q).Grade(2)));
      var orbit2 = orbit.map((x,i,a)=>[lerp(0xff0000, 0x0000ff, i/num), [x,a[i+1]]]).slice(0,-1).flat(1);
      
      var norm = (Pn*Pn).s;
      // we artificially set a threshold to call an isometry "parabolic"
      var type = (Pn.e12 > 8) ? "close to parabolic" : (norm > 0 ? "translation" : "rotation");
      // console.log("curves = ",curves[1]);
         // return the elements we want graphed
         return [0x0, "Drag P to change the isometry", "Drag Q to change to point to follow",
            "The isometry is "+type,
            "P*P = "+norm.toFixed(3), 
            0xFF8800, P, "P", pn, "p",
            0x0000ff, Q, "Q",
            0x0, ...disc,
            0x00aa00, ...orbit2,
        ]
      },      
      {animate:false,grid:true,pointRadius:1,lineWidth:2}
  ))
  canvas.style.backgroundColor = "white"
})()};
regenerate();
