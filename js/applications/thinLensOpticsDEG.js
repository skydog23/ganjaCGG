notebook()

// Example two column layout
document.head.appendChild(Object.assign(document.createElement('style'),{ innerHTML:`
  .col  { flex: 50%; font-size:85%; padding-left:10px; }
  .col:first-child {border-right:1px solid #DDD; padding-left:0px; padding-right:10px; }
  .cols { display: flex; flex-direction: row; flex-wrap: wrap;  width: 100%; }
`}))
 
 
let {ge, gd, pbut} = Algebra(2,0,1,()=>{
 
  let pause = true;
  let time = 0;
  let pbut = button('animate lens transformation', ()=> {pause = !pause; if (!pause) cnt = 0});

  let doDual = false;
  let cnt = 0;
  let count = () =>{cnt++; return cnt;}

  let coloro = 0xff0000,
    colori = 0x095afb;
  var point = (x,y,z)=>z*1e12-x*1e02+y*1e01;
  var line = (x,y,z)=>x*1e1+y*1e2+z*1e0;
  var dpoint = (x,y,z)=>point(x,y,z);
  var dline = (x,y,z)=>line(x,y,z);
  var dnorm = (x)=>(x.e12 > 0) ? x.Normalized : -x.Normalized;
  var {abs,cos,sin, floor, E, PI} = Math;
 
  // dual euclidean versor: move the argument to dual euclidean space, then bring the result back to euclidean space
  var deVersor = (v, x) => (!(v>>>!x));  
  
  var redbluelerp = (t) => (floor(t*255) * 65536 + floor((1-t)*255));
  var lerp = (imin,imax,omin,omax,t)=> { let id = imax-imin, od = omax-omin; 
      if (t < imin) t = imin; if (t>imax) t = imax; return omin + (((t-imin)/id)*od);}
      
  let interp = (arg0, arg1, t)=> (1-t)*arg0 + t*arg1;
  let interpArr = (arr, n=10) => {
    let segs = [...Array(arr.length-1)].map((x,i)=>[arr[i],arr[i+1]]),
        val = segs.map(([x0,x1])=>[...Array(n)].map((x,i)=>interp(x0,x1,(i/(n)))));
        return val.flat();
  }

  let segs = (arr, closed = false) => {
     let nn = arr.length;
     return arr.map((x,i,a ) => [a[i],a[(i+1)%nn]]);
  }
  let
      g = -2.5,
      f = 1,
      b = (g) => 1.0/(1/f - 1/g),
      tlator = ()=> 1 - (1/(2*f))*point(0,1,0),
      candle = (x, y, tform=1) => {
        let h=.8*y, w = .1*y, h2 = .2*y, w2 = .1*y,
          tg = dpoint(x,0,0),
        cobj = [
          dpoint(-w/2,0,1),
          dpoint(-w/2,h,1),
          dpoint(w/2,h,1),
          dpoint(w/2,0,1),
          dpoint(-w/2,0,1),
          ],
        fobj = [
          dpoint(0,h+h2/2,1),
          dpoint(-w2/2,h+h2,1),
          dpoint(0,h+h2+h2/2,1),
          dpoint(w2/2,h+h2,1),
          dpoint(0,h+h2/2,1),
          ];
        cobj = cobj.map((x)=>dnorm(x+tg));
        fobj = fobj.map((x)=>dnorm(x+tg));
        return segs(cobj.map((x)=>-(deVersor(tform,x)))).
          concat(segs(fobj.map((x)=>-(deVersor(tform,x)))));
      };
      
  let lens = (n = 40, r = 4, angle = PI/5.0)=>{
        let cx = r * cos(angle/2), delta = angle/(n-1.0);
        let val =
          [...Array(n)].map((x,i)=>dpoint(-cx+r*cos(-angle/2 + delta*i),r*sin(-angle/2+delta*i),1));
        return val.concat(val.map((x)=>line(1,0,0)>>>x));

      };
     
  let P = dpoint(-g,1.5,1),
      X = dpoint(1,0,0),
      F1 = dpoint(-f,0,1),
      F2 = dpoint(f,0,1),
      num = 21;

  let gd = this.graph(()=>{
    time = pause ? 1 : (.5+.5*sin(-PI/2+2*PI*(pause ? 0 : count())/1000.0));
    let sign = (P.e02 > 0 ? 1 : -1),
        lenstform = ()=>E**( sign*(1/(2*f))*point(0,1,0)),
        interptform = ()=>E**( sign* time* (1/(2*f))*point(0,1,0)),
        colorinterp = redbluelerp(1.0 - time),
        Po = dpoint(-f,sin(time),1), // (-g,sin(t),1),  //
        oPencil = [...Array(num)].map((x,i)=>dpoint(0,2.2*(num/2.0 - i)/num, 1)).
            map((x)=>x & P),
        oln = dline(1,0,P.e02),
        iln = -(deVersor(lenstform, oln)),
        lns = lens(),
        cdlo = candle(-P.e02,P.e01),
        cdli = candle(-P.e02,P.e01,lenstform),
        cdloL = cdlo.map((x)=>x & X),
        cdliL = cdli.map((x)=>x & F2);

    //console.log("pPo = ",pPo);
    return [
       0x0, dline(1,0,0), "v", dline(0,1,0), ...lns, 1e12,"Z", , 1e0, "z",
       0xaa8800, dline(1,0,-f), "fr",dline(1,0,f),"fl",
       coloro, ...cdlo, oln, ...oPencil,
       colori, ...cdli, iln,
       0x000, P,"P", deVersor(lenstform,P) , "P\'",
      colorinterp, ...(candle(-P.e02,P.e01,interptform)), 
      colorinterp, ...(oPencil.map((x)=>-(deVersor(interptform,x)))),
       ]
    }, {
      animate:true,
      lineWidth:2,
      pointRadius:.5,
      scale:.8,
      grid:false,
      dual:false});
      
  let ge = this.graph(()=>{
    time = pause ? 1 : (.5+.5*sin(-PI/2+2*PI*(pause ? 0 : count())/1000.0));
    let sign = (P.e02 > 0 ? 1 : -1),
        lenstform = ()=>E**( sign*(1/(2*f))*point(0,1,0)),
        interptform = ()=>E**( sign* time* (1/(2*f))*point(0,1,0)),
        colorinterp = redbluelerp(1.0 - time),
        Po = dpoint(-f,sin(time),1), // (-g,sin(t),1),  //
        oPencil = [...Array(num)].map((x,i)=>dpoint(0,2.2*(num/2.0 - i)/num, 1)).
            map((x)=>x & P),
        oln = dline(1,0,P.e02),
        iln = -(deVersor(lenstform,oln)),
        lns = lens(),
        cdlo = candle(-P.e02,P.e01),
        cdli = candle(-P.e02,P.e01,lenstform),
        cdloL = cdlo.map((x)=>x & X),
        cdliL = cdli.map((x)=>x & F2);

    //console.log("pPo = ",pPo);
    return [
       0x0, dline(1,0,0), "V", dline(0,1,0), 1e12,"Z", 1e0, "z",//...lns, 
       0xaa8800, dline(1,0,f), "f",dline(1,0,-f),"f\'",
       coloro,  oln, ...oPencil,
       colori,  iln,
       0x000, P,"P", deVersor(lenstform,P), "P\'", 
//       colorinterp, ...(candle(-P.e02,P.e01,interptform)), 
       colorinterp, ...(oPencil.map((x)=>-(deVersor(interptform,x)))), deVersor(interptform,P),
       ]
    }, {
      animate:true,
      lineWidth:2,
      pointRadius:.5,
      scale:.8,
      grid:false,
      dual:true});

  ge.style.maxHeight ='700px';
  ge.style.width = '100%';
  ge.style.background = '#fffffa';
  ge.style.border  = '1px solid #444';
  gd.style.maxHeight ='700px';
  gd.style.width = '100%';
  gd.style.background = '#fffffa';
  gd.style.border  = '1px solid #444';
  return {ge, gd, pbut};

});



md`\title{Thin lens optics using dual euclidean geometry}
\date{October 2022}
\author{Charlie Gunn}



## Demo

The following interactive demo shows a red candle.
The you-ser can drag the point P at the center of the candle flame.

The lens transformation is then applied to a selection of 
lines through P passing through the lens, producing a set of blue lines
meeting in the focal point P' of P.

The lens transormation moves the object line (vertical red line) to
the image line (vertical blue line).  

The two brown vertical lines are the focal
lines of the system. When P lies in these lines, the image line
moves to $e_0$, the ideal line of the EP,
which is the center line of the DEP. 
Hence the line pencil in $P$ maps to a parallel line bundle
in the direction (ideal point) $PZ$.

%%The demo has been adjusted so that if you drag $P$ to the left of the lens, 
%%the system reverses its behavior, so that the behavior of object and image are flipped.

${embed(pbut)} 
\includegraphics{${embed(gd)}}
The d-window shows the geometry displayed in the DEP 
and the lens transformation is a  $d$-translation. 

\includegraphics{${embed(ge)}}
The e-window shows the same code as the $e$-window with the ganja option dual set to true. 
The line pencils have been transformed into point ranges; the transformation of these points
is clearly a euclidean translation.
(Candles and lens have been removed since they distract from the main message here.)

## The thin lens: an introduction
Thin lens optics is a well-known approximation to a full optical
lens model that makes the following simplifications:
<ul>
<li> it ignores wave properties of light, </li>
<li> assumes the lens thickness is small compared to the focal length so
that for  the angle of refraction $\theta$, $\sin(\theta) \sim \theta$, and</li>
<li> assumes all lenses are circularly symmetric and centered on a single axis,
called the optical axis.
</ul>

Due to the circular symmetry, we can restrict attention to a 2D slice of the system through 
the axis of symmetry.  Rather than speaking of object and image planes, then, we deal
with object and image lines, etc.  The 3D version can be directly recovered by reversing this
process.

We show that the behavior of such thin lens  can be modeled 
in a dual euclidean plane in which the absolute point $Z$ lies in the center point of the lens.
Then the lens transformation is a dual euclidean translation.
We begin with an interactive demo.
## Discussion

### The thin lens formula
The traditional thin lens formula is $\frac{1}{o_d} + \frac{1}{i_d} = \frac{1}{f}$ where
<ul>
<li> $o_e$ is the euclidean distance of the object line $o$ from the center of the lens $Z$, </li>
<li> $i_e$ is the euclidean distance of the image line $i$ from $Z$, and </li>
<li> $f$ is the focal length of the lens.
</ul>

### Properties of thin lens model
It is well-konwn that the thin lens formula determines a unique linear transformation 
of the projective plane 
that maps lines parallel to the lens line $v$ (object lines) 
to other lines parallel to $v$ (image lines). 
In this transformation, 
<ol>
<li> $v$ is fixed point-wise, </li>
<li> horizontal lines are fixed (but not point-wise), </li>
<li> the right focal line $f_r$ maps to $z$, the $e$-absolute line,</li>
<li> $z$ maps to $f_l$, the left focal line, and </li>
<li> an arbitrary vertical line $o$ maps to the image line $i$ satisfying the lens formula.</li>
</ol>

### Matrix form

The transformation can be expressed as a 2x2 matrix 
$M_f = ((1,0),(-\frac1f,1))$
acting on the $x$-axis via homogeneous coordinates $(x,1)$.

**Exercises**: 1) Show that $M_f$ satisfies properties 1-5. 2) Show that points move
along lines through $Z$.

## Relation to metric geometry

We now turn to consider connections to metric geometry.
### Terminology 
We abbreviate euclidean plane as EP and the dual euclidean plane as DEP. We differentiate between
properties of the two geometries by the prefixes $d$- and $e$-.  For example, 
$d$-distance and $e$-distance, $d$-translation and $e$-translation, etc.

### Almost an $e$-translation ...

Since the $e$-absolute line $z$ is not fixed by the 
transformation, $M_f$ is not euclidean or even affine.

Nonetheless, $M_f$ has startling similarities to an $e$-translation, which 
can be characterized as a projectivity that:
<ol>
<li> fixes the $e$-ideal line $z$ point-wise and </li>
<li> fixes an $e$-ideal point $V$ line-wise. </li> 
</ol>
$V$ is called the direction vector of the translation. By 2., all points in the plane
move along lines through $V$, while all other lines translate parallel to themselves,
that is, they "rotate around" their ideal point, which by 1. is fixed.

A projection that fixes a line point-wise and a point line-wise is called an *elation*. 
It's easy to verify that $M_f$ is also an elation:
<ol>
<li>The point $Z$ is fixed line-wise, and</li>
<li>the line $v$ is fixed point-wise.
</ol>

### ... and exactly a $d$-translation

In fact, if we place the $d$-absolute point of a DEP at the center point $Z$ of the lens,
then the lens transformation becomes a $d$-translation, since now it

<ol>
<li> fixes the $d$-ideal point $Z$ line-wise and </li>
<li> fixes a $d$-ideal line $v$ point-wise. </li> 
</ol>

which is exactly the dual of an $e$-translation.

You can confirm this claim by observing the demo above with the
animated lens transformation activated. This second window dualizes the animation.
One sees that the moving line pencil is converted to a point range that undergoes
an $e$-translation. Hence, the original transformation is a $d$-translation.


## Reformulating the lens formula in DEP

The fact that the thin lens transformation is a $d$-isometry leads to the
question of how the thin lens formula appears when expressed using
$d$-measurement.

**Lemma**: Given a DEP with absolute point Z, an EP with absolute line z, and a line $a$.
Let $a_e$ be the  $e$-distance from $a$ to $Z$ and $a_d$ be the $d$-distance from $a$ to $z$. 
Then we can choose unit lengths so that for any $a$, $a_e a_d = 1$.

**Proof**: We use coordinates $(x,y,z)$ for points and $[a,b,c]$ for lines. WLOG, 
assume $Z=(0,0,1)$, $z=[0,0,1]$ and $a = [1,0,-k]$. 
Then $a$ is the line $x=k$, so $a_e = k$.  $a_d$ is the e-distance of $(0,0,1)$ and $(1,0,-k)$. 
To calculate the latter, note that $(0,0,1)$ is $d$-normalized, while the 
$d$-normalized form of $(1,0,-k)$ is $(-\frac1k,0,1)$. (Remember, 
$d$-lines have the same metric behavior as $e$-points.) Then $a_d = \frac1k$. 


**Theorem**: In the dual euclidean plane, the lens formula takes the form
$oz + zi = oi$ where $ab$ is the $d$-distance between the lines $a$ and $b$.

**Proof** Apply the Lemma to the three quantities in the thin lens formula.

**Remark** $Z$, the origin of the $e$-coordinate system, has no special significance
in $e$-geometry.
In the same way, $z$ is the origin of the $d$-coordinate system and has no 
special significance in $d$-geometry.

### Discussion
The analogous $e$-formula to the dual thin lens formula is trivial. 
It asserts (the obvious fact) that 
if three points  $O$, $Z$, and $I$ lie on a euclidean line, 
then the $e$-distances are additive.
In traditional vector notation $OZ+ZI=OI$ where 
$AB$ is the signed distance from $A$ to $B$ on their common line.

Seen in this light, the thin lens formula is equally trivial. 
It states that when three lines have a common point,
then the $d$-distances add in the same way. In particular, the $d$-distance from the 
object line $o$ to the center line $z$ plus the $d$-distance
from $z$ to the image line $i$ equals the $d$-distance from the object line to the image line.

**Corollary**: The thin lens transformation is a dual euclidean translation T of 
through a $d$-distance $oi$. The $d$-direction co-vector is the $y$-axis.

**Proof**: The lens transformation is a projectivity that obeys the thin lens formula given above.
$T$ is also a projectivity that obeys the thin lens formula.
In particular, since the two maps agree on 4 lines (for example, the lens line $v$, 
the two focal lines, and the center line $z$), they must be identical. \qed

## $e$- and $d$-translations

A homology is a projectivity that has a single line fixed point-wise (axis) and 
single  point fixed line-wise (center). When center and axis are incident, it's called an *elation*. 
Note that elation is a self-dual concept.

An $e$-translation is an elation whose axis is the $e$-ideal line. The direction of the translation 
is the center of the elation, in this case an ideal point. All points move along their joining
lines to the center (the *direction vector*), while all lines rotate around 
their intersection point with the axis (which are naturally all ideal points).
A $d$-translation is an elation, whose center is the $d$-ideal point, while
the axis (*direction line*) is the line $v$ of the lens. 
All lines rotate around their intersections points
with $v$, while all points move along their joining lines with $Z$, the center.



`

resolve_references();
