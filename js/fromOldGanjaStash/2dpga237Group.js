function regenerate(automated = 1) {
  Algebra({
    metric:[-1,1,1],
    basis:['1','e0','e1','e2','e01','e02','e12','e012']
}).inline((automate=false, wordlength=14, maxdist = 1.75, color=0x12f319, group = [2,3,7])=>{
  console.log("color = ",color);
  // standard point definition
  var point = (x,y)=>1e12+x*1e02+y*1e01;
  var line = (x,y,z)=>x*1e1+y*1e2+z*1e0;
  var {abs,sin,cos,acosh,tanh,PI,E} = Math;
  // hyperbolic formulas needs some small improvements
  var dist = (P, Q) => {let ip = abs((P<<Q).s); return ip < 1 ? 0 : acosh(ip)};
  var hnormalized = (P) => { let Q = P.Normalized; return (Q.e12 < 0) ? -Q : Q; }
  
  // boundary of H(2)
  var disc = [...Array(100)].map((x,i)=>point(sin(i/50*PI),cos(i/50*PI))).map((x,i,a)=>[x,a[i+1]||a[0]]);    

  var automated = automate;

// given the angles, solve for the corners
var solveHypTri = (p, q, r) => {
	let [a,b,c] = [PI/p, PI/q, PI/r];
	let A = acosh((cos(a)+cos(b)*cos(c))/(sin(b)*sin(c)));
	let B = acosh((cos(b)+cos(a)*cos(c))/(sin(a)*sin(c)));
	let C = acosh((cos(c)+cos(b)*cos(a))/(sin(b)*sin(a)));
	let d = tanh(B);
	let verts = [ point(-d,0), point(-d,d*Math.tan(c)), point(0,0)];
 	return verts.map( (x)=>x.Normalized);
}

  // given a point P, return the point Q within the fundamental triangle
  // that satisfies g(Q) = P for some group element g
  var getCanonicalRepn = (P, lines) => {
    let inside = false, Q = P, count = 0;
    do {
      let k = lines.map( x => (!(x^Q)).s).findIndex(x => x > 0);
      if (k >= 0) {
              Q = hnormalized(lines[k]>>>Q);
      }
      else inside = true;
    } while (count++ < 50 && !inside);
    return Q;
  }
  
  // project the point P onto each of the lines
  var getSideProjs = (P, lines) => lines.map(x => (x<<P)^x);
  
  // join the the point P to the projected points
  var getSegs = (P, lines) => getSideProjs(P,lines).map(x => [x, P]);
  
  const colors = [0xffff00, 0xff00ff, 0x00ffff];
  var getQuads = (P, lines) => getSideProjs(P, lines).map( (x,i,ar) => {
    let j = (i+1)%3, k = (i+2)%3; return [ P, ar[j], lines[j]^lines[k], ar[k]];
  });
  
  // verify whether a group element nel is already present in the array old
  var alreadyThere = (old, nel) => old.some((oel) => equiv(oel, nel));
  
  // test two group elements for geometric equivalence: do they move the 
  // centroid of the triangle to the same point?
  var equiv = (el1, el2, tol=.01) => dist(((el2.g.Reverse)*el1.g)>>>M, M) < tol;
  
  var movesTooFar = (el1, d=maxdist) => dist(el1.g>>>1e12, 1e12) > d;
  
  // this extends the list of group elements by multipying each of the 
  // existing group elements on the right by each of the generators
  // not functional style since I can't find a functional algorithm 
  var reflectOnce = (grp, refls)=> {
    let result = grp.slice();  // copy original array
    for (const x of grp)  {
      for (const r of refls)  {
        let nel = {s:(x.s+r.s), g:((x.g*r.g).Normalized)}
        if (alreadyThere(result, nel) || movesTooFar(nel)) continue;
        result.push(nel);
      }
    } return result;
  };

  // generate all group elements up to the given word-length
  var genGroup = (gens, wordlength = 4)=> {
    let range = Array(wordlength).fill().map((x,i)=>i);
    return range.reduce((acc, el) => {return reflectOnce(acc, gens)}, [{s:"", g:1}]); 
  }

  // apply the array of group elements to an array of geometry
  var applyGroup = (grp, geom)=> grp.map( (el) => geom.map( (x) =>  (el.g)>>>x));

  // *******
  // We are now ready to create the group and associated geometry
  console.log("group = ",group);
  var verts = solveHypTri(...group);
  var [A,B,C] = verts;
  // these are the lines defining the triangle
  var lines = verts.map((x,i,ar)=> (ar[(i+1)%3] & ar[(i+2)%3]).Normalized);
  // while these are the line segments
  var segs =  [[verts[1],verts[2]],[verts[2],verts[0]],[verts[0],verts[1]]];
  // we create objects by attaching a letter to each generating reflection.
	var refls = [{s:"a", g:lines[0]}, {s:"b", g:lines[1]}, {s:"c", g:lines[2]}];
  // P starts out as the centroid of the triangle
  var P = (A+B+C).Normalized;
  var M = P;  // M is the centroid
	
  // create the discrete group up to a given level
  // and filter out the indirect isometries
	var fullGroup = genGroup(refls,wordlength),
	    indirectEls = fullGroup.filter((x)=> x.s.length %2 == 1);
	var tessV = applyGroup(indirectEls, verts),
	    tessS = applyGroup(fullGroup, segs).flat(1),
	    tessP = fullGroup.map( (x)=> ((x.g)>>>P).Grade(2)).shift(1),
	    sideSegs =  getSegs(P,lines), 
	    tessSideSegs = applyGroup(fullGroup, sideSegs).flat(1);
	console.log("tessP = ",...tessP);
	console.log("tessSS = ",...tessS[0]);

   console.log("side segs = "+sideSegs.toString());
  console.log("Group size: ",fullGroup.length);
  // console.log("Group: ",...fullGroup);
  // console.log(tess);
	
  var canvas=document.body.appendChild(this.graph( ()=> {
    var rotor = 1;   // we construct a rotor to move some part of the configuration
    var canP = P;    // canP is the point in the canonical FD equivalent to P
    if (automated) {
      let t=.5*Math.sin(Date.now()/5000),
      c = cos(.699*t+.45), s = sin(1.23*t+1.5), h = cos(1+t);
      let rotor2 = Math.E**(t*(c*1e01+s*1e20+h*1e12));
      canP = getCanonicalRepn(rotor2>>>P, lines);
	    tessP = fullGroup.map( x=> x.g>>>canP);
	    rotor = 1;
    } else  { // follow the dragged point P
      // construct hyperbolic translation taking centroid to P
      var pro = (!P)*(!(M.Reverse));
      rotor = (1 + pro.Normalized)/2;
      canP = getCanonicalRepn(rotor>>>P, lines);
	    tessP = fullGroup.slice(1).map( x=> x.g>>>canP);
    }
    	tessSideSegs = applyGroup(fullGroup, getSegs(canP, lines)).flat(1); 

	   // {
	   //   let quads = getSegs(canP, lines);
	   //   let indices = [0,1,2];
	   //   return indices.map( i => applyGroup(fullGroup,[ [[i]]]).flat(1));
	   // };
	//    console.log("tessP = ",...tessP);
    //}
    // generate tessellated geometry
    var [tessVT, tessST, vertsT, segsT] = [tessV, tessS, verts, segs].
          map((y) => [...y].map( (x) => rotor>>>x));
    
    return [0x0, !automated ? "Drag P and its tessellation follows.":"",
            color, ...tessVT,  // tessellated triangle vertices
            0x006666, ...tessST,  // tessellated triangle sides
            0x0, P, "P",  ...tessP,   
            0x0, vertsT[0], "A", vertsT[1], "B", vertsT[2], "C",  // triangle vertex labels
            0x0000, segsT[0], "a", segsT[1], "b", segsT[2], "c",  // triangle side labels
            0xfd0882, ...tessSideSegs,   // tessellated star at P
           0x0, ...disc
         ]
}, {
      animate:1,
      pointRadius:1,
      lineWidth:2.5,
      scale:1.6,
      grid:false,
      width:window.innerWidth
}
  ))
//      document.body.style.backgroundColor='white'
  canvas.style.backgroundColor = "white"
})()};
regenerate();


