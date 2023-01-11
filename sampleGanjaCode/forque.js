notebook(``)

document.head.appendChild(Object.assign(document.createElement('style'),{innerText:`
  html {
    counter-set : form_counter;
  }
  .formula {
    position          : relative;
    background-color  : rgba(0,200,160,0.2) !important;
    border            : 1px solid black;
    counter-increment : form_counter;
  }
  .formula:after {
    position : absolute;
    top : 5px;
    right: 5px;
    color : rgba(0,0,0,0.3);
    content : "(" counter(form_counter) ")";
  }
`}))

md(`# May the Forque be with you.

> This is an internal document. Please do not share.

## Images

### Orientation line/plane

`)

Algebra({p:3,r:1,baseType:Float64Array},()=>{

// New algorithms from "Graded Symmetry Groups - Plane and simple"
// Open the console for output.

// Split bivector B into commuting simple b1 and b2
// so that B = b1 + b2 and b1b2 - b2b1 = 0.
function split(B) {
  if (B*B == 0) return [0e1, B]
  var b2 = (B ^ B) / (2 * B);
  var b1 = B - b2;
  return [b1,b2];
}

// Split rotor R into commuting rotation and translation
// Returns [rotation, translation]. Chasles' theorem. 
function splitRotor(R) {
  if (R.Grade(4) == 0) return (R.s == 1) ? [1 + 0e1, R] : [R, 1 + 0e1];
  var tran = 1 + R.Grade(4) / R.Grade(2);
  var rot  = R * ~tran;
  return [rot,tran];
}

// Calculate the logarithm of normalized rotor R
// Returns a bivector B so that exp(B) = R
// First splits R into commuting rotation and translation
// so that R = rot*tran = tran*rot and log(R) = log(rot) + log(tran).
// For a rotation the log is a simple inverse Euler
// For the translation it is simply the motor minus one (or the grade 2 part).
function log(R) {
  var [rot, tran] = splitRotor(R);
  return tran.Grade(2) + rot.Grade(2).Normalized * Math.acos(rot.s);
}  

// Calculate the exponential of bivector B
// Returns a normalized motor M
// First splits the bivector into commuting simple rotbv and tranbv
// so that now Exp(B) = Exp(rotbv) * Exp(tranbv)
// where Exp(rotbv) is a simple cos/sin Euler
// and Exp(tranbv) simply is 1 + tranbv.
function exp(B) {
  var [rotbv, tranbv] = split(B);
  var l = rotbv.Length;
  return (Math.cos(l) + Math.sin(l) * rotbv.Normalized) * (1 + tranbv);
}
  
  



// Add in little visual for Chasles'

var planeAt = function( plane, axis, clip ) {
  var motor   = exp(0.5*log(plane.Normalized / 1e3));
  var points  = motor >>> ([...Array(4).keys()]
                .map(x=>!(('00'+[0,1,3,2][x].toString(2)).slice(-2).split('').map(x=>x-0.5) * [1e1,1e2] + 1e0)));
  var lines   = points.map((x,i,a)=>[x,a[i+1]||a[0]]);
  if (axis) {
    var center  = points.reduce((s,p)=>s + p*0.25, 0);
    var desired = (plane ^ axis).Normalized;
    var tran    = (1 - desired / center).Normalized;
  } else tran = 1;
  return tran >>> [...lines, points];
}

const {E,PI} = Math;
var roundarrow = function( plane, size ) {
  var motor   = exp(0.5*log(plane.Normalized / 1e3));
 // motor = (1+1e3*plane.Normalized).Normalized;
  const n = 32, hn = n/2;
  var points = [...[...Array(n).keys()].map(
            x=> E ** ((x==n-2?(x-1)/hn:x/hn)*1.5e12) * (1 + (x==n-1?0.125e01:x==n-2?0.08e01:0.1e01)) >>> !1e0),
                ...[...Array(n).keys()].map(
            x=> E ** (((n-1)-(x==1?2:x))/hn*1.5e12) * (1 +(x==0?0.125e01:x==1?0.17e01:0.15e01)) >>> !1e0)]
  
  return motor * E**(T*PI*2*1e12) >>> points;
}

var roundarrow2 = function( plane, size ) {
  return []
  var motor   = exp(0.5*log(plane.Normalized / 1e3));
 // motor = (1+1e3*plane.Normalized).Normalized;
  const n = 8, hn = n/2;
  var segment = [!(1e0-.01e3),!(1e0+.01e3)]
  var points = [...Array(4)].map((x,i)=>E**(PI*i*0.25e12) >>> [...Array(3)].map((x,i)=>(1+0.25e02+(0.125-0.125*i)*1e01)*E**(PI/4*1e13)>>>[...Array(n)].map((x,i)=>[
    ...E**(-T*PI*1e12+PI*0.6*i/n*1e12)*(1+0.05e01)>>>((i==0)?[!(1e0-0.05e2)]:segment),
    ...E**(-T*PI*1e12+PI*0.6*(i+1)/n*1e12)*(1+0.05e01)>>>((i==0)?[!(1e0+.05e3),!(1e0-.05e3)]:segment.reverse())
  ])).flat()).flat()
  return motor >>> points;
}

var lineArrow2 = function( plane, size=1, color=0x0e3a48 ) {
  var motor   = exp(0.5*log(plane.Normalized / 1e3));
 // motor = (1+1e3*plane.Normalized).Normalized;
  const n = 8, hn = n/2;
  var segment = [!(1e0-.01e3),!(1e0+.01e3)]
  var points = [...Array(3)].map((x,i)=>(1+(0.125-0.125*i)*1e01)*E**(PI/4*1e13)>>>[...Array(n)].map((x,i)=>[
    ...E**(-T*PI*1e12+PI*0.6*i/n*1e12)*(1+0.05e01)>>>((i==0)?[!(1e0-0.05e2)]:segment),
    ...E**(-T*PI*1e12+PI*0.6*(i+1)/n*1e12)*(1+0.05e01)>>>((i==0)?[!(1e0+.05e3),!(1e0-.05e3)]:segment.reverse())
  ])).flat();
  return motor >>> [[!(1e0+size*1e1),!(1e0-size*1e1)],color,...points];
}

var lineArrow = function( plane, size=1, color=0x0e3a48 ) {
  var motor   = exp(0.5*log(plane.Normalized / 1e3));
 // motor = (1+1e3*plane.Normalized).Normalized;
  const n = 32, hn = n/2;
               
  var points = E**(PI/4*1e12)>>>[...Array(5)].map((x,i)=>
                 (1-i/5*0.7e02-(1-((T*4+0.9)%1))*0.1e02+0.3e02)>>>[!1e0,!(1e0+0.1e1+0.1e2),!(1e0+0.1e2-0.1e1)]
               );
  return motor >>> [[!(1e0+size*1e1),!(1e0-size*1e1)],color,...points];
}

var boxarrow = function( plane, size ) {
  return []
  var motor   = exp(0.5*log(plane.Normalized / 1e3));
 // motor = (1+1e3*plane.Normalized).Normalized;
  const n = 32, hn = n/2;
               
  var points = [...Array(4)].map((x,i)=>
                 (E**(Math.PI*i/4*1e12)) >>> [...Array(5)].map((x,i)=>
                 (1-i/5*0.5e02-(1-((T*4+0.5)%1))*0.1e02)*(1-0.25e01+0.25e02)>>>[!1e0,!(1e0+0.05e1+0.05e2),!(1e0+0.05e2-0.05e1)]
               )).flat();
  return motor >>> points;
}


var cut = function(A,B) {
  var pB = (B[4][0]) & (B[4][1]) & (B[4][2]);
  var motor   = exp(-0.5*log(pB.Normalized / 1e3));
  var points = A.slice(0,4).map(([x,y])=>{
    return ((x & y) ^ pB).Normalized;
  }).filter(p=>{
    var p_in_b = (motor >>> p).Normalized;
    return p.e123 && 
           Math.abs(p_in_b.e013) < 0.51 &&
           Math.abs(p_in_b.e023) < 0.51;
    
  });
 // if (points.length == 3) console.log(points+'');
  if (points.length != 2) return 0;
  return points;
  
  
}
var options = {
  grid:0, h:+0.03, p:-0.3, scale:1.4, fontSize:11,clip: 1, labels:1, pointRadius:0.001,lineWidth:10, animate:1
}
var circle = function(a=1,c1=0x3891b7,c2=0x0e3a48) {
    
    var n = 16;
    
    var points = [...Array(n)].map((x,i)=>E**(i/n*PI*1e12)>>>!(1e0+0.1e1));
    
    var n = 6
    
    var arrows = [...Array(n)].map(
        a==1?(x,i)=>E**(i/n*PI*1e12)>>>Element.arrow(!(1e0+0.1e1),!(1e0+0.2e1),0.01)
        :(x,i)=>E**(i/n*PI*1e12-T*PI*1e12)>>>Element.arrow(!(1e0+0.1e1-0.05e2),!(1e0+0.1e1+0.025e2),0.0075)
      );
    
    return [c1,points,c2].concat(arrows);
  
}

// Desired setup.
var A = 1e1+0.2e0,
    B = 1e1-0.1e0,
    C = 1e2+0.3e3,
    D = 1e2-1e3;
    
// Now twist it.
var BC = Math.E ** ((B ^ C).Normalized * 0.5);

var PA = planeAt(A, C^D),
    PB = planeAt(B, C^D),
    PC = planeAt(C),
    PD = planeAt(D);
    
var c = (this.graph(()=>{
  var time = Math.min(1,Math.max(0,1.5 - ((performance.now() / 5000) % 2)));
//  var [Pb,Pc,b,c] = exp(log(BC)*time) >>> [PB,PC,B,C];
//  var [fPb,fPc] = BC >>> [PB,PC];
  options.animate=false;
  if (window.T === undefined) window.T = 0
  else
  window.T = (performance.now()/10000)%1
  window.T = 0;
  return (1-0.2e01+0.2e02)>>>[

//    0xbab1e7,
//    ...(1-1.01e02+0.65e01)*E**(-0.e23)>>>circle(0),
//    0xbab1e7,
  //  ...(1-1.1e02-0.5e01)*E**(-0.2e13+0.1e23)>>>circle(1),

  //  ...(1e1+0.3e3-0.01e2-1.3e0).Normalized>>>(1-1.1e02-0.5e01)*E**(-0.2e13+0.1e23)>>>circle(1,0x60fbc7,0x1d8165),
  //  ...(1e1+0.05e3-0.01e2+1.5e0).Normalized>>>(1-1.01e02+0.65e01)*E**(-0.e23)>>>circle(0,0x60fbc7,0x1d8165),
    
    ...(1-0.6e02-0.3e01)*E**(0.2e13-0.2e23)>>>[
      0x3891b7,
      ...lineArrow2(1e3,0.9),
  //    0xbab1e7,
  //    ...(1e2+0.2e0)>>>lineArrow2(1e3,0.9,0x8e85bc),
  //    0x60fbc7,
  //    ...(1e1-1e0)>>>lineArrow2(1e3,0.9,0x1d8165),
    ],
    
    ...(1-0.6e02+0.7e01)*E**(-0.2e13-0.2e23)>>>[
      0x009977,
      ...lineArrow(1e3,0.9),
  //    0xbab1e7,
  //    ...(1e2+0.2e0)>>>lineArrow(1e3,0.9,0x8e85bc),
  //    0x60fbc7,
  //    ...(1e1+1e0)>>>lineArrow(1e3,0.9,0x1d8165),
    ],
    
/*
    ...(1-0.4e02)>>>[

      0x8e85bc,
      this.arrow(!(1e0+0.2e1)+!(1e0+2e1-0.00e2),!(1e0+0.2e1)+!(1e0+2e1-0.01e2)-1e013-0.04e023 ,0.015),
      0xbab1e7,
      [!(1e0+0.2e1),!(1e0+2e1-0.02e2)],
      0x8e85bc,
      this.arrow(!(1e0-2e1+0.01e2),!(1e0-0.6e1),0.013),
      this.arrow(!(1e0-2e1+0.01e2),!(1e0-1e1),0.013),
      this.arrow(!(1e0-2e1+0.01e2),!(1e0-1.4e1),0.013),
      this.arrow(!(1e0-2e1+0.01e2),!(1e0-1.8e1),0.012),
      0xbab1e7,
      [!(1e0-0.6e1),!(1e0-2e1+0.01e2)],
    ],



    ...(1-0.5e02)>>>[

      0x0e3a48,
      this.arrow(!(1e0+0.2e1)+!(1e0+2e1-0.01e2),!(1e0+0.2e1)+!(1e0+2e1-0.01e2)+1e013+0.04e023 ,0.015),
      0x3891b7,
      [!(1e0+0.2e1),!(1e0+2e1-0.01e2)],
      0x0e3a48,
      this.arrow(!(1e0-2e1-0.01e2),!(1e0-0.6e1),0.013),
      this.arrow(!(1e0-2e1-0.01e2),!(1e0-1e1),0.013),
      this.arrow(!(1e0-2e1-0.01e2),!(1e0-1.4e1),0.013),
      this.arrow(!(1e0-2e1-0.01e2),!(1e0-1.8e1),0.012),
      0x3891b7,
      [!(1e0-0.6e1),!(1e0-2e1-0.01e2)],
    ],

    // green lines.
    ...(1-0.5e02)>>>[

      0x1d8165,
      (-2.2e0+1e1)>>>this.arrow(!(1e0+0.2e1)+!(1e0+2e1-0.01e2),!(1e0+0.2e1)+!(1e0+2e1-0.01e2)+1e013-0.12e023 ,0.015),
      0x60fbc7,
      (-2.2e0+1e1)>>>[!(1e0+0.2e1),!(1e0+2e1-0.01e2)],
      0x1d8165,
      (2.2e0+1e1)>>>this.arrow(!(1e0-2e1-0.01e2),!(1e0-0.6e1),0.013),
      (2.2e0+1e1)>>>this.arrow(!(1e0-2e1-0.01e2),!(1e0-1e1),0.013),
      (2.2e0+1e1)>>>this.arrow(!(1e0-2e1-0.01e2),!(1e0-1.4e1),0.013),
      (2.2e0+1e1)>>>this.arrow(!(1e0-2e1-0.01e2),!(1e0-1.8e1),0.012),
      0x60fbc7,
      (2.2e0+1e1)>>>[!(1e0-0.6e1),!(1e0-2e1-0.01e2)],
    ],
*/
    // 3d reflection in plane
/*    ...(1-0.6e03+0.35e01+0.35e02)>>>[...(1-0.6e01)>>>(C+0.4e0).Normalized>>>[0xbab1e7,
    ...PC,
    0x8e85bc,
    ...roundarrow2(C,1),
     this.arrow(1e123,(1+C^.5e0)>>>1e123)],
    ...(1+0.3e01+0.2e03)>>>(C+0.5e0).Normalized>>>[0xbab1e7,
    ...PC,
    0x8e85bc,
    roundarrow(C,1),
    ...boxarrow(C,1),
    ]],*/

    // 3d reflection ortho
  /*  ...(1-0.6e03+0.35e01+0.25e02)>>>[...(1-0.6e01)>>>(1e1-0.7e0).Normalized>>>[0x60fbc7,
    ...PC,
    0x1d8165,
    ...roundarrow2(C,1),
     this.arrow(1e123,(1+C^.5e0)>>>1e123)],
    ...(1+0.3e01+0.2e03)>>>(1e1+0.7e0).Normalized>>>[0x60fbc7,
    ...PC,
    0x1d8165,
    roundarrow(C,1),
    ...boxarrow(C,1),
    ]],*/

    // unmirrored 3D blue versions
    ...(1-0.6e03+0.35e01-0.45e02)>>>[...(1-1.2e01)>>>[0x3891b7,
    ...PC,
    0x0e3a48,
    ...roundarrow2(C,1),
     this.arrow(1e123,(1+C^.5e0)>>>1e123)],
    ...(1+1e01+0.2e03)>>>[0x3891b7,0x009977,
    ...PC,
    0x0e3a48,
    roundarrow(C,1),
    ...boxarrow(C,1),
    ]],


  ]
  
  
},options));

c.style.background='white';
c.onwheel = undefined;
c.style.maxHeight='300px';
c.style.border='1px solid #444'

return c;
























})
