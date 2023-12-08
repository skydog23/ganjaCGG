Algebra(3,0,1,()=>{
  
  // Generating a spherical triangle with edge lengths of 60 degrees
  // is easy .. not to sure about others of interest .. e.g. 360/5
  var [E0,E1,E2,E3] = [1e1^1e2^1e3,1e0^1e2^1e3,1e0^1e3^1e1,1e0^1e1^1e2];
  console.log("basis = ",E0,E1,E2,E3);
  var point = (x,y,z)=>E0+x*E1+y*E2+z*E3;
  const {sqrt, E, PI} = Math;
  var phi = (sqrt(5) -1)/2, phi2 = phi*phi;
  var [pxp,pxm,pyp,pym,pzp,pzm,mxp,mxm,myp,mym,mzp,mzm]=[
    point(1,phi2,0),  
    point(1,-phi2,0),
    point(0,1,phi2),
    point(0,1,-phi2), 
    point(phi2,0,1),
    point(-phi2,0,1),
    point(-1,phi2,0),
    point(-1,-phi2,0),
    point(0,-1,phi2),
    point(0,-1,-phi2), 
    point(phi2,0,-1),
    point(-phi2,0,-1)],
    pts = [pxp,pxm,pyp,pym,pzp,pzm,mxp,mxm,myp,mym,mzp,mzm];
  var [px, py, pz] = [pyp & pym & pxp, pzp & pzm & pyp, pxp & pxm & pzp];
  var ppp = (px^py^pz).Normalized,
    pnp = ((E0&point(1,-1,1))^pz).Normalized;
  console.log("xyz = ",px,py,pz,ppp);
  //var [a,b,c] = [1e1+phi*1e2, 1e2+phi*1e3, phi*1e1 + 1e3].map(x=>x.Normalized);
  var [a,b,c] = [px,py,pz].map(x=>x.Normalized);
  var dihedral_angle   = Math.acos(-a|b); // this is spherical tri length.
  
  var P = (a^b^c).Normalized,
      r3 = (P&E0).Normalized;
  // the spherical angles between edge lines are now the dihedral angle we need.
  var [C,A,B] = [a^b,b^c,c^a].map(x=>x.Normalized);
  var vector_angle = Math.acos(-C|A); // this is spherical tri angle.
  
  var pentagon = [pxm,pxp,ppp,pxm,ppp,pzp,pxm,pzp,pnp];
  var apentagon =  E**(r3 * PI/3) >>> pentagon; //E**(-A*dihedral_angle/2)>>>pentagon;
  var bpentagon = E**(-r3 * PI/3) >>> pentagon; //E**(B*dihedral_angle/2)>>>pentagon;
  return this.graph([
    // "vector angle = spherical tri side length : "+(vector_angle/Math.PI*180),
    // "spherical tri angles = dihedral angle : "+(dihedral_angle/Math.PI*180),
    //0xff9900,...[A,B,C], 
    0x009977, ...[[pxp,pxm],[mxp,mxm],[pyp,pym],[myp,mym],[pzp,pzm],[mzp,mzm]],
    0x0088ff, ...pts,
    0xff0000, P,
    0x009977, pentagon,  1e3>>>pentagon, 1e1>>>pentagon, 1e1>>>(1e3>>>pentagon),
    0xff9900, apentagon, 1e1>>>apentagon, 1e2>>>apentagon, 1e2>>>(1e1>>>apentagon),
    0x770099, bpentagon, 1e2>>>bpentagon, 1e3>>>bpentagon, 1e3>>>(1e2>>>bpentagon),
  ],{ lineWidth:4, gl:1,grid:1});
})

