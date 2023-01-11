// suggested improvement of implementation of dual option to the graph() function
// The problem arises when dualizing line segments [[A,B]] or polygons [[A,B,C]].
// A line segment AB is the set of all points between A and B. 
// Rendering a line segment supported by graphical API's.
// The dual of a line segment is a so-called "fan": all the lines "between" two given lines
// It is NOT supported by graphical API's. I'm not proposing that it should be implemented.
// My suggestion is to render the "end-lines" of the segment (resp. the vertices of the pollygon).
// It's not a perfect solution, but it's preferable I think to drawing the wrong geometry, or drawing nothing.
// Charles Gunn, 21.03.2022

Algebra(2,0,1,()=>{
  
  var point = (x,y,z)=>z*1e12-x*1e02+y*1e01;
  var line = (x,y,z)=>x*1e1+y*1e2+z*1e0;
  var fixit = (b, g)=>b ?  g.flat(5) : (Array.isArray(g) && Array.isArray(g[0]) ? g : [g]);
  var {E, PI} = Math;
  
  // our geometry is three equilateral triangles of different sizes
  var rotor = E**(2*PI/3*1e12);
  var A = point(0,1,1),
      B = rotor>>>A,
      C = rotor>>>B,
      D = point(0,1.5,1),
      E = rotor>>>D,
      F = rotor>>>E,
      G = point(0,.6,1),
      H = rotor>>>G,
      I = rotor>>>H;

  var doDual = false,
      doExtension = false,
      doit = (doDual && doExtension);
  
  return this.graph(()=>{
    return ["Incomplete implementation of 'dual' option.", 
       "To see problem: Change value of 'doDual' variable to 'true'",
       "To see proposed solution: Change value of 'doExtension' variable to 'true'","",
       0xff0000, A,'A', B,'B', C,'C',
       0xaa00aa, ...fixit(doit,[[D,E],[E,F],[F,D]]),
       0xaa8800, ...fixit(doit,[G,H,I]),
       ]
    }, {
      lineWidth:2,
      pointRadius:1,
      scale:.6,
      grid:true,
      dual:doDual});
})
