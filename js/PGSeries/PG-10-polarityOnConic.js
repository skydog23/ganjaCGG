notebook();

let {g3, shbut, rbut, sbut} = Algebra(2,0,1,()=>{
  
  let showConstruct = true;
  let shbut = button('show construction lines', ()=> showConstruct = !showConstruct);
  let snaky = false;
  let sbut = button('show history', ()=> snaky = !snaky);
  let rbut = button('reset history', ()=>{pointcoll.reset(); lncoll.reset(); ptcurve=pointcoll.getSnake();}) 

    class Collector {
    constructor(length, samplerate) {
      this.length = length;
      this.samplerate = samplerate;
    }
    count = 0;
    scount = 0;
    snake = new Array(length);
    collect(obj) { 
      if (this.scount == 0) {   // collect one sample
        this.snake[this.count] = obj; 
        this.count++; 
        this.count = this.count%this.length;
      }
      this.scount++;
      this.scount = this.scount%this.samplerate;
    }
    getSnake() {return this.snake;}
    getCurrentIndex() {return this.count;}
    getLength() {return this.length;}
    reset() {this.count = 0; this.snake = new Array(this.length);}
  };

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
            // console.log("t, q(t) ",root.map((x)=>ptcoords(x))," ",root.map((x)=>evalPtConic(Qform, x, x)));
          }
          return root;
  }

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
  
  let {floor, sqrt, cos, sin, PI, abs} = Math;

  let conicCurve =  [...Array(num)].map((x,i)=>point(-cos(2*PI*(i/(num)))/sqrt(a), sin(2*PI*(i/(num)))/sqrt(b),1));
  let  pointcoll = new Collector(150, 2),
    lncoll = new Collector(150,2);
  let   P = point(1,1,1), offset = point(.02,0,0);
   let oP = P + point(.1,0,0);
  let ptcurve = mkcurve(pointcoll.getSnake());
  console.log("polar: ",lncoords(polarLine(P,conic)));
  console.log("find root: ",findroot(lncoords(polarLine(P,conic)), conic));
  console.log("eval: ",evalPtConic(conic, P, P));

  // document.body.appendChild(this.graph(
  let g3 = this.graph(
      ()=>{
        let p = polarLine(P, conic);
        let lncurve = lncoll.getSnake();
        if (snaky) {
          let d = dist(P,oP);
          if (d > .00001) { // only collect geometry when P moves
          pointcoll.collect(P+offset);
          lncoll.collect(p);
          // convert point curve to segments, then remove the segment joining start to end.
          ptcurve = mkcurve(pointcoll.getSnake());
          // console.log("0 pt length = ",ptcurve.length);
          ptcurve.splice(pointcoll.getCurrentIndex()-1,1);
          // console.log("1 pt length = ",pointcoll.getCurrentIndex()," ",ptcurve.length);
          lncurve = lncoll.getSnake();
          }
        } else {
          ptcurve = [];
          lncurve = [];
        }

        let showPair = (T1,T2)=>[T1, 'T1', T2, 'T2', polarLine(T1,conic), 't1', polarLine(T2,conic), 't2'];
        let construct = [];
        if (showConstruct) {
            let roots = intersect(p, conic);
//            console.log("intersect = ",roots);
            if (roots.length != 0)  construct = [ 0x00aa44, ...showPair(...roots)];
            else {
              //let P = (polarPoint(p, conic)).Normalized,
              let l1 = (P&1e12).Normalized,
              l2 = ((l1 * P) - (P*l1)).Normalized,
              lp = (l1+l2).Normalized,
              lm = (l1-l2).Normalized;
              let rootsp = intersect(lp, conic);
              let rootsm = intersect(lm, conic);
              // console.log("rootsp ",lm," ",rootsm);
              construct =  [0xaa0066, lp, 'p1', ...showPair(...rootsp), 0x6600aa, lm, 'p2', ...showPair(...rootsm)];
            }
        }
        oP = P+0;
     return [0x0, 
      0xff0000, P,'P', ...ptcurve,
      0x00aaaa, p,'p', ...lncurve,
      ...construct,
      0x0000aa, ...mkcurve(conicCurve),
       ]
      },      
      {animate:true,pointRadius:1,lineWidth:1.2, grid:false}
  // )
  )
  g3.style.maxHeight ='700px';
  g3.style.width = '100%';
  g3.style.background = '#fffff0';
  g3.style.border  = '1px solid #444';
  return {g3, shbut, rbut, sbut };

})

md`
\title{A polarizing influence} %%The polarity on a conic section}
\date{July, 2022}
\author{Charlie Gunn}

Every non-degenerate conic section establishes a 1:1 pairing of the points and lines 
of the plane called the 
**polarity** on the conic section.

**Demo** 

As you drag the red point $P$, the blue-green line $p$ moves.  $p$ is called the *polar line* of $P$. 
The buttons have the following effect:
* \emph{show construct} toggles the display of construction lines used to calculate the polar line.
* \emph{show history} toggles collecting and displaying a history of both polar point and polar line, and 
* \emph{reset} resets the history 

${embed(shbut)}
${embed(sbut)}
${embed(rbut)}
\includegraphics{${embed(g3)}}

**Mathematical description**

We write the polarity on the conic $C$ as $\Pi$.
Then $p := \Pi(P) =: P^\perp$ is the *polar line* of $P$,
and $P:=\Pi(p) =: p^\perp$ is the *polar point* of $p$. 
We give a geometric description in what follows, followed by an algebraic explanation for readers with familiarity with linear algebra.

It turns out that the conic section, rather than giving rise to the polarity, is actually a side-effect of the polarity.

**Properties of $\Pi$**

P1. **Self-conjugate elements:** If $X$ is incident with $Y^\perp$ we say $X$ is *conjugate* to $Y$ and write $X \perp Y$.  
If $X \perp X$ we say X is *self-conjugate*. The points and lines of the conic are the self-conjugate elements.
$P^\perp$ is called the *tangent line* at $P$; the point $p^\perp$ is called the *touching point* of $p$.

P2.  **Involutory:** $\Pi$ is an *involution*: $\Pi^2(P)=\Pi(P^\perp) = P$ and, similarly, $\Pi^2(p) = p$.

P3. **Symmetric:** $X \perp Y \iff Y \perp X$. In words, if $X$ lies on the polar of $Y$ then $Y$ lies on the polar of $X$.


**Constructing the polar line**

**Inside point** To obtain $p$ from a point $P$ outside the conic section, 
find the two tangent lines $t_1$ and $t_2$  from $P$ to the conic.
Let their touching points in $C$ be $T_1$ an $T_2$. By P1, $T_i = t_i^\perp$. By P3, $P^\perp$ 
passes through both $T_1$ and $T_2$ since $T_1^\perp$ and $T_2^\perp$ both pass through $P$. 
Hence $p = T_1 \vee T_2$, the joining line of $T_1$ and $T_2$.

**Outside point** A similar strategy is used  when $P$ lies inside the circle.
Then the tangent lines are no longer real. An alternative method is used to find $p$ which also depends
on P3 above.  Let $t_1$ ane $t_2$ be two lines passing through $P.$ Then find the two polar points
$T_1 = t_1^\perp$ and $T_2 := t_2^\perp$ by reversing the previous construction. 
Then by P3, $p := T_1 \vee T_2$ is the desired polar line.


<DIV STYLE="border:1px solid black; background:#fffff0; margin: 10x; padding:5px; text-align:left">
<p><b>Enrichment: An algebraic description</b> 

A conic section is represented as a symmetric bilinear form $B: P^2 \otimes P^2 \rightarrow \mathbb{R}$, $B(\mathbf{x},\mathbf{y}) = B(\mathbf{y},\mathbf{x})$.  The points $\mathbf{x}$ satisfying $B(\mathbf{x},\mathbf{x}) = 0$ are the points of $C$, while the lines $\mathbf{m}$ satisfying $B^{-1}(\mathbf{m},\mathbf{m}) = 0$ are the (tangent) lines of $C$. The polar line of a point $\mathbf{x}_0$ is the line of points (point range) $\mathbf{x}$ satisfying $B(\mathbf{x}_0, \mathbf{x}) = 0$, and the polar point of $\mathbf{m}_0$ is the point of lines (line pencil) $\mathbf{m}$ satisfying the dual condition $B^{-1}(\mathbf{m}_0,\mathbf{m}) = 0$. 

Sometimes $B$ is written using inner product notation: $B(\mathbf{x},\mathbf{y}) =: \langle \mathbf{x},\mathbf{y}\rangle_B$. Then the polarity $\Pi: P^2 \rightarrow (P^2)^*$ is given by $\Pi(\mathbf{x_0})(\mathbf{y}) := \langle \mathbf{x_0},\mathbf{y}\rangle_B$. If we fill in one of the two slots of $B$ we obtain the polar partner. Thus points $Q$ on $P^\perp$ satisfy $\langle Q, P \rangle_B = 0$, which is the condition for two elements to be orthogonal. This is the context justifying the use of the $\perp$ notation for the polar relationship.

The construction of metric geometries in projective geometry is based on choosing an **absolute quadric** given by such a $B$.  The polarity on this absolute quadric then determines the metric relationships in the resulting geometry. This *Cayley-Klein construction* is the basis of projective geometric algebra. [MISSING LINK]

</p>
</DIV>

`

