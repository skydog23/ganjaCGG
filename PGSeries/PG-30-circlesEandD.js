notebook();

// Demo: The paths of the planets are circles -- dual euclidean circles, that is.
// June 6, 2022
// Charlie Gunn

/// Thanks to Steven De Keninck for making the ganja.js library
var {g3, shbut} = Algebra(2,0,1,()=>{

	let showC = true;
	let shbut = button('show construction lines', ()=>showC = !showC);

	var pt    = (x,y)=>1e12-x*1e02+y*1e01,
		line  = (a,b,c)=>c*1e0+a*1e1+b*1e2;

	let mkcurve = (arr)=>{let n = arr.length; return arr.map((x,i)=> [x,arr[(i+1)%n]])};

	let mkcurveproj = (arr)=>{
		let n = arr.length,
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

	let X = (a) =>(Math.cos(Math.PI*a)*1e01 + Math.sin(Math.PI*a)*1e02);
    let conicPt = (t) =>{ let pt = P&X(t); return pt ^ ((((pt^m)&M)^p)&Q)};
	var g3 = this.graph(()=>{
		var pencilP = [...Array(n)].map((x,k)=> P&X(k*1.0/n)),
			rangem = [...Array(n)].map((x,k)=>  (pencilP[k])^m),
			pencilM = [...Array(n)].map((x,k)=> (rangem[k])&M),
			rangen = [...Array(n)].map((x,k)=>  (pencilM[k])^p),
			pencilQ = [...Array(n)].map((x,k)=> (rangen[k])&Q),
			conic =[...Array(n)].map((x,k)=> {let aa = (k*(1.0/n)); return conicPt(aa)}),
			conicC =[...Array(200)].map((x,k)=> {let aa = (k*(1.0/200)); return conicPt(aa)});
	 	conicC = mkcurveproj(conicC);
		if (showC)
			return [ 
				0x00ff00, ...pencilP,  
				0xaa6600, ...rangem, 
				0x00aaaa, ...pencilM,
				0x0000ff, ...rangen,
				0xff00ff, ...pencilQ, 
				0x0000ff, m, "m",n,"n",M,"M",
				0x444444, ...conic, ...conicC,
				0xff0000, P,"P", Q,"Q",U,"U", V,"V",W,"W"]
		else return [
			0x444444, ...conic, ...conicC,
			0xff0000, P,"P", Q,"Q",U,"U", V,"V",W,"W"]
	},{
		// more render properties for the default items.
		pointRadius:1.0,  // point radius
		lineWidth:2,      // line width
		fontSize:1.5,     // font size
		grid:false,         // grid
		width:window.innerWidth,
		animate:false})
	g3.style.maxHeight = '600';
	g3.style.width ='100%';
	g3.style.background =  'white';
	g3.style.border = '1px solid #444';
	return {g3, shbut};
})

let {g1,g2,but} = Algebra(2,0,1,()=>{
  
  let paused = false;
  let but = button('pause', ()=>paused = !paused);

  // standard point definition
  let point = (x,y,z)=>z*1e12-x*1e02+y*1e01;
  let line = (x,y,z)=>x*1e1+y*1e2+z*1e0;
  let lerp = (a,b,t)=> (1-t)*a + t*b;
  let {floor, sqrt, cos, sin, PI} = Math;

  let num = 50;
  let Z = point(1,0,100000);  // should be point(0,0,1) but  doesn't work; this is a workaround
  let z = line(1,0,100000);   // ditto for line(0,0,1)
  let cx = .6, cy=0;
  let C = point(cx,cy,1);
  let ot;

   let g1 = this.graph(
      ()=>{
        Z.set(point(0,0,1));
        let circle =  [...Array(2*num)].map((x,i)=>point(cos(2*PI*(i/(2*num))) - C.e02, sin(2*PI*(i/(2*num)))+C.e01,1));
        let t = paused ? ot : performance.now()*0.0001%2;
        let P = point(cos(2*PI*(t)) - C.e02, sin(2*PI*(t))+C.e01,1), // moving point on circle
            V = (P - C)*1e12,   // the position vector rotated by 90 degrees is the velocity vector
            P2 = (C>>>P).Normalized, // reflect P to the opposite point of the circle
            ta = (P&V).Normalized,  // the tangent line at P
            ta2 = P2&V.Normalized,  // the tangent line at P2
            p = P&P2;               // the joining line of P and P2
        let geom = [0xff0000, ...circle,
            0x008800, z, "z",
            0x0044aa, C, "C", 
            0x000088, Z,"Z", 
            0x000000, P, "P", P2, "P'",
            0xff6600, V, "V", ta, "t", ta2, "t'",
            0xaa00aa, p, "p", p ^ 1e0, "W"];
        ot = t;
        return geom
      },      
      {animate:true,pointRadius:1,lineWidth:1.5, grid:true, dual:false}
  )
     let g2 = this.graph(
      ()=>{
       let circle =  [...Array(2*num)].map((x,i)=>point(cos(2*PI*(i/(2*num))) - C.e02, sin(2*PI*(i/(2*num)))+C.e01,1));
        let t = paused ? ot : performance.now()*0.0001%2;
        let P = point(cos(2*PI*(t)) - C.e02, sin(2*PI*(t))+C.e01,1),
            V = (P - C)*1e12,   // the position vector rotated by 90 degrees is the velocity vector
            P2 = (C>>>P).Normalized,
            ta = (P&V).Normalized,
            ta2 = P2&V.Normalized,
            p = P&P2;
                  
        let geom = [0xff8888, ...circle,
            0x008800, z, "z",
            0x0044aa, C, "C", 
            0x000088, Z,"Z", 
            0x000000, P, "P", P2, "P'",
            0xff6600, V, "V", ta, "t", ta2, "t'",
            0xaa00aa, p, "p", p ^ 1e0, "W"];

        ot = t;
        return geom
      },      
      {animate:true,pointRadius:.3,lineWidth:2, grid:true, dual:true}
  )
   g1.style.maxHeight = g2.style.maxHeight = '350px';
   g1.style.width = g2.style.width = '100%';
   g1.style.background = g2.style.background = 'white';
   g1.style.border = g2.style.border = '1px solid #444';
   return {g1,g2, but}
})

md`\title{E-circles and d-circles}
\date{July, 2022}
\author{Charlie Gunn}


Based on what we learned in the introduction to the dual euclidean plane [MISSING LINK] 

To deepen our understanding of the differences and similarities of euclidean geometry (EG) and dual eucliean geometry (DEG)
we look at circles in both geometries.

A circle is a special kind of *conic section*.  In school you learn that a conic section is the curve obtained by cutting a double-ended, infinite circular cone with a plane. The three non-degenerate types of conic sections are ellipses, parabolas, and hyperbolas.


See <a href="https://observablehq.com/@skydog23/projective-generation-of-conics" target="blank">this Observable notebook </a> where conic sections are introduced from the point of view of projective geometry.

%%The following ganja demo is taken from this notebook. It shows how the unique conic through five points can be produced in projective geometry without any algebra, just by joining points and intersecting lines. You can drag any of the five points on the conic and toggle display of the construction process.
%%${embed(shbut)}
%%\includegraphics{${embed(g3)}}


Conic sections play an important role in projective geometry (PG) where they arise as the self-conjugate elements of a special kind of projective transformation called a *polarity*, a projectivity that reverses points and lines and when repeated returns to its starting point. A conic is then the set of self-conjugate elements, that is, elements $x$ such that $\Pi(x)$ is incident with $x$.

An important result of PG states that all (non-degenerate) conic sections are projectively equivalent, that is, there is a projective transformation that maps any conic section onto any other one. So projectively every (non-degenerate) conic section is identical to every other one. 

But in euclidean and dual euclidean geometry, the transformation group is much smaller and the variety of different conic sections is much greater. One of the most important types of euclidean conics is the **circle**.   

## Euclidean circles (e-circles)

A circle is usually defined as the set of points a fixed distance from a given point. What could be simpler? Actually, for our purposes it's a complicated definition since we don't yet have a way of measuring distances, only angles [MISSING LINK].

Fortunately for us, there's an alternative characterization of a circle among all conic secctions that is much easier to dualize.

Let $t$ and $t'$ be two tangent lines to $C$ that are $e$-parallel 
with ideal meeting point $V$.

Let the touching points of $t$ and $t'$ be the points $P$ and $P'$, resp.
and $m := P \vee P'$ be their joining line.
Then $C$ is an $e$-circle $\iff$ the ideal point $W$ of $m$ is **always** perpendicular to $V$.

The *center point* $C$ of the $e$-circle is then the common point of all the $m$ lines. 

## Dual euclidean circles (d-circles)

If we dualize everything above we arrive at a characterization of a dual euclidean circles ($d$-circle).

Let $T$ and $T'$ be two  points of $C$ that are $d$-parallel 
with ideal joining line $v$.

Let the tangent lines to C at $T$ and $T'$ be $p$ and $p'$, resp.
and $M := p \vee p'$ be their intersection point.
Then $C$ is a $d$-circle $\iff$ the ideal line $w$ of $M$ is **always** perpendicular to $V$.

Furthermore, the common line of all the points $M$ is the *center line* $c$ of the $d$-circle. 

## Dualing circles: Interactive e- and d-circle demo 
The following ganja animation contains two windows implementing the conditions described above.
The upper (the $e$-window) shows an e-circle, the bottom one (the $d$-window) shows a d-circle.

Implementation details are provided below.

The $e$-window shows how every pair of parallel tangent lines to the red circle satisfy the stated
 condition.  **Exercise:** Why doesn't a general ellipse satisfy this condition?

When you  drag the center point $C$ in the $e$-window, the $e$-circle performs an $e$-translation 
and remains an $e$-circle throughout.
Consequently, the figure in the  $d$-window performs a $d$-translation and remains a $d$-circle throughout. 

To our euclidean eyes, the appearance of $C$ in the lower window appears to change.
However, since it satisfies the dual characterization of a circle, it remains a $d$-circle throughout.

Note that the center $c$ of the $d$-circle is the dual of the center point $C$.  Since $C=(.8,0,1)$ to begin with, it's the line $.8x+0y+1=0$ which is equivalent to the equation $x=-1.25, the blue vertical line to the left of the $d$-circle. 
As you drag $C$, the center line $c$ naturally moves too -- so that it's line coordinates are always the same as the point coordinates of $C$.

**Exercise.** As you drag $C$, focus on the relation of $C$ to the origin $Z$.
When does the $d$-circle appear to be an $e$-circle? an $e$-parabola? an $e$-hyperbola?


${embed(but)}
\includegraphics{${embed(g1)}}
The $e$-window shows the $e$-circle in the euclidean plane.

\includegraphics{${embed(g2)}}
The $d$-window shows the $d$-circle in the dual euclidean plane. 

### Implementation notes

The upper and lower graphics windows are generated by a single ganja program.
The only difference is that 
the $\texttt{dual}$ option of ganja has been used when generating the scene graph for the the $d$-window.
In the $e$-window, the 1-vectors are drawn as lines (default), while in the $d$-window they are
drawn as points ($\texttt{dual:true}$).

In the language of PGA, the $e$-window shows the algebra $P(\mathbb{R}^*_{2,0,1})$ where 1-vectors are lines,
while the $d$-window shows the algebra $P(\mathbb{R}^{2,0,1})$, where 1-vectors are points. The coordinates
for the $k$-vectors are the same in both windows but we write the indices in the $e$-window as subscripts and in the $d$-window as superscripts.

More precisely: let $(u,v,1)\_e$ be the euclidean point $u e_{20} + v e_{01} + e_{12}$ and $[p,q,r]_e$ for the euclidean line $p e_1 + q e_2 + r e_0$ in the $e$-window. Here we use the convention that $()$ represents point coordinates and $[]$ represents line coordinates. 

Then, in the $d$-window, these elements will be appear as the DE line $[u,v,1]_d=u e^{20}+v e^{01}+ e^{12}$ and the DE point $(p,q,r)_d = p e^1 + q e^2 + r e^0 $. 

**Examples**:
1. $[0,0,1]_e$ represents the ideal line of the euclidean plane. $(0,0,1)_d$ is the ideal point of the dual euclidean plane. The 2-vector $(0,0,1)_e$ is the origin of the $e$-coordinate system; the 2-vector (line) $[0,0,1]_d$ is the origin of the $d$-coordinate system. So, what in one window is the ideal element is in the other window the center. 
2. The point $(x_0,y_0,1)_e$ in the euclidean circle maps to the line $[x_0,y_0,1]_e$ in the dual euclidean circle. The latter has equation $ x_0 x + y_0 y = -1$ which is a line tangent to the circle (on the opposite side of the point).
**NOTE**  the labeling in the lower window does not flip the case as is done in the discussions above. 
This is due to the
way that the figure is generated using the $ \texttt{dual:true}$ option.   
Theoretically,the "dictionary of duality" should flip the case of labels 
so that point labels are always upper-case and line labels are always lower-case.


`







