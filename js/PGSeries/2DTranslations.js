notebook();

// Example two column layout
document.head.appendChild(Object.assign(document.createElement('style'),{ innerHTML:`
  .col  { flex: 50%; font-size:85%; padding-left:10px; }
  .col:first-child {border-right:1px solid #DDD; padding-left:0px; padding-right:10px; }
  .cols { display: flex; flex-direction: row; flex-wrap: wrap;  width: 100%; }
`}))
 
const dct = text=>String.raw`<SPAN STYLE="color:red">${String.raw(text)}</SPAN>`;


let {ge, gd} = Algebra(2,0,1,()=>{
  
    let pause = false;
  let start = Date.now();
  let pbut = button('pause rotate', ()=> {pause = !pause;});

  let point = (x,y,z)=>z*1e12-x*1e02+y*1e01;
  let mynormalize = (x)=>(x.e12 > 0) ? x.Normalized : -x.Normalized;
  let unitVector = (x)=>{
    let f = x.e01*x.e01+x.e02*x.e02; 
    return (f==0) ? point(0,0,0) : (1/sqrt(f))*point(-x.e02,x.e01,0)};
  let {E, sqrt} = Math;
  const star = (s) => [[point(-s,0,1), point(s,0,1)],[point(0,-s,1),point(0,s,1)]];

  const setprops = (s)=>{
    s.maxHeight ='400px';
    s.width = '100%';
    s.background = '#fffffa';
    s.border  = '1px solid #444';
    return s;
  };
  
  let interp = (arg0, arg1, t)=> (1-t)*arg0 + t*arg1;
  let interpArr = (arr, n=10) => {
    let segs = [...Array(arr.length-1)].map((x,i)=>[arr[i],arr[i+1]]),
        val = segs.map(([x0,x1])=>[...Array(n)].map((x,i)=>interp(x0,x1,(i/(n-1)))));
    return val.flat();
  }

  let grid = (U, V, P, tr = .8, n=5, m=5, minx=-1, maxx=1, miny=-1, maxy=1)=>{ 
    let val =
    [...Array(n)].map((x,i)=>[...Array(m)].map((y,j)=>[(i*maxx+(n-1-i)*minx)/(n-1),
      (j*maxy + (m-1-j)*miny)/(m-1)])).flat();
    return val.map((x)=>(E**(tr*(x[0]*U+x[1]*V)))>>>P);
  }
 
  let gridlines = (U, V, P, tr = .8, n=5, m=5, minx=-1, maxx=1, miny=-1, maxy=1)=>{ 
    let up = P&U, vp = V&P;
    let valu = [...Array(n)].map((x,i)=>{let tt=(i*maxx+(n-1-i)*minx)/(n-1);
      return (E**(tr*(tt*V)))>>>vp});
    let valv = [...Array(n)].map((x,j)=>{let tt=(j*maxy + (m-1-j)*miny)/(m-1);
      return (E**(tr*(tt*U)))>>>up});
    return valu.concat(valv);
  }
 
  let ytlate = (s)=>E**(.5*s*1e02),   // euclidean translation in y-direction
      dualVersor = (v,x)=>!(v>>>(!x)),  // let a versor v act in dual space
      perspTr = (x,s=.45)=>dualVersor(ytlate(s),x),   // a dual translation is a perspective tform
      iperspTr = (x,s=.45)=>dualVersor(ytlate(-s),x); // the inverse transformation
  

  let n = 10, ss = .45, tt = .4, 
      P = point(.2,.2,1),
      Z = point(0,0,1), z = !Z,
      V = ()=>P-Z;
  
  let color1 = 0x00cc66,
      color2 = 0x00aaff,
      color3 = 0xff4000;
  let ge = this.graph(()=>{
    let realP = mynormalize(iperspTr(P,ss)),
        mP = point(realP.e02,-realP.e01,realP.e12),
        arrow = interpArr([mP,realP],n),
        xTlor = E**(tt*1e01);
      let V = unitVector(realP),
          U = point(V.e01, V.e02,0),
          gr = grid(U,V, realP),
          grl = gridlines(U, V, realP);
      //if (!pause) console.log("gr = ",gr);
    return [ 
      // 0xff0000, ...arrow.map((x)=>perspTr(x,ss)),
      // 0xffcc00, ...arrow.map((x)=>perspTr(xTlor>>>x,ss)),
      color1, ...gr.map(x=>perspTr(x),ss),
      color2, ...grl.map(x=>perspTr(x),ss),
      color3, perspTr(U), "U", perspTr(V), "Z",
      0x0, perspTr(z,ss), "z", Z, "P", P, "P\'",  //perspTr(P&mP,ss),"V", 
      ]},{
        animate:true,
        lineWidth:2,
        pointRadius:1,
        scale:.8,
      });
      
  let gd = this.graph(()=>{
    let realP = mynormalize(iperspTr(P,ss)),
        mP = point(realP.e02,-realP.e01,realP.e12);
      let V = unitVector(realP),
          U = point(V.e01, V.e02,0),
          gr = grid(U,V, realP),
          grl = gridlines(U,V, realP);
    return [
      //0xff0000, ...interpArr([mP,realP],10),
      color1, ...gr,
      color2, ...grl,
      0x4040ff, ...star(.08),
      color3, U, "u", V, "z",
      0x0, z, "Z",   realP, "p\'", 
      ]},{
      animate:true,
      lineWidth:2,
      pointRadius:1,
      scale:.8,
      dual:true
  });
  setprops(ge.style);
  setprops(gd.style);
  return {ge,gd};
});

let {grece} = Algebra(2,0,1,()=>{
 
  var point = (x,y,z)=>z*1e12-x*1e02+y*1e01;
  var line = (x,y,z)=>x*1e1+y*1e2+z*1e0;
  var norm = (P)=> sqrt(abs(P|P));
  let inorm = (R) => sqrt(R.e02*R.e02+R.e01*R.e01);
  var mynormalize = (x)=>(x.e12 > 0) ? x.Normalized : -x.Normalized;
  var {sqrt, abs,cos,sin, floor, E, PI} = Math;
 
  var color1 = 0xff6666,
      color2 = 0xffccaa,
      color3 = 0x6666ff,
      color4 = 0xccaaff;
  var redbluelerp = (t) => (floor(t*255) * 65536 + floor((1-t)*255));
  var lerp = (imin,imax,omin,omax,t)=> { let id = imax-imin, od = omax-omin; 
      if (t < imin) t = imin; if (t>imax) t = imax; return omin + (((t-imin)/id)*od);}
      
  let interp = (arg0, arg1, t)=> (1-t)*arg0 + t*arg1;
  let interpArr = (arr, n=10) => {
    let segs = [...Array(arr.length-1)].map((x,i)=>[arr[i],arr[i+1]]),
        val = segs.map(([x0,x1])=>[...Array(n)].map((x,i)=>interp(x0,x1,(i/(n)))));
        return val.flat();
  }
  let scale = (x)=>{x.e12 = x.e12/scale; return x}
  let segs = (arr, closed = false) => {
     let nn = arr.length;
     return arr.map((x,i,a ) => [a[i],a[(i+1)%nn]]);
  }
  
  let star = (s) => [[point(-s,0,1), point(s,0,1)],[point(0,-s,1),point(0,s,1)]];
  
  let num = 4, n2= 48,
     Z = point(0,0,1),
     P = point(0,0,1),
     tlator = ()=>E**(.5*point(P.e01,P.e02,0)),
     circle = (r,n)=>[...Array(n)].map((x,i)=>point(r*cos(2*PI*(i/n)), r*sin(2*PI*(i/n)), 1)),
     points = (n)=>[...Array(2*n)].map((x,i)=>{
       return circle(i/(2*n-1),n)
     }).flat();


  let grece = this.graph(()=>{
    let pts = points(num);

    return [
       color4, ...circle(1,n2).map((x)=>tlator>>>x), //...segs(circle(1,100)),
       color4, ...circle(1,n2).map((x)=>!(mynormalize(tlator>>>x))),
       color1, ...(pts.map((x)=>tlator>>>x)), 
       color1, ...(pts.map((x)=>!(mynormalize(tlator>>>x)))),
       0x0, Z, (inorm(P)>.03 ? "Z" : ""), ...star(.05), P, "P", !P,"p"
       ]
    }, {
      animate:true,
      lineWidth:2,
      pointRadius:.5,
      scale:.8,
      grid:false,
      dual:false});
      

  grece.style.maxHeight ='700px';
  grece.style.width = '100%';
  grece.style.background = '#fffffa';
  grece.style.border  = '1px solid #444';
  return {grece};

});


md`\title{2D translations}
\date{October 2022}
\author{Charlie Gunn}

## Demo

<!--In this demo the lines are obtained from the points by interpreting the point coordinates as line coordinates.-->

If you drag the point $P$ in the window below, all the other points move in the same direction and the same distance as $P$. 
We call that a euclidean translation, or $e$-translation.

The lines move at the same time, but not via an $e$-translation. 
For example, the angles between the lines change, and the curve formed by the purple lines changes from
a circle to an ellipse, even to a hyperbola.

In this episode we want to look more closely at how the lines are moving.

**Exercises:** 
1. Drag $P$ and describe how the shape formed by the lines changes depending on  $Z$, marked by a little cross. 
What happens when the circle of points
crosses over $Z$? How do the lines change as $P$ is dragged further away from $Z$?

2. Drag $P$ far enough so that the black line $p$ appears. 
Describe in words how the red points are arranged with respect to $P$ 
and how the red lines are arranged with respect to $p$.


\includegraphics{${embed(grece)}}

## Discussion
   
The motion of the points in the above demo is familiar to us as a *euclidean translation*.
The motion of the lines is not so familiar.  We use duality to find out more.

In order to understand more precisely, we first describe a euclidean translation 
in projective terms. Then we can dualize this description to obtain a *dual euclidean translation*.

## Translation in projective terms
A 2D projectivity  that fixes a point $Z$ line-wise 
and a line $z$ point-wise is called a *homology*. 
$Z$ is called the *center* and $z$ the *axis*.
If $Z$ and $z$ are incident, the map is called
an *elation*. 

When both $Z$ and $z$ are ideal, the
elation is a euclidean isometry called a *translation*.

Both elation **and** translation are self-dual terms.   

<DIV CLASS="cols">
<DIV CLASS="col">


In an $e$-translation $T$ with center $Z$ and axis $z$, 
$z$ is the $e$-absolute ${dct`line`} and $Z$ is
the direction of the translation: every ${dct`point moves along`}  its ${dct`joining line`} with $Z$.

$T$ is determined 
by one proper ${dct`point`} $P$ and its image $P':=T(P)$. 
The ${dct`joining line`} $P\vee P'$ meets $z$ 
at $Z := (P\vee P')\wedge z$, the direction of $T$. The
distance $l$ of the translation is $\|P'-P\|_{\infty}$, the $e$-ideal norm
(or alternatively $l = \|Z\|_\infty$).

Every other $e$-${dct`point`} $Q$ ${dct`moves along`} the line $Q\vee Z$ 
such that $\|Q'-Q\|_\infty = l$.


</DIV>

<DIV CLASS="col">
 
In a $d$-translation $T$ with center $Z$ and axis $z$, 
$Z$ is the $d$-absolute ${dct`point`} and $z$ is
the direction of the translation: every ${dct`line rotates around`} its ${dct`intersection point`} with $z$.

$T$ is determined 
by one proper ${dct`line`} $p$ and its image $p':=T(p)$. 
The ${dct`intersection point`} $p\wedge p'$ ${dct`joins`} $Z$ 
to give $z := (p\wedge p')\vee Z$, the direction of $T$. The
distance $l$ of the translation is $\|p'-p\|_{\infty}$, the $d$-ideal norm
(or alternatively $l = \|z\|_\infty$).

Every other $d$-${dct`line`} $q$ ${dct`rotates around`} the point $q\vee z$ 
such that $\|z'-z\|_\infty = l$.


</DIV>
</DIV>

## Demo
The following demo shows an $e$-translation on the left and the corresponding $d$-translation on the right. 

Drag point $P'$ on the left in order to translate the grid of blue lines. 

The view on the left of the EP is in perspective; the horizontal line is the image of the ideal line $z$.
The two families of parallel lines meet at the two points $U$ and $V$ on $z$.

On the right is the same motion rendered in the dual euclidean plane.
<DIV CLASS="cols">
<DIV CLASS="col">
\includegraphics{${embed(ge)}}

</DIV>

<DIV CLASS="col">

\includegraphics{${embed(gd)}}

</DIV>
</DIV>



## Discussion


The view on the right shows the DEP, executing the same code but now the 1-vectors are rendered as lines
and the 2-vectors as points. 

**Exercise** Complete the right hand side by dualizing the description of the left hand side. 

<DIV CLASS="cols">
<DIV CLASS="col">

<!--The ${dct`point`} $P$ is the center ${dct`point`} of the EP.-->

The ${dct`joining line`} $P\vee P'$ ${dct`intersects`} the $e$-absolute ${dct`line`} $z$ in the direction $Z$ of the
$e$-translation. 

There are five blue ${dct`lines passing through`} $Z$; five green ${dct`points 
move along`} each of the blue lines.

The other five green ${dct`lines`} of the grid ${dct`pass through`} the ideal ${dct`point`} $V$ of $z$. 
These ${dct`lines rotate around`} $V$ as the figure $e$-translates.

</DIV>

<DIV CLASS="col">

<!-- The ${dct`line`} $p$ is the center ${dct`line`} of the DEP.-->

<!--The ${dct`intersection point`} $p\wedge p'$ ${dct`joins with`} the $d$-absolute ${dct`point`} $Z$ 
in the direction $z$ of the $d$-translation. 

There are five blue ${dct`points lying on`} $z$; 
five green ${dct`lines rotate around`} each of the blue points..

The other five green ${dct`points`} of the grid ${dct`lie on`}t the ideal ${dct`line`} $v$ of $Z$. 
These ${dct`points move along`} $v$ as the figure $d$-translates.-->

</DIV>
</DIV>


`



resolve_references();


