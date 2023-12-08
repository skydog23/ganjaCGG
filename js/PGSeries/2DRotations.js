notebook();

// Example two column layout
document.head.appendChild(Object.assign(document.createElement('style'),{ innerHTML:`
  .col  { flex: 50%; font-size:85%; padding-left:10px; }
  .col:first-child {border-right:1px solid #DDD; padding-left:0px; padding-right:10px; }
  .cols { display: flex; flex-direction: row; flex-wrap: wrap;  width: 100%; }
`}))
 
const dct = text=>String.raw`<SPAN STYLE="color:red">${String.raw(text)}</SPAN>`;

let {gerot, gdrot, pbut,incrB,decrB, toggleP, gB} = Algebra(2,0,1,()=>{
 
  let pause = false;
  let start = Date.now();
  let pbut = button('pause rotate', ()=> {pause = !pause; if (!pause) start = Date.now()});

  let dualG = false;
  let gB = button('dual geometry', ()=> {dualG = !dualG;});

  let s = .25, olds = s, step = 1.2, persp = true;
  let incrB = button('+ perspective', ()=> {s = s*step;});
  let decrB = button('- perspective', ()=> {s = s/step;});
  let toggleP = button('toggle perspective', ()=> {
      persp = !persp; 
      if (persp) s = olds; 
      else s = 0;
  });

  let setprops = (st)=>{
    st.maxHeight ='400px';
    st.width = '100%';
    st.background = '#fffffa';
    st.border  = '1px solid #444';
  };
  let point = (x,y,z)=>z*1e12-x*1e02+y*1e01;
  let line = (x,y,z)=>x*1e1+y*1e2+z*1e0;
  let norm = (P)=> sqrt(abs(P|P)),
      vnorm = (V) => sqrt(V.e02*V.e02 + V.e01*V.e01);
  let mynormalize = (x)=>(x.e12 > 0) ? x.Normalized : -x.Normalized;
  let {sqrt, abs,cos,sin, floor, E, PI} = Math;
 
  // make a polyline projective-safe by splitting segments that cross the ideal line
  // that is, the sign of the z-coordinate flips
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
			  infinarr.push([p0, V0]);
			  infinarr.push([V1, p1]);
		});
		return finsegs.concat(infinarr);
	}

  let color1 = 0xff6666, color1d = 0xffaaaa,
      color2 = 0xffdd88,
      color3 = 0xaaaaaa,
      color4 = 0xccaaff;
      
  // following functions allow applying a perspective transformation
  // to e-plane using a d-translation.
  let ytlate = (s)=>E**(s*1e02),
      dualVersor = (v,x)=>!(v>>>(!x)),
      perspTr = (s,x)=>dualVersor(ytlate(s),x),
      iperspTr = (s,x)=>dualVersor(ytlate(-s),x);

  let np = 20, nc = 4, maxr = 1.5,
     Z = point(0,0,1),
     z = !Z,
     P = point(0,0,1),
     star = (s1, s2, tf) => [[tf(s2,point(-s1,0,1)), tf(s2,point(s1,0,1))],
      [tf(s2,point(0,-s1,1)),tf(s2,point(0,s1,1))]],
    // a rotation around the origin followed by a translation by vector Q
     rotor = (t,Q)=>(E**(.5*(point(Q.e01,Q.e02,0))))*(E**(t*Z)),
     circle = (r,n, z=1, dual=false)=>{
       let rr = dual ? 1.0/r : r,
           val = [...Array(n)].map((x,i)=>point(rr*cos(2*PI*(i/n)), rr*sin(2*PI*(i/n)), z));
       if (dual) return val.map((x)=>!x);
       else return val;
     },
     absolute = circle(1,np,0,false),
     points = (nc, np, r=1, dual=false)=>[...Array(nc)].map((x,i)=>{
       return circle(r*(i+1)/(nc),np,1, dual);
     }).flat();


  let gerot = this.graph(()=>{
    let pts = points(nc, np, maxr, dualG);
    //if (pause) console.log("pts = ",pts);
    let t=pause ? 0 : .7*(Date.now()-start)/5000;
    let realP = mynormalize(iperspTr(s,P)), 
      rtr = rotor(t, realP),
      foo = (s == 0) ? [] : (absolute.map((x)=>rtr>>>x)).map((x)=>perspTr(s,x)),
      bar = circle(maxr,3*np,1, dualG).map((x)=>rtr>>>x).map((x)=>perspTr(s,x)),
      moo = (!dualG ? mkcurveproj(bar) : bar);
    return [
       (dualG ? color1d : color1), ...pts.map((x)=>rtr>>>x).map((x)=>perspTr(s,x)),
       color2, ...moo,
       color3, ...foo,
       color4, ...(absolute.map((x)=>rtr>>>!x)).map((x)=>perspTr(s,x)),
       0x0, perspTr(s,z),"z", P,"P", 
//       0x0000ff, perspTr(point(1,0,0)), "X", perspTr(point(0,1,0)), "Y",
       ]
    }, {
      animate:true,
      lineWidth:2,
      pointRadius:1,
      scale:.8,
      grid:false,
      dual:false});
      
  let gdrot = this.graph(()=>{
    let pts = points(nc, np, maxr, dualG);
    let t=pause ? 0 : .7*(Date.now()-start)/5000;
    let realP = mynormalize(iperspTr(s,P)), rtr = rotor(t, realP);
    let foobar = (vnorm(P-Z)<.0001) ? [] : (absolute.map((x)=>rtr>>>!x));
    //let foobar = (false) ? [] : (absolute.map((x)=>rtr>>>!x));
    return [
      color1d, ...(pts.map((x)=>rtr>>>x)),
      color2, ...(circle(maxr,3*np,1,dualG).map((x)=>rtr>>>x)),
      color3, ...(absolute.map((x)=>rtr>>>x)),
      color4, ...foobar,
       0x0bef79, ...star(.1,0,perspTr), 
       0x0, realP, "P", (z),"Z", 
       ]
    }, {
      animate:true,
      lineWidth:2,
      pointRadius:1,
      scale:.8,
      grid:false,
      dual:true});
      
  setprops(gerot.style);
  setprops(gdrot.style);
  return {gerot, gdrot, pbut, incrB, decrB, toggleP, gB};

});


md`\title{2D rotations}
\date{October 2022}
\author{Charlie Gunn}

[This episode assumes the reader has experienced the episode on the dual euclidean plane.]

## Rotation demo

The left window shows the $e$-plane. It's a perspective view, so that the
absolute line $z$ is seen as the horizon line. The fixed point $P$ of the rotation
can be dragged by the you-ser. 

The right window represents the dual picture of the $e$-plane in the left window 
(without the perspective).
Z is the absolute point of the $d$-plane. 


The circles of points centered on P in the left window become circles of lines in the
right window centered on the line P.  

The *dual geometry* button dualizes the
circles.  This shows that $e$-translations apply to both points and lines, just
as $d$-translations apply to both points and lines.

The buttons let the rotation be paused and resumed, and the perspective controlled.

${embed(pbut)}
${embed(incrB)}
${embed(decrB)}
${embed(toggleP)}
${embed(gB)}

<DIV CLASS="cols">
<DIV CLASS="col">


\includegraphics{${embed(gerot)}}

</DIV>

<DIV CLASS="col">


\includegraphics{${embed(gdrot)}}

</DIV>
</DIV>

## Discussion

A rotation is a direct isometry that has one proper fixed element. Its behavior 
can be understood by considering tstheir action on the ideal elements. To be precise:

<DIV CLASS="cols">
<DIV CLASS="col">


A 2D $e$-rotation fixes a ${dct`euclidean point`} $Z$ and the absolute ${dct`line`} $z$. 

A rotation is determined 
by one ideal ${dct`point`} $I$ and its image $I'$. 
Every ideal ${dct`point`} $J$ ${dct`moves along`}   $z$ 
so that $\angle_e JJ' = \angle_e II'$. This is a well-defined elliptic
isometry of the ${dct`point range`} $z$. 

If $P$ is any ${dct`euclidean point`} 
we can write $P = Z + I$
where $I := (P\vee Z)\wedge z$ is the ideal ${dct`point`} of the ${dct`line`} $P\vee Z$ 
weighted by the $e$-distance from 
$P$ to $Z$.  Then by linearity $P' = (Z + I)' = Z + I'$.
</DIV>

<DIV CLASS="col">

A 2D $d$-rotation fixes a ${dct`dual euclidean line`} $z$ 
and the absolute ${dct`point`} $Z$. 

A rotation is determined by one ideal ${dct`line`} $i$ and its image $i'$. 
Every ideal ${dct`line`} $j$ ${dct`rotates around`} $Z$ 
so that $\angle_d jj' = \angle_d ii'$. This is a well-defined elliptic
isometry of the ${dct`line pencil`} $Z$. 

If $m$ is any ${dct`dual euclidean line`} 
we can write $m = z + i$
where $i := (m\wedge z)\vee Z$ is the ideal ${dct`line`} of the ${dct`point`} $m\wedge z$ 
weighted by the $d$-distance from 
$m$ to $z$.  Then by linearity $m' = (z + i)' = z + i'$.


</DIV>
</DIV>




`

resolve_references();




