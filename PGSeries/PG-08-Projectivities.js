notebook();

var {g3,pbut} = Algebra(2,0,1,()=>{

  let pause = true;
  let pbut = button('debug', ()=> pause = !pause);
  let {floor, sqrt} = Math;

  var point = (x,y,z)=>(z*1e12 - x*1e02 + y*1e01);
  var line = (a,b,c)=>(c*1e0 + a*1e1 + b*1e2);
  let mynorm = (pt) => { 
    let ret = pt; 
    if (pt[2] < 0) {ret = pt.map((x) => -x); }
    else if (pt[2] == 0) {let d = 1.0/ sqrt(pt[0]*pt[0] + pt[1]*pt[1]); ret = pt.map((x)=>d*x);} 
    return ret;}
  let ptcoords = (pt)=>[-pt.e02,pt.e01,pt.e12];
  let lncoords = (ln)=>[ln.e1,ln.e2,ln.e0];

  let transpose = (a2d) => a2d[0].map((_, colIndex) => a2d.map(row => row[colIndex]));

  let edges4 = ([a,b,c,d]) => [[a,b],[a,c],[a,d],[b,c],[b,d],[c,d]];
  
  let _config13Lns = (array)=> {
        return _config13Pts(array);
  }

  let _config13Pts = (array)=> {
        let P0 = array[0],
        P1 = array[1],
        P2 = array[2],
        P3 = array[3],
          // the six joining lines
        p01 =  (P0 & P1).Normalized,
        p02 =  (P0 & P2).Normalized,
        p03 =  (P0 & P3).Normalized,
        p12 =  (P1 & P2).Normalized,
        p31 =  (P3 & P1).Normalized,
        p23 =  (P2 & P3).Normalized,
        // Diagonal points
        P0123 =  (p01 ^ p23).Normalized,
        P0231 =  (p02 ^ p31).Normalized,
        P0312 =  (p03 ^ p12).Normalized,
        // Diagonal lines
        p0123 =  (P0231 & P0312).Normalized,
        p0231 =  (P0312 & P0123).Normalized,
        p0312 =  (P0123 & P0231).Normalized,
        // Six new intersection points
        P01 =  (p0123 ^ p23).Normalized,
        P02 =  (p0231 ^ p31).Normalized,
        P03 =  (p0312 ^ p12).Normalized,
        P12 =  (p0312 ^ p03).Normalized,
        P31 =  (p0231 ^ p02).Normalized,
        P23 =  (p0123 ^ p01).Normalized,
        // Finally four new lines
        p0 =  (P01 & P02).Normalized,
        p1 =  (P01 & P12).Normalized,
        p2 =  (P02 & P12).Normalized,
        p3 =  (P03 & P23).Normalized;
        return {
          points4: [P0,P1,P2,P3],
          lines6: [p01,p02,p03,p12,p31,p23],
          points3: [P0123,P0231,P0312],
          lines3: [p0123, p0231, p0312],
          points6: [P01,P02,P03,P12,P31,P23],
          lines4: [p0,p1,p2,p3]
        }
  }
  class config13  {
    constructor(array, isPt=true) {
      let cnf = isPt ? _config13Pts(array) : _config13Lns(array); 
      [this.P0,this.P1,this.P2,this.P3] = cnf.points4;
      [this.P01,this.P02,this.P03,this.P12,this.P31,this.P23] = cnf.points6;
      [this.P0123,this.P0231,this.P0312] = cnf.points3;
      [this.p0,this.p1,this.p2,this.p3] = cnf.lines4;
      [this.p01,this.p01,this.p02,this.p12,this.p31,this.p23] = cnf.lines6;
      [this.p0123,this.p0231,this.p0312] = cnf.lines3;
      this.points4 = cnf.points4;
      this.lines6 = cnf.lines6;
      this.points3 = cnf.points3;
      this.lines3 = cnf.lines3;
      this.points6 = cnf.points6;
      this.lines4 = cnf.lines4;
    }
    getUnitSquare(){    // return six line segments of the quadrilateral surrounding P0123: edges and diagonals passing through P0123
      return edges4(this.points4);
    }

    getQuadrantFromCords( [x,y,z])  {
      let 
        binx = binbo(5,(x+1)/2),
        biny = binbo(5,(y+1)/2);
//        if (!pause) console.log("bx by ",binx[0],biny[0]);
      return this.getQuadrant(1-binx[0] + 2*(1-biny[0]));
    }
    getQuadrant( which ) {
      switch(which) {
        case 0:
          return [this.P23, this.P1, this.P03, this.P0231];
          break;
        case 1:
          return [this.P03, this.P2, this.P01, this.P0231];
          break;
        case 2:
          return [this.P12, this.P0, this.P23, this.P0231];
          break;
        case 3:
        default:
          return [this.P01, this.P3, this.P12, this.P0231];
          break;
      }
    }
  }
   let binbo = (n,a)=>{
     let ret = [];
     for (let i = 0; i<n;++i) {
       ret.push((Math.floor(a))&1);
       a = 2*a;
       }
     return ret;
     }

//   let zoomInBin = ([l,r,t,b], hbit, vbit) =>{
//     let P = l^r,
//       Q = t^b,
//       M = 

  let matInv = ([[a,b,c],[d,e,f],[g,h,i]])=> [[e*i-f*h,-(d*i-f*g),d*h-e*g], [-(b*i-c*h), a*i-c*g,-(a*h-b*g)], [b*f-c*e, -(a*f-c*d), a*e-b*d]];

  let matTr = ([[a0,a1,a2],[b0,b1,b2],[c0,c1,c2]])=>[[a0,b0,c0],[a1,b1,c1],[a2,b2,c2]];

  let matMul = (m1, m2) => {let ret = [[0,0,0],[0,0,0],[0,0,0]]; // Array(3).fill(Array(3).fill(0)); 
    for (let i = 0; i<3; ++i) {
      for (let j = 0; j<3; ++j) {
        for (let k = 0; k<3; ++k) {
          ret[i][j] += m1[i][k] * m2[k][j];
        }
      }
    }
    return ret;
  }
  let matVecMul = (m, v) => {let ret = [0,0,0]; // Array(3).fill(Array(3).fill(0)); 
    for (let i = 0; i<3; ++i) {
      for (let j = 0; j<3; ++j) {
        ret[i] += m[i][j] * v[j];
      }
    }
    return ret;
  }

  let scVecMul = (s, v) => v.map((x)=>x*s);

  let dotVec = (u,v) => u[0]*v[0] + u[1]*v[1] + u[2]*v[2];

  let vecVecAdd = (u,v) => u.map((x,i)=>x+v[i]);

  // the 13-configuratio
  // start with 4 points 
  var P = point(.3,.6,1),
    P0 = point( 1,0,1),
    P1 = point(0,1,1),
    P2 = point(-1,0,1),
    P3 = point(0,-1,1);

    if (!pause) {
    let cf = new config13([P0,P1,P2,P3],true);
    let us = cf.getUnitSquare();
    //console.log("us = ",us);
    console.log("quadrant = ",cf.getQuadrantFromCords(ptcoords(P)));
    }



  let g3 = this.graph(()=> {
    let cf = new config13([P0,P1,P2,P3],true);
      let pooper = [cf.P0312,cf.P0123,cf.P0231].map((x)=>ptcoords(x));
      pooper = pooper.map((x)=>mynorm(x));
      let cM = transpose(pooper),       // obj2world matrix
        icM = matInv(cM),               // world2obj
        pr = matMul(cM, transpose(icM)),
        UPtC = matVecMul(icM, ptcoords(cf.P1)), // 
        cM2 = transpose(pooper.map((x,i)=> scVecMul(UPtC[i], x))),
        UPt2 = matVecMul(cM2,[1,1,1]),
        icM2 = matInv(cM2),
        Pcords = matVecMul(icM2,P);
    if (!pause) {
        // console.log("test = ",mynorm([1,3,-2]));
         console.log("dtri = ",pooper);
         console.log("cM = ",cM2);
         console.log("icm = ",icM2);
        // console.log("pr = ",pr);
        console.log("unitPtC = ",UPtC);
        console.log("UP = ",ptcoords(cf.P1));
        console.log("UP2 = ",UPt2);
      }
    return [ 0, "Drag the orange points Pi to projectively transform the figure",
        P, "P",
      0xFF0000, ...transpose([cf.points4,["P0", "P1","P2", "P3"]]).flat(),
      0xFF8800, ...transpose([cf.lines6,["p01","p02","p03","p12","p31","p23"]]).flat(),
      0x74ea34, ...transpose([cf.points3,["P0123", "P0231", "P0312"]]).flat(),
      0x00aaaa, ...transpose([cf.lines3,["p0123","p0213","p0312"]]).flat(),
      0x0000aa, ...transpose([cf.points6,["P01","P02","P03","P12","P31","P23"]]).flat(),
      0xaa00aa, ...transpose([cf.lines4,["p0","p1","p2","p3"]]).flat(),
      0x0, ...cf.getUnitSquare(),
      0x888888, ...edges4(cf.getQuadrantFromCords(Pcords)),
      ]},{grid:false, lineWidth:2, animate:true});
  g3.style.maxHeight ='700px';
  g3.style.width = '100%';
  g3.style.background = 'white';
  g3.style.border  = '1px solid #444';
  return {g3, pbut};
  
});

md`\title{Moving projectively}
\date{August, 2022}
\author{Charlie Gunn}


## Motions


A euclidean motion is a motion that preserves euclidean properties such as angle between lines and distance between points.

A projective motion -- or *projectivity* -- is one that preserves projective properties.

For example, the property that two lines intersect at a particular point, 
or the property of flatness is another. 
Roughly speaking, a projectivity is a transformation that preserves incidence and flatness.

<b>Note</b>: preservation of incidence means that if $a \wedge b = P$, then $a' \wedge b' = P'$, where $a$ and $b$ are lines, $P$ is their intersection point, and $X' = T(X)$ where $T$ is a transformation.

The following demo allows the user to explore the space of motions of the projective plane. The position of the four points P0, P1, P2 and P3 determines
a unique projectivity. 

The other points and lines of the figure make up a famous configuration in projective geometry called the <i>13 configuraiton</i> 
since it consists of 13 points and lines.

${embed(pbut)}
\includegraphics{${embed(g3)}}

## Details on projective motions

Let $P^n$ be projective $n$-space and $P^{n*}$ be its dual space.  

If we have a basis for $P^n$ then we will use the canonical dual basis for $P^{n*}$, it simplifies the discussion. 
Recall that the canonical dual basis $\{E_i\}$ has the property that $E_i \wedge e_i = \delta^i_j$.
 
For $n=1$, a projectivity is a map that preserves <i>cross-ratio</i> of points. (For details of cross-ratio, see below).  

For $n>1$ projectivities can be characterized as follows:
<ul>
<li> A projectivity preserves incidence of sub-spaces and maps flat sub-spaces to flat sub-spaces. </li>
<li>A projectivity $P^n \rightarrow P^n$ is called a <i>collineation</i>.</li>
<li>A projectivity $P^n \rightarrow P^{n*}$ is called a <i>correlation</i>.</li>
<li> A projectivity can represented by an $(n+1) \times (n+1)$ invertible matrix $M$, and every such matrix represents a projectivity.</li>
<li> Since $\lambda M$ for $\lambda \neq 0$ has the same action on $P^n$ as $M$ (homogeneous coordinates in $P^n$!), the projective group $PGL(n)$ satisfies $PGL(n) = GL(n) \backslash \mathbf{R}^*$ and hence has dimension $n^2-1$.
<li> A projectivity $\Pi$ such that $\Pi^2 = \mathbb{1}$ is called an <i>involution</i>.</li>
<li> An involution that is a correlation is called a <i>polarity</i>.</li>
<li> An involution that is a collineation can be a reflection or a half-turn.</li>
</ul>


### Cross-ratio
<small>Given four points $\{A,B,C,D\}$ on a projective line $P^1$.
Introduce coordinates $A = a_0 e_0 + a_1 e_1$, $B = b_0 e_0 + b_1 e_1$, etc.,
with respect to any basis $\{e_0,e_1\}$. 
Then the <i>cross ratio</i> $CR(A,B;C,D) := \dfrac{|AC||BD|}{|AD||BC|}$
where $|AB| := a_0 b_1 - a_1 b_0$, etc.
In this form it isn't hard to show that the CR is invariant under a projective transformation $\Pi$, since each 
determinant $|AB|$, etc is scaled by the factor $\lambda := |P|$ and these factors cancel in the cross ratio formula.

</small>

`

