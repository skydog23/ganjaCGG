notebook();

// Example two column layout
document.head.appendChild(Object.assign(document.createElement('style'),{ innerHTML:`
  .col  { flex: 50%; font-size:85%; padding-left:10px; }
  .col:first-child {border-right:1px solid #DDD; padding-left:0px; padding-right:10px; }
  .cols { display: flex; flex-direction: row; flex-wrap: wrap;  width: 100%; }
`}))

let {ge, gd, but} = Algebra(2,0,1,()=>{
  var paused = true;
  var but = button('pause', ()=>paused = !paused);
  // Using Geometric/Clifford algebra with signature (2,0,1), based on the work of Charles Gunn
  var dodu = true;

  const setprops = (s)=>{
    s.maxHeight ='400px';
    s.width = '100%';
    s.background = '#fffffa';
    s.border  = '1px solid #444';
    return s;
  };
 
  var pt    = (x,y)=>1e12-x*1e02+y*1e01,
      ln = (a,b,c)=>a*1e1+b*1e2+c*1e0,
      ideal = (x,y)=>-x*1e02+y*1e01,  
      {abs,sin,cos,acosh,tanh,sqrt,PI,E} = Math;

  let m2Transpose = ([[a,b],[c,d]])=> [[a,c],[b,d]];

  let m2Inv = ([[a,b],[c,d]])=> {let e = 1.0/(abs(a*d-b*c)); return [[e*d,-e*b],[-e*c,e*a]]};

  let m2MatTimesVec = ([[a,b],[c,d]],[x,y]) => [a*x + b*y, c*x+d*y];

  // write P as linear combination of P0 and P1
  let coordinateFor = (P0, P1, P) => {
    let [x0,y0] = [-P0.e02, P0.e01],
        [x1,y1] = [-P1.e02, P1.e01];
        return m2MatTimesVec(m2Inv(m2Transpose([[x0,y0],[x1,y1]])),[-P.e02,P.e01]);
  }

  let perp = ([x,y]) => [-y,x];

  var 
      A=pt(.2,.4), //circle[2], 
      B=pt(.2,-1),
      P = pt (-1,1), //ideal(-1,0),
      Q = pt (1,1); //ideal(0,1);
      
  let rect = (P, Q, A, B) => {
      let z = (P&Q).Normalized,
      qa = (Q&A).Normalized,
      qb = (Q&B).Normalized,
      pa = (P&A).Normalized,
      pb = (P&B).Normalized,
      C = (qa^pb).Normalized,
      D = (qb^pa).Normalized,
      ab = (A&B).Normalized,
      cd = (C&D).Normalized,
      Z = (ab^cd).Normalized,
      pz =(P&Z).Normalized,
      qz = (Q&Z).Normalized;
      return [z,qa,qb,pa,pb,C,D,ab,cd,Z,pz,qz];
  };
  
  let [z,qa,qb,pa,pb,C,D,ab,cd,Z,pz,qz] = rect(P,Q,A,B);
      //   console.log("pt",pt);
      // console.log("coords ",coordinateFor(P,Q,P));
      // console.log("coords ",coordinateFor(P,Q,Q));
      //   console.log("coords ",coordinateFor(P,Q,P+Q));
      
  let sample1D = (P, Q, x, w=1) => cos(x)*P + sin(x)*Q;
  
      var N=100, Nc=30;
      let thalesPoint = (P,Q,A,B,alpha, full=false)=>{
          let U = sample1D(P,Q, alpha),
              V = sample1D(P,Q, alpha+PI/2),
              u = U&A,
              v = V&B;
          return full ? [U,"U",V,"V",u,v,"T",u^v] : u^v;
        }
    let thalesCircle = (P,Q,A,B,n)=>[...Array(n)].map((x,i)=>thalesPoint(P,Q,A,B,(PI*i)/n));

    // in preparation for creating a euclidean and a dual euclidean scene
     let geom = ()=>{
       t  = paused ? 0 : performance.now()/5000;

      let [PP,QQ] = paused ? [P,Q] : [sample1D(P,Q, t), sample1D(P,Q, t+PI/2)];
        [z,qa,qb,pa,pb,C,D,ab,cd,Z,pz,qz] = rect(PP,QQ,A,B);
      return [ 
//      0xff0000, ...conic_pts,
       0x444444, A,'A', B,'B', 
       0xaa00aa, C,'C', D, 'D',  // cp,'cp',cq,'cq', // D,'D',
       0xaa8800,  z,"z", Z,"Z",
       0x4488aa, P,'P',Q,'Q',p,'p',q,'q',
       0xffba42, qa,qb,pa,pb, 
       0x0, PP, 'U', QQ, 'V',
       0xffaaff, ab,cd,
       0x8844ff, pz,qz,z,
       0xff0000, ...thalesCircle(P,Q,A,B,N), 
//       0x00ff00, ...thalesPoint(PP,QQ,A,B,t,true),
       ]
       };
       
       let renderProps = (dodu) => {return {
        // more render properties for the default items.
        pointRadius:.5,  // point radius
        lineWidth:2,      // line width
        fontSize:1.0,     // font size
        grid:false,         // grid
        scale: 1,
        animate:true,
        dual:dodu}};
        
 let ge = this.graph(()=>{

    let gg = geom(); gg.unshift("Thales construction of circle. Drag P, Q, A, or B.");
    return gg;
  
    }, renderProps(false));
        
 let gd = this.graph(()=>{
    if (!paused) {
          t = performance.now()/5000;
    }
    //[z,qa,qb,pa,pb,C,D,ab,cd,Z,pz,qz] = rect(P,Q,A,B);
    
    return geom(t);
    }, renderProps(true));
  
  setprops(ge.style);
  setprops(gd.style);
 
  return {ge,gd, but};

})

md`\title{Thales circles}
\date{October 2022}
\author{Charlie Gunn}

${embed(but)}

<DIV CLASS="cols">
<DIV CLASS="col">
\includegraphics{${embed(ge)}}

</DIV>

<DIV CLASS="col">

\includegraphics{${embed(gd)}}

</DIV>
</DIV>



`


