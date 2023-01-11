// Copyright 2021 Charles Gunn
Algebra(2,0,1,()=>{
  // standard point definition
  var point = (x,y)=>1e12+x*1e20+y*1e01;
  var line = (x,y,z)=>x*1e1+y*1e2+z*1e0;
  var {sin, cos, E, Pi, sign} = Math;
  var areaTri = (pts) => pts.length == 0 ? 0 : ((pts[0] & (pts[1] & pts[2])).s)/2;
  var count = 0;
  // returns an array [np, pp] consisting of a non-negative polygon and a non-positive polygon
  // When the original triangle lies on one side of the plane then it returns either
  // [pts, []] or [[], pts] depending on whether it lies on the + or - side of the line
  // (i.e. whether P ^ line > 0 or < 0, resp.
  // When it's split or touched by the plane then the cut forms 
  // a triangle and a quadrilateral which may be degenerate (repeated vertices)
  
  var cutTriWithLine = (pts, lines, line) => {
    var d = pts.map( P => (!(P ^ line)).s); // signed distances to line
    // we don't need to handle distance 0 specially
    var npos = d.reduce( (acc, el) => acc+ ((el >= 0) ? 1 : 0), 0);
    // if ((count++ % 100)==0) console.log("npos = "+npos,nneg);
    if (npos == 3) return [pts, []];
    if (npos == 0) return [[], pts];
    // to be here means we know that there is exactly 1 positive or exactly 1 negative
    // distance. we search for the index of this singleton sign and then
    // cut the triangle to form one triangle with this vertex and one quadrilateral
    // with the other two.
    // calculate the three indices of the triangle needed for the cut
    var i = (npos == 1) ? (d[0] > 0 ? 0 : ((d[1] > 0) ? 1 : 2)) :
      (d[0] < 0 ? 0 : ((d[1] < 0) ? 1 : 2)),
      j = (i+1)%3,
      k = (i+2)%3;
    // we compute all intersections of the line with the three sides 
    // but only use the two that on sides adjacent to the singleton sign.
    var cuts = lines.map( (m) => (m^line).Grade(2).Normalized);
    var tri = [pts[i], cuts[j], cuts[k]],
        quad =  [cuts[k], cuts[j], pts[k], pts[j]];
    // the order of the returned polygons is [+0, -]
    return npos == 1 ? [tri, quad] : [quad, tri];
  } 
  var A = point(0,1),
      B = point(1,0),
      C = point(-.5,-.5),
      E = point(1.5,.2),
      F = point(-1.5,.2);

  var canvas=document.body.appendChild(this.graph(
      ()=>{
      var a = B&C,
        b = C&A,
        c = A&B,
        m = E&F,
        segs = [[A,B],[B,C], [C,A]];

      var polys = cutTriWithLine([A,B,C], [a,b,c], m);
      // areas
      var aABC = areaTri([A,B,C]),
          aCutTri = areaTri(polys[ polys[0].length == 3 ? 0 : 1]),
          aQuad = (aABC - aCutTri);
//  if ((count++ % 100)==0) console.log("area = ",aABC,aCutTri);
         // return the elements we want graphed
         return [0x0, "Drag the points.", "**********",
          "Area ABC = "+aABC.toFixed(3),
         "Area cut tri = "+aCutTri.toFixed(3),
         "Area cut quad = "+aQuad.toFixed(3),
            0xFF0000, A, "A", B, "B", C, "C", 
            0x00aaff, polys[0],   // on the positive side of the line
            0xff0000, polys[1],   // on the negative side of the line
            0xff8800, ...segs,
            0x00ff00, E, F, m,
        ]
      },      
      {animate:true,grid:true,pointRadius:1,lineWidth:2}
  ))
  canvas.style.backgroundColor = "white"
})
