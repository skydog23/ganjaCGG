notebook();

// Thanks to Steven De Keninck for making the ganja.js library
let {ge, pbut} = Algebra(2,0,1,()=>{
  let pause = true;
  let pbut = button('animate', ()=> {pause = !pause; });

    // Using Geometric/Clifford algebra with signature (2,0,1), based on the work of Charles Gunn
  var pt    = (x,y)=>1e12-x*1e02+y*1e01,
      line  = (a,b,c)=>c*1e0+a*1e1+b*1e2;
  
  // bring the pencil in P is perspective with the pencil in Q
  var circle = [...Array(5)].map((x,k)=>pt(Math.cos(-9*Math.PI/10+Math.PI*2*k/5), Math.sin(-9*Math.PI/10+Math.PI*2*k/5))),
      P=pt(-1,0), //circle[0], 
      U=circle[1],
      Q=circle[2],
      V=circle[3],
      W=circle[4],
      m=()=>U&W,
      M=()=>(P&V)^(Q&W),
      p=()=>U&V,
      n=300 , s = 0;

  var conicPart = [], j = 0, oldJ = 0;
  

	let mkcurve = (arr, closed=true)=>{let n = arr.length, cv = arr.map((x,i)=> [x,arr[(i+1)%n]]);
	  if (!closed) cv.pop();
	  return cv;
	};
  let mkcurveproj = (arr, closed=true)=>{let n = arr.length,
			segs = arr.map((x,i)=> [x,arr[(i+1)%n]]);
			if (!closed) segs.pop();
			let finsegs = segs.filter(([p0,p1])=>p0.e12 * p1.e12 > 0);
		if (arr.length == finsegs.length) return finsegs;
		let infinsegs = segs.filter(([p0,p1])=>p0.e12 * p1.e12 <= 0),
			infinarr = [];
		infinsegs.map(([p0, p1])=> {
			let np0 = p0.Normalized, np1 = p1.Normalized;
			let V0 =(1.0001*np0 + np1), 
				V1 = (np0 + 1.0001*np1);
			infinarr.push([p0, V0]);
			infinarr.push([V1, p1]);
		});
		return finsegs.concat(infinarr);
	}

   var ptOnConic = (t) => {
     let X = (Math.cos(Math.PI*t)*1e01 + Math.sin(Math.PI*t)*1e02), // direction vector with angle PI*t
       lineInP = P&X; // the ideal point in a given direction
      return lineInP^(((((lineInP)^m)&M)^p)&Q);     // the chain of perspectivities P m M p Q
   }
   let ge = this.graph(()=>{
        var X = (a) =>(Math.cos(Math.PI*a)*1e01 + Math.sin(Math.PI*a)*1e02);
        var pencilP = [...Array(n)].map((x,k)=> () =>P&X(k/n)),
          rangem = [...Array(n)].map((x,k)=> ()=> (pencilP[k])^m),
          pencilM = [...Array(n)].map((x,k)=> () =>(rangem[k])&M),
          rangen =[...Array(n)].map((x,k)=> ()=> (pencilM[k])^p),
          pencilQ = [...Array(n)].map((x,k)=> () =>(rangen[k])&Q),
          conic = [...Array(n)].map((x,k)=> ptOnConic(k/(1.0*n)));

          if (!pause)  {
              s = s + 1;
              j = Math.floor((s))%n;
              if (j==0) conicPart = [];
              if (j != oldJ) {
                conicPart.push(conic[j]);
                oldJ = j;
              }
          }
          return [
                  0x00ff00, pencilP[j],  
                  0xaa6600, rangem[j], 
                  0x00aaaa, pencilM[j],
                  0x0000ff, rangen[j],
                  0xff00ff, pencilQ[j],
                  0xf78708, conic[j],
                  0x0000ff, m, "m",p,"n",M,"M",
                 0xff0000, P,"P", Q,"Q",U,"U", V,"V",W,"W",
                 0xf78708, ...mkcurveproj(conicPart, false),
                 ]
                  //0x444444, ...conicPart,
    },{
        // more render properties for the default items.
        pointRadius:1.0,  // point radius
        lineWidth:2,      // line width
        fontSize:1.5,     // font size
        grid:false,         // grid
     width:window.innerWidth,
     animate:true});
     return {ge, pbut}
});

md`\title{Projective generation of conics}
\date{December 2022}
\author{Charlie Gunn}

${embed(pbut)} 
\includegraphics{${embed(ge)}}

`
