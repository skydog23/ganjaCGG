Algebra(2,0,1, ()=> {
  // Using Geometric/Clifford algebra with signature (2,0,1), based on the work of Charles Gunn
  var pt    = (x,y)=>1e12-x*1e02+y*1e01,
      line  = (a,b,c)=>c*1e0+a*1e1+b*1e2;
  var showConstr = true;
  // bring the pencil in P is perspective with the pencil in Q
  var circle = [...Array(5)].map((x,k)=>pt(Math.cos(-9*Math.PI/10+Math.PI*2*k/5), Math.sin(-9*Math.PI/10+Math.PI*2*k/5))),
      P=circle[0], 
      U=circle[1],
      Q=circle[2],
      V=circle[3],
      W=circle[4],
      m=()=>U&W,
      M=()=>(P&V)^(Q&W),
      p=()=>U&V,
      n=40;

	let mkcurve = (arr)=>{let n = arr.length; return arr.map((x,i)=> [x,arr[(i+1)%n]])};
  let mkcurveproj = (arr)=>{let n = arr.length,
			segs = arr.map((x,i)=> [x,arr[(i+1)%n]]),
			finsegs = segs.filter(([p0,p1])=>p0.e12 * p1.e12 > 0);
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


  // mimic the construction of the conic via a chain of perspectivities between the pencil in P and the pencil in Q
   var ptOnConic = (t) => {
     let X = (-Math.cos(Math.PI*t)*1e20 + Math.sin(Math.PI*t)*1e01), // direction vector with angle PI*t
       lineInP = P&X; // the ideal point in a given direction
      return lineInP^(((((lineInP)^m)&M)^p)&Q);     // the chain of perspectivities P m M p Q
   }
   return this.graph(()=>{
        var X = (a) =>(Math.cos(Math.PI*a)*1e01 + Math.sin(Math.PI*a)*1e02);
        var pencilP = [...Array(n)].map((x,k)=> () =>P&X(k/n)),
          rangem = [...Array(n)].map((x,k)=> ()=> (pencilP[k])^m),
          pencilM = [...Array(n)].map((x,k)=> () =>(rangem[k])&M),
          rangen =[...Array(n)].map((x,k)=> ()=> (pencilM[k])^p),
          pencilQ = [...Array(n)].map((x,k)=> () =>(rangen[k])&Q),
          conic = [...Array(n)].map((x,k)=> ptOnConic(k/(1.0*n))),
          constructions = (showConstr) ? [ 0x00ff00, ...pencilP,  
                  0xaa6600, ...rangem, 
                  0x00aaaa, ...pencilM,
                  0x0000ff, ...rangen,
                  0xff00ff, ...pencilQ,
                  0x0000ff, m, "m",n,"n",M,"M"] : [];
          return [
                  ...constructions,
                  0x444444, ...conic, ...mkcurveproj(conic),
                  0xff0000, P,"P", Q,"Q",U,"U", V,"V",W,"W"]
    },{
        // more render properties for the default items.
        pointRadius:1.0,  // point radius
        lineWidth:2,      // line width
        fontSize:1.5,     // font size
        grid:false,         // grid
        dual:false,
    width:window.innerWidth,
    animate:false})
});
