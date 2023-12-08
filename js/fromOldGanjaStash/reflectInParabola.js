// A simple demo of reflecting a line pencil in a parabola
// 
// Copyright 2021 Charles Gunn
Algebra(2,0,1,()=>{
  // standard point definition
  var point = (x,y)=>1e12-x*1e02+y*1e01;
  var vector = (x,y)=>-x*1e02+y*1e01;
  var line = (a,b,c)=>a*1e1+b*1e2+c*1e0;
  var {sin, cos, E, PI, abs, sign, sqrt, floor} = Math;
  var clerp = (t)=> floor((1-t)*255)*65536 + floor(t*255);
  var num = 100;   // points on parabola
  var penN = 30;   // number of samples of line pencil
  var P = point(0,.25);   // focal point to start with.

  // this demo works with the standard parabola y = x^2.
  var para = [...Array(num)].map((f,i)=>{let x = 4 *(i-50)/num; return point(x,x*x)}).map((x,i,a)=>[x,a[(i+1)%num]]);
;
	// create line pencil centered in P with num samples
  var pencil = (P,num) => [...Array(num)].map((x,i)=> vector(sin(i/num*PI),cos(i/num*PI))).map((x)=>(P&x).Normalized); //.map((x,i) => [lerp(0xff0000, 0x0000ff, i/num), x]).flat();

  // return the real roots of a*t^2+b*t+c=0
  var root = (a,b,c) => {let disc = b*b-4*a*c; 
      return disc >= 0 ? 
                (a == 0 ? 
                  [-c/b] : [(-b-sqrt(disc))/(2*a), (-b+sqrt(disc))/(2*a)]) : []};
  // from a line m, generate an object consisting of the line, one of its intersection points, 
  // the tangent line there, and a passed-in color.
  var intersectLinePara = (m)=>root(m[1].e2,m[1].e1,m[1].e0).map((r)=>{
      let  ppt = point(r, r*r), tvec = vector(1,2*r), tline = ppt & tvec;
      return {ln:m[1], pt:ppt, tan:tline, c:m[0]} 
  });

  var canvas=document.body.appendChild(this.graph(
      ()=>{
       console.log("P = ",P);
       var pen = pencil(P, penN);
       var coloredpen = pen.map((x,i) => [clerp( i/penN), x]);
       // have to sort the points based on the x-coordinate in order to draw the caustic curve later
       var linepts = coloredpen.map((x) => intersectLinePara(x)).flat().sort((a,b)=>(a.pt.e02 - b.pt.e02));
      // console.log("linepts = ",linepts);
       var pts = linepts.map((x)=> [x.c,x.pt]);
      // console.log("clr pen = ",coloredpen);
       var tans = linepts.map((x)=> [x.c,x.tan]);
       var refls = linepts.map((x)=> [x.c, x.tan >>> x.ln]);
       var caustic = refls.map((x,i,a)=>{let nn = refls.length; return [x[0], x[1] ^ a[(i+1)%nn][1]]}).slice(0,-1);
//       caustic = caustic.map((x,i,a)=>{let nn = caustic.length; return [x[0], [x[1], a[(i+1)%nn][1]]]}).slice(0,-1);
         return [0x0, "Drag P to move the pencil",
            0x0, P,  "P", 
            0x0, ...para,
            0x0000ff, ...coloredpen.flat(),
            0x000000, ...pts.flat(),
            0xaaffaa, ...tans.flat(),
            0xff0000, ...refls.flat(),
            0xaa0000, ...caustic.flat()
        ]
      },      
      {animate:false,grid:true,pointRadius:.75,lineWidth:1}
  ))
  canvas.style.backgroundColor = "white"
})
