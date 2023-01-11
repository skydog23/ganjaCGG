notebook();

let {g3, sbut} = Algebra(2,0,1,()=>{

	let pause = true;
	//let pbut = button('pause', ()=> pause = !pause);
	let showPolar = false;
	let sbut = button('show polar conic', ()=> showPolar = !showPolar);
	class Extent1D {
		constructor(el0, el1, n=49, ta = PI) {
			this.el0 = el0;
			this.el1 = el1;
			this.num = n; 
			this.ta = ta;
			//console.log(" extent1d = ",this);
		}
		dirty = true;
		extent = [];
		update() {
			if (!this.dirty) return;
			this.extent =  [...Array(this.num)].map((x,i) => {let dt = i*(this.ta/(2*PI))/this.num; return this.getExtentAtTime(dt);});
			this.dirty = false;
		}
		getExtent() {this.update(); return this.extent;}
		getExtentAtTime(t) {let aa = t*2*PI; return cos(aa)*this.el0 + sin(aa)*this.el1;}
	}

	let getExtent = (el0, el1, num=25, ta = 2*PI) => { 
		return [...Array(num)].map((x,i) => {let aa = i*(ta/num); return cos(aa)*el0 + sin(aa)*el1;});}

	let getPointConic = (ext, Q, dconic) => {
		return ext.getExtent().map((x)=> x ^ (Q & polarPoint(x, dconic)));
	}

	let getLineConic = (ext, q, conic) => {
		return ext.getExtent().map((x)=> x ^ (q ^ polarLine(x, conic)));
	}

	let getExtent1D = (P, Q, conic, num=25, ta=PI) => {
		let p = polarLine(P, conic), perpie = (P | p), parrie = perpie*P;
		return new Extent1D(perpie, parrie, num, ta);
	}
	let mynorm = (pt) => {pt = pt.Normalized; if (pt.e12 < 0) pt = -pt; return pt;}

	let evalPtConic = ([A,B,C,D,E,F],P,Q)=>{ 
		let [x,y,z] = ptcoords(P), [X,Y,Z] = ptcoords(Q);
		return A*x*X+C*y*Y+F*z*Z+(1/2)*(B*x*Y+B*X*y+D*x*Z+D*X*z+E*y*Z+E*Y*z);
	}
	let dualConic = ([A,B,C,D,E,F] ) => [C*F-E*E,-(B*F-E*D),A*F-D*D,B*E-C*D,-(A*E-B*D), A*C-B*B];
	let polar = ([x,y,z], [A,B,C,D,E,F])=>[A*x+B*y+D*z,B*x+C*y+E*z,D*x+E*y+F*z];
	let polarPoint = (ln, qform)=>point(...polar(lncoords(ln),qform));
	let polarLine = (pt, qform)=>line(...polar(ptcoords(pt),qform));

	let [a,b] = [.5,1];
	let conic = [a,0,b,0,0,-1], dconic = dualConic(conic);

	// standard point definition
	let point = (x,y,z)=>z*1e12-x*1e02+y*1e01;
	let line = (x,y,z)=>x*1e1+y*1e2+z*1e0;
	let ptcoords = (pt)=>[-pt.e02,pt.e01,pt.e12];
	let lncoords = (ln)=>[ln.e1,ln.e2,ln.e0];
	let dist = (P,Q)=>{let D = !(P-Q); return sqrt(D<<D)};
	let num = 200, sc = 1;
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
			if (!pause)	{
				console.log("np0 np1 V0 V1",...ptcoords(np0)," ",...ptcoords(np1)," ",ptcoords(V0)," ",ptcoords(V1));
			}
			infinarr.push([p0, V0]);
			infinarr.push([V1, p1]);
		});
		return finsegs.concat(infinarr);
	}

	//  let lerp = (a,b,t)=> (1-t)*a + t*b;
	//  let myprint   = (lab,num)=>lab+num.toFixed(3);

	let {floor, sqrt, cos, sin, PI, abs} = Math;

	let conicCurve =  [...Array(num)].map((x,i)=>point(-cos(2*PI*(i/(num)))/sqrt(a), sin(2*PI*(i/(num)))/sqrt(b),1));
	let   P = point(1,1,1),  Q = point(1,0,1);
	let oP = P + point(.1,0,0);
	//console.log("P ",...ptcoords(P));

	// console.log("polar: ",lncoords(polarLine(P,conic)));
	// console.log("eval: ",evalPtConic(conic, P, P));

	// document.body.appendChild(this.graph(
	let ot = 0.0;
	let g3 = this.graph(
		()=>{
			let t = pause ? ot : performance.now()*0.0001;
			ot = t;
			let p = polarLine(P, conic), q = polarLine(Q,conic);
			let perpie = (P | p)*P, parrie = perpie*P;
			let ext = getExtent1D(P, Q, conic, num, PI),
				inducie = getPointConic(ext, Q, dconic),
				pinducie = !showPolar ? [] : inducie.map((x)=> polarLine(x, conic));
			let tp = ext.getExtentAtTime(t),
				tP = polarPoint(tp,dconic),
				tq = (tP & Q),
				tI = tp^tq;
			//        console.log("perpie, parrie ",...lncoords(perpie)," ",...lncoords(parrie));

			oP = P+0;
			return [0x0, 
				0xff0000, P,'P', p, 'p', tp, 'tp',
				0xaa00aa, ...mkcurveproj(inducie), tI, 'I', //...inducie, tI, 'I', //
				0x00c080,     ...pinducie,
				0x0044ff, Q,'Q', q, 'q', tq, 'tq', tP, 'tP',
				0x00aa00, ...mkcurve(conicCurve), //...conicCurve, //
			]
		},      
		{animate:true,pointRadius:1,lineWidth:2, grid:false, dual:false}
		// )
	)
	g3.style.maxHeight ='700px';
	g3.style.width = '100%';
	g3.style.background = 'white';
	g3.style.border  = '1px solid #444';
	return {g3, sbut};

})

md`\title{The more the merrier: conics create conics}
\date{July, 2022}
\author{Charlie Gunn} %%, Raum+Gegenraum}

Recall how  <a href="https://enki.ws/ganja.js/examples/coffeeshop.html#Dfshg4lur&fullscreen" target="blank"> a polarity on a conic</a> induces involutions on 1D extents such as line pencils and point ranges.

In this notebook we want to show how the same polarity induces projectivities between pairs of such 1D extents.  Further recall that in **not-yet-existent notebook** on projective generation of conics, we learned how such a projectivity gives rise to a conic.  

If the projectivity is $\pi: A \rightarrow B$ where $A$ and $B$ are line pencils, then a point conic arises by intersecting corresponding lines:

<CENTER>
<SPAN STYLE="border:1px solid black; background:#ffffcc; padding:10px">
$P(a) = a \wedge \pi(a) ~~~\text{for}~~~ a \in A$
</SPAN>
</CENTER>

Dually, if the projectivity is $\pi: a \rightarrow b$ where $a$ and $b$ are points ranges, then a line conic arises by joining corresponding points:


<CENTER>
<SPAN STYLE="border:1px solid black; background:#ffffcc; padding:10px">
$p(A) = A \vee \pi(A) ~~~\text{for}~~~ A \in a$
</SPAN>
</CENTER>

In the demo below, the green conic $C$ is fixed. The polarity on $C$ then induces a projectivity $\pi: P \rightarrow Q$ between the line pencils in the red point $P$ and the blue point $Q$. The intersection of corresponding lines  produces the purple conic $K$.

If instead you use the projectivity between the polar lines $p$ and $q$, a line-wise conic $K^*$ arises. You can use the $\texttt{show polar conic}$ button to display it.

You can drag $P$ and $Q$ and the purple conic follows along.
${embed(sbut)}
\includegraphics{${embed(g3)}}

**Exercises:**

1. When both $P$ and $Q$ are outside then $p$ and $q$ both intersect $C$ in two points. Verify that the purple conic goes through all four points. What happens when $p$ or $q$ is tangent to $C$? 
2. Dualize Exercise 1.
3. How do you think the exercise must be changed when $P$ and/or $Q$ lie inside the conic?

`


