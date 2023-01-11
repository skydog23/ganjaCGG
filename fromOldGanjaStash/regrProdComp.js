// Create a Clifford Algebra with 4,0,0 metric. 
Algebra({p:4,basis:Algebra(4,0,0).describe().basis},()=>{
  
   var E1 = 1e2 ^ 1e3 ^ 1e4,  // basis points (3-vectors)
       E2 = 1e1 ^ 1e4 ^ 1e3,
       E3 = 1e1 ^ 1e2 ^ 1e4,
       E4 = 1e1 ^ 1e3 ^ 1e2;
   var point=-E1-E3-E4,                   // a "random" point
       line = 1e13 + 1e34,                // a "random" line
       plane = -1e2-2e3+1e4;              // a "random" plane
   var ps = 1e1234,                       // pseudoscalar
       ips = ps.Inverse;                          // inverse of the pseudoscalar
   
// ********
// Here follow the definitions of the various forms of regressive product used here
//
// undual(dual(b) ^ dual(a)), used in ganja and "plane-based geometric algebra" (Leo Dorst)   
   var jnGanjaPlGA = (a,b) => a & b; 
   
// undual(dual(a) ^ dual(b)), on PrGA cheat sheets (projective geometric algebra)   
// Note this can be implemented using either Poincare or Hodge duality
// since the two dualities are ** computationally identical **
// the only difference is the interpretation as elements of G (Hodge) or of G* (Poincare)
   var jnPrGA = (a,b) =>  b & a;  
   
// There are several closely related versions of the join based on metric polarity 
// valid only for non-degenerate metric, all of which produce identical results.
// The code below chooses one to calculate with, users can change this choice.
// This are various forms of this formula in the literature, for example,
// Leo Dorst's CGA Tutorial in "GA in Practice", Ch. 21, eq. 21.8, p. 443
// Note: our algebra has the signature (4,0,0) in order to provide these metric versions of join
   var jnPolarR = (a,b)=> ((b*ips) ^ (a * ips)) *ps;   
   var jnPolarL = (a,b)=> ips * ((ps*b) ^ (ps*a)); 
   var jnPolar = jnPolarL;
   
// Cayley-Grassmann shuffle product, described and used e. g. by 
// Selig in Geom. Fund. of Robotics, Sec. 10.2.3
   var jnShuffle = (a,b) => shuffle(a,b);  
        
// following code implements the shuffle product                                    
// the following function executes one step of generating the permutations of indices
// required by the shuffle function
// p consists of all permutations (0,1,2...,n-1), x is the new symbol (i. e., n)
  var onestep = (p, x)=> { 
    let ret = [];
    for (const el of p) {
      for (let j = el.p.length, sign = 1; j>=0; --j)    {
        let copy = {s:el.s, p:Array.from(el.p)};
        copy.s = copy.s*sign;
        copy.p.splice(j,0,x);
        sign *= -1;
        ret.push(copy);
      }
    }
    return ret;
  };
  
  // generate an array of all signed permutations of the numbers (0,1,...n-1)
  var perms = (n) => {
    let range = Array(n).fill().map((x,i)=>i);
    return range.reduce(onestep, [{s:1, p:[]}]);
    };
 
   // some helper functions
  var factorial = (n) => n == 0 ? 1 : Array(n).fill().map((x,i)=>i+1).reduce((a,b)=>a*b, 1);
  var wedge = (b)=> b.reduce((acc,el)=>acc ^ el, 1); 
  var applyPerm = (ind,val) => ind.map((x)=> val[x]);
  var debugit = (stuff) => stuff.map((x)=>console.log(x));
  // an implementation of the shuffle product as described in Selig "Geometric robotics" 2005 Ch. 10
  var shuffle = (u, v, dim=4) => {
	  let [nu, nv] = [u.length, v.length];
	  let pms = perms(nu);
	  let vv = wedge(v);
	  let sum = pms.reduce( (acc, pm) => {
		  let vals = applyPerm(pm.p, u); 
		  let u1 = vals.slice(0,dim-nv);
		  let u2 = vals.slice(dim-nv);
		  acc = acc + pm.s * (!(wedge(u1) ^ vv)) * wedge(u2);
		  // debugit([vals]);
		  return acc;
	  }, 0
	);
	// don't forget the scaling factor to normalize the result
	return 1.0/(factorial(dim-nv)*factorial(nu+nv-dim)) * sum;
};

    // compute various joins and wedges based on the above functions
    var       ps2 = 1, 
        pro = ips*ps,
        jnGanjaE23 = jnGanjaPlGA(E2,E3),
        jnRGanjaE23 = jnPrGA(E2,E3),
        jnOE23 = jnPolar(E2,E3),
        // for the shuffle, the 3-vectors have to be provided as a wedge product of 1-vectors
        shufE23 = shuffle([1e1, 1e4, 1e3], [1e1, 1e2, 1e4]),
  
        // join products involving a plane and a point
        wedgePlPt = (plane ^ point),      // volume of tetrahedron spanned by O,X,Y,Z 
        joinPlPt = jnGanjaPlGA(plane, point) * ps2,  // volume of tetrahedron spanned by O,X,Y,Z 
        joinRPlPt = jnPrGA(plane, point) * ps2,
        joinPolarPlPt = jnPolar(plane, point) * ps2,
        // for the shuffle, the 3-vectors have to be provided as a wedge product of 1-vectors
        shuffleplpt = shuffle([plane], [1e1-1e4, 1e2,  1e3-1e4]) *ps2,
  
        // just for fun, joins involving a line and a point
        joinLnPt = jnGanjaPlGA(line, point) * ps2,
        joinRLnPt = jnPrGA(line, point) * ps2,
        joinPolarLnPt = jnPolar(line, point) * ps2,
        shuffleLnPt = shuffle( [ 1e3, 1e4 - 1e1], [1e1-1e4, 1e2,  1e3-1e4]) * ps2,
  
        // finally check that the wedge and the shuffle of 4 planes produce same sign
        wedge4 = (1e1 ^ 1e2 ^ 1e3 ^ 1e4),
        shuffle2 = shuffle([1e1, 1e2, 1e3, 1e4],[]) *ps2;
        
//console.log()
    document.body.innerHTML += `<PRE>
    Comparison of various ways to compute join products of k- and m-vectors
    We concentrate on the cases that both k and m are odd 
    (hence a v b = -b v a).
    See the source code for the exact definition of the different versions.
    
    First look at join of two points with four different versions of join
    *********************************
    (E2, E3) = (${E2}, ${E3})
    jnGanjaPlGA(E2, E3) = ${jnGanjaE23}
    jnPrGA(E2, E3) = ${jnRGanjaE23}
    jnPolar(E2,E3) = ${jnOE23}
    shuffle(E2,E3) = ${shufE23}
    
    Next consider the wedge of line and point, 
    all results agree since the grade of the line = 2
    **********************************
    ln = ${line},     pt = ${point}
    jnGanjaPlGA(pl, pt)= ${joinLnPt}
    jnPrGA(pl, pt)  = ${joinRLnPt}
    jnPolar(pl, pt)  = ${joinPolarLnPt}
    shuffle(pl, pt)  = ${shuffleLnPt}
    
    Next consider the wedge of plane and point, 
    and the join, using same 4 variants of join
    **********************************
    pl = ${plane}
    pt = ${point}
    wedge(pl, pt)   = ${wedgePlPt}
    jnGanjaPlGA(pl, pt) = ${joinPlPt}
    jnPrGA(pl, pt)   = ${joinRPlPt}
    jnPolar(pl, pt)  = ${joinPolarPlPt}
    shuffle(pl, pt)  = ${shuffleplpt}
    
    Finally consider the wedge of four 1-vectors 
    and the corresponding shuffle of this 
    wedge of four 1-vectors with the "empty wedge"
    There is no corresponding 4-plane join
    **********************************

    4-plane-wedge  = ${wedge4}
    4-plane-shuffle  = ${shuffle2}
  </PRE>`;

});
