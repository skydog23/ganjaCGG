notebook();


let {g3, pbut, sbut, fbut, wmbut, abut} = Algebra(2,0,1,()=>{

	var audio = document.body.appendChild(document.createElement('audio'));

	audio.src = 'https://assets.mixkit.co/sfx/download/mixkit-multiple-fireworks-explosions-1689.wav';

	let abut = button("play audio",()=>audio.play());
	let pause = false;
	let pbut = button('pause', ()=> pause = !pause);
	let showC = false;
	let sbut = button('show construction lines', ()=> showC = !showC);
	let showF = false;
	let fbut = button('show focal points', ()=> showF = !showF);
	let showWM = false;
	let wmbut = button('show windmill', ()=> showWM = !showWM);

	let clr = (r,g,b)=> floor(r*255)*65536 + floor(g*255)*256 + floor(b*255);
	let rainbow = (tt)=> {let t = tt%1.0; 
		if (3*t<1) return clr(1-3*t,0,3*t); 
		else if (3*t<2) return clr(0,3*(t-1/3),1-3*(t-1/3)); 
		else return clr(3*(t-2/3), 1-3*(t-2/3),0); }

	let intersect = (ln, qform)=>{
		let lnn = ln.Normalized;
		let [a,b,c] = lncoords(lnn);
		// console.log("a b c",a," ",b," ",c);
		let roots = findroot([a,b,c], qform);
		// console.log("roots ",roots);
		return roots;
	}

	let findroot = ([a,b,c], Qform)=> {
		let P0 = (c==0) ? 1e12 : mynorm(point(c*a,c*b, -(a*a+b*b))),
			V = point(b,-a,0);
		let [PP,PV,VV] = [evalPtConic(Qform,P0,P0),evalPtConic(Qform,P0,V),evalPtConic(Qform,V,V)];
		// console.log("PP,PV,VV ",PP,PV,VV);
		let D = PV*PV-PP*VV;
		let root = [];
		if (D>=0) {
			root = [(-PV+sqrt(D))/VV, (-PV-sqrt(D))/VV];
			root = root.map((x)=>P0 + x*V);
			//console.log("D = ",D," ",root);
			// console.log("t, q(t) ",root.map((x)=>ptcoords(x))," ",root.map((x)=>evalPtConic(Qform, x, x)));
		}
		return root;
	}

	// construct a rotating line at time t that passed through the point P
	let lineAtTandP = (t,P) => {
		let c = cos(t),
			s = sin(t);
		return line(c,s,-(-c * P.e02 + s * P.e01));
	}
	// normalized a point to for positive z-coordinate
	let mynorm = (pt) => {pt = pt.Normalized; if (pt.e12 < 0) pt = -pt; return pt;}

	let evalPtConic = ([A,B,C,D,E,F],P,Q)=>{ 
		let [x,y,z] = ptcoords(P), [X,Y,Z] = ptcoords(Q);
		return A*x*X+C*y*Y+F*z*Z+(1/2)*(B*x*Y+B*X*y+D*x*Z+D*X*z+E*y*Z+E*Y*z);
	}
	let polar = ([x,y,z], [A,B,C,D,E,F])=>[A*x+B*y+D*z,B*x+C*y+E*z,D*x+E*y+F*z];
	let polarPoint = (ln, qform)=>point(...polar(lncoords(ln),qform));
	let polarLine = (pt, qform)=>line(...polar(ptcoords(pt),qform));

	let [a,b] = [.5,1];
	let conic = [a,0,b,0,0,-1], dconic = [1/a,0,1/b,0,0,-1];

	// standard point definition
	let point = (x,y,z)=>z*1e12-x*1e02+y*1e01;
	let line = (x,y,z)=>x*1e1+y*1e2+z*1e0;
	let ptcoords = (pt)=>[-pt.e02,pt.e01,pt.e12];
	let lncoords = (ln)=>[ln.e1,ln.e2,ln.e0];
	let dist = (P,Q)=>{let D = !(P-Q); return sqrt(D<<D)};
	let num = 200;
	let mkcurve = (arr)=>{let n = arr.length; return arr.map((x,i)=> [x,arr[(i+1)%n]])};
	//  let lerp = (a,b,t)=> (1-t)*a + t*b;
	//  let myprint   = (lab,num)=>lab+num.toFixed(3);
	let fireworks = (P, r, n) =>
		[rainbow(r/4), ...[...Array(n)].map((x,i)=>(P-1e12)+point(-r*cos(.5*r+2*PI*(i/(n))), r*sin(.5*r+2*PI*(i/(n))),1))];

	let littleSquare = (p, q, d) => {
		let Pi = d* (p ^ 1e0),
			Qi = d* (q ^ 1e0),
			Z = (p^q).Normalized;
		return [Z, Z+Pi, Z+Pi+Qi, Z+Qi];
	}
	let {floor, sqrt, cos, cosh, sinh, sin, PI, abs, pow} = Math;

	let conicCurve =  [...Array(num)].map((x,i)=>point(-cos(2*PI*(i/(num)))/sqrt(a), sin(2*PI*(i/(num)))/sqrt(abs(b)),1));
	let   P = point(1,1,1),
		ot = 0;
	//  console.log("P,p ",conic," ",ptcoords(P)," ",lncoords(polarLine(P)));
	let rightAngle = false,
		start = -1,
		fwstart = 0,
		tol = .02,
		foundIt = false,
		urtext = "Found focal point = ",
		text = urtext+"false";

	let g3 = this.graph(
		()=>{
			let t = pause ? ot : performance.now()*0.0001;
			if (start < 0) start = t;
			let p = polarLine(P, conic); //!polarPoint(!P);
			let q = lineAtTandP(2*PI*t,P);
			let Q = polarPoint(q, dconic);
			let q2 = P&Q;
			let inpro = (((q.Normalized)<<(q2.Normalized)).s);  // goes from -1 to 1
			let mag = 1;
			if (abs(inpro) < tol) { // right angle
				if (!rightAngle) start = t;
				rightAngle = true;
				mag = 0;
			} else {
				rightAngle = false;
				start = t;
				foundIt = false;
				text = urtext+"false";
			}
			if (t - start > .25) {
				if (!foundIt) { audio.play(); fwstart = t; } //showF = true; }
				foundIt = true;
				text = urtext+"true";
			}
			let color = clr(  .5, .5,  .5+.5*(mag));

			//        let showPair = (T1,T2)=>[T1, 'T1', T2, 'T2', polarLine(T1,conic), 't1', polarLine(T2,conic), 't2'];
			let showPair = (T1,T2)=>[T1,, T2, , polarLine(T1,conic), polarLine(T2,conic)];
			let roots = intersect(q, conic );
			let qgeom = [];
			if (roots.length != 0) {
				qgeom = [ 0x00aa44, ...showPair(...roots)];
			}         
			roots = intersect(q2, conic );
			let q2geom = [];
			if (roots.length != 0) {
				q2geom =  [ 0xaa0088, ...showPair(...roots)];
			} 

			ot = t;
			let r = 2*(t-fwstart) + 4*pow(2*(t-fwstart), 3);
			let fw = (!foundIt || r > 5.0) ? [] : fireworks(P, r, 50);
			let construct = showC ? [...qgeom, ...q2geom] : [];
			let focal = showF ? [0x00ff00, point(-sqrt((b-a)/(a*b)),0,1), 'F\'', point(sqrt((b-a)/(a*b)),0,1), 'F'] : [];
			let windmill = showWM ? [ 0xffaa00, (q | P), 'q perp', littleSquare(q,q|P,.15)] : [];

			return [ 
				0x0, 
				//text,
				...focal,
				0xff0000, P,'P', p,'p',
				0xffaa00, q,'q', Q,'Q', 
				color, q2, 'q\'', polarPoint(q2, dconic), 'Q\'',
				...windmill,
				...construct,
				0xffff00, ...fw,
				0x0000aa, ...mkcurve(conicCurve),
			]
		},      
		{animate:true,pointRadius:1,lineWidth:4, grid:false}
		// )
	)
	g3.style.maxHeight ='700px';
	g3.style.width = '100%';
	g3.style.background = 'white';
	g3.style.border  = '1px solid #444';
	return {g3, pbut, sbut, fbut, wmbut, abut};
	//return {g3, pbut};

})

md`\title{It's all right (angles)! -- involutions and focal points}
\date{July, 2022}
\author{Charlie Gunn}


In <A HREF= "https://enki.ws/ganja.js/examples/coffeeshop.html#-CccnfYIB&fullscreen" TARGET="blank">this lesson</A>
we learned about the polarity $\Pi$ on a conic section $C$.  

Let $P$ be a point and $C$ a conic section with polarity $\Pi$. 
Recall that we also write $\Pi(X)$ as $X^\perp$.

$\Pi$ produces a wealth of movements among the elements of the plane, in particular the point ranges and line pencils. We look more closely at this now.

##  Conic sections induce involutions on point ranges
Start with any point range $p$ not belonging to $C$ (that is, not tangent to $C$).
Every point $Q$ of $p$ has a polar line $q = Q^\perp$, and $q$ intersects $p$ in a point $Q' := \pi(Q) := Q^\perp \wedge p$.
By P3, $Q' \in Q^\perp \Rightarrow (Q')^\perp \in Q$.  But since
$Q'' = Q'^\perp \wedge p$ and $Q \in p$, $Q'' = Q$. Hence, $\pi^2=Id$ and $\pi$ is an involution.
$Q'$ is called the *conjugate* of $Q$ in $p$ (with respect to $C$).

See the animated demo below: the red line $p$ and the two points $Q$ and $Q'=\pi(Q)$.

##  Conic sections induce involutions on line pencils
Similarly, given a line pencil $P$ not belonging to $C$ (that is, $P$ is not a point of $C$) 
define $\pi: P \rightarrow P$ by $q' := \pi(q) := q^\perp \vee P$ for $q \in P$.
Everything goes throught exactly as in the case of a point range, and we obtain an
involution on the line pencil $P$.

See the animated demo below: the red point $P$ and the two lines $q$ and $q'=\pi(Q)$.

These involutions are hyperbolic (i.e. there are two fixed elements) when the point range (line pencil) shares two points (lines) with
the conic; otherwise they are elliptic (no fixed elements).

## Focal points of conic sections
### The absolute involution
[Missing link to other notebook!] The euclidean plane is obtained by choosing an ideal line $\omega$ and an 
elliptic involution $i$ on it. (Elliptic means here that the involution has no fixed points.) 
The elliptic involution determines how
angles are measured in the space. The directions $V$ and $i(V)$ in $\omega$ are
at right angles to each other. %%Hence they form an orthogonal basis. Intermediate angles are determined by writing directions as a linear combination of $V$ and $i(V)$ and taking inner products.

### Focal points of a conic
The involution $\pi$ on a pencil $P$ can be *in perspective*
to $i$. This means, $\pi(q) \wedge \omega = i(q \wedge \omega)$.
In words, $\pi(q)$ is always perpendicular to $q$. 
In this case, $P$ is said to be a *focal point* of $C$.

For example, the center of a circle is the unique focal point of the circle. Other non-degenerate conic sections have two focal points symmetrically located with respect to their center point. 

## "It's all right!" (the focal point game)
A conic section (dark blue) determines involutions on the point range $p$ and the line pencil $P$. 

The involution is represented by an animated line: the orange line $q$ rotates continually around the point $P$,
while the conjugate line $q'$ is drawn in blue. 
At the same time the polar points $Q$ and $Q'$ form an involution on the polar line $p$.

The aim of the game is to find a position for $P$ where $q$ and $q'$ remain perpendicular throughout.  
By the above, that means you have found a **focal point**!

The color of $q'$ changes from blue to grey when the angle between $q$ and $q'$ gets close to a right angle.  
You'll know you've won the game when the **fireworks** appear. 

%%If you get a little impatient, you can clock the  $\colorbox{#ffff99}{\texttt{show windmill}}$ button to toggle display of the perpendicular line to $q$. 
If you get a little impatient, you can click the  $\colorbox{beige}{\texttt{show windmill}}$ button to toggle display of the perpendicular line to $q$. 
If you get very impatient, the $\colorbox{beige}{\texttt{show focal points}}$ button toggles display of the two focal points.
There's also a button that toggles the construction lines for the animation. 

**Variation:** you can also attempt to position $P$ at the **center** of the conic. The center is defined to be the polar point of the ideal line of the euclidean plane. To play this variation, you need to display the construction lines. When the opposite pairs of tangent lines are parallel pairs, $P$ is at the center...

	${embed(pbut)} 
${embed(sbut)}
${embed(fbut)}
${embed(wmbut)}
\includegraphics{${embed(g3)}}



`

