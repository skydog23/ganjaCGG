notebook();

// Example two column layout
document.head.appendChild(Object.assign(document.createElement('style'),{ innerHTML:`
  .col  { flex: 50%; font-size:85%; padding-left:10px; }
  .col:first-child {border-right:1px solid #DDD; padding-left:0px; padding-right:10px; }
  .cols { display: flex; flex-direction: row; flex-wrap: wrap;  width: 100%; }
`}))
 
const dct = text=>String.raw`<SPAN STYLE="color:red">${String.raw(text)}</SPAN>`;


let {ge, gd, pbut} = Algebra(2,0,1,()=>{
  
  let _cnt = 0, step = 1, sp = 150.0, ttt = 0, ottt = 0;
  
  let cnt = (stp=false)=> {
    if (!stp) _cnt += step;
    if (_cnt > 3500) step = -1;
    else if (_cnt < 0) step = 1;
    return _cnt;
  }

  let pause = false;
  let pbut = button('pause motion', ()=> {
    pause = !pause; 
    ottt = ttt;});

  let point = (x,y,z)=>z*1e12-x*1e02+y*1e01;
  let mynormalize = (x)=>(x.e12 > 0) ? x.Normalized : -x.Normalized;
  let unitVector = (x)=>{
    let f = x.e01*x.e01+x.e02*x.e02; 
    return (f==0) ? point(0,0,0) : (1/sqrt(f))*point(-x.e02,x.e01,0)};
  let {E, PI,abs, sqrt, random} = Math;
  const star = (s) => [[point(-s,0,1), point(s,0,1)],[point(0,-s,1),point(0,s,1)]];

  const setprops = (s)=>{
    s.maxHeight ='700px';
    s.width = '100%';
    s.background = 'black';
    s.border  = '1px solid #444';
    return s;
  };
  
  let randomseed = ()=>{let n = Date.now()%100; [...Array(n)].map(x=>random()); return true};
  
  let aw = .16, al = .75;
  let isArrow = ([x,y]) => (x<al && abs(y-.5)<aw) || ((x >= al) && (4*(x-al)+2*abs(y-.5))<1);
  
  let arrowDots = (n, xs = 3, ys = 1) => [...Array(n)].map((x)=>[random(),random()]).
    filter(x=>isArrow(x)).
    map(x=>point(ys*(x[1]-.5),xs*(x[0]-.5),1));
  
  let arrowWire = ( xs = 2, ys = 1)=>[[0,-aw],[al,-aw],[al,-.5],[1,0],[al,.5],[al,aw],[0,aw]].
    map((x)=>point(ys*x[1],xs*(x[0]-.5),1));
  
  let segs = (arr)=>{let n = arr.length; return arr.map((x,i)=> [x,arr[(i+1)%n]])};
  
  let ylines = (n, sp) => [...Array(n)].map((x,i)=>{
    let ff = sp*(2*(i/(n-1.0))-1.0); return 1e1+ff*1e0;});
  let xlines = (n, sp) => [...Array(n)].map((x,i)=>{
    let ff = sp*(2*(i/(n-1.0))-1); return 1e2+ff*1e0;});
  
  let interpArr = (arr, n=10) => {
    let segs = [...Array(arr.length-1)].map((x,i)=>[arr[i],arr[i+1]]),
        val = segs.map(([x0,x1])=>[...Array(n)].map((x,i)=>interp(x0,x1,(i/(n-1)))));
    return val.flat();
  }

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

  let ytlate = (s)=>E**(.5*s*1e02),
      dualVersor = (v,x)=>!(v>>>(!x)),
      perspTr = (x,s=.45)=>dualVersor(ytlate(s),x),
      iperspTr = (x,s=.45)=>dualVersor(ytlate(-s),x);

  let ss = 0.5, //arrowDots(1000,12,4),
      foo = randomseed(),
      arrow = arrowWire(12,6),
      xls = xlines(40,8),
      yls = ylines(40,8);
  
  let ge = this.graph(()=>{
    //ttt = pause ? ottt : (Date.now()-start)/sp;
    ttt = cnt(pause)/sp;
    //console.log("t = ",ttt);
    let rotor = E**((PI/8)*1e12),
        tltor = E**((10-(ttt))*1e02),
        comp = rotor*tltor;  // first translate then rotate
    return [
//      0xffffcc, (((rotor*tltor)>>>arrow).map(x=>perspTr(x,ss))),
      0xffffcc, ...(mkcurveproj(((rotor*tltor)>>>arrow).map(x=>perspTr(x,ss)))),
      0x9e9e9e, perspTr(1e0,ss),"z", perspTr(rotor>>>1e01,ss),"Z",
      perspTr(rotor>>>1e02,ss),"X",
      0xffffff,...(yls.map(x=>rotor>>>x).map(x=>perspTr(x,ss))),
      ...(xls.map(x=>(rotor*tltor)>>>x).map(x=>perspTr(x,ss))),
      0xff8080, ...(xls.map(x=>x^1e1).map(x=>(rotor*tltor)>>>x).map(x=>perspTr(x,ss))),
      0x8080ff, ...(yls.map(x=>x^1e2).map(x=>(rotor*tltor)>>>x).map(x=>perspTr(x,ss))),
      ]},{
        animate:true,
        lineWidth:2,
        pointRadius:.5,
        scale:.6,
      });
      
    let gd = this.graph(()=>{
        ttt = cnt(pause)/sp;
        let rotor = E**((PI/8)*1e12),
        tltor = E**((10-ttt)*1e02),
        comp = rotor*tltor;  // first translate then rotate
    return [
      0xffffcc, ...((rotor*tltor)>>>arrow),
      0xffffcc, ...(arrow.map((x)=>(rotor*tltor)>>>x)),
      0x9e9e9e, 1e0,"Z", rotor>>>1e01,"z", rotor>>>1e02,"x",
      0xffffff,...(yls.map(x=>rotor>>>x)),
      ...(xls.map(x=>(rotor*tltor)>>>x)),
      0xff8080, ...(xls.map(x=>x^1e1).map(x=>(rotor*tltor)>>>x)),
      0x8080ff, ...(yls.map(x=>x^1e2).map(x=>(rotor*tltor)>>>x)),
     ]},{
        animate:true,
        lineWidth:2,
        pointRadius:.5,
        scale:.6,
        dual:true
      });
    
  setprops(ge.style);
  setprops(gd.style);
  return {ge,gd,pbut};
});

md`\title{Flow on black background}
\date{October 2022}
\author{Charlie Gunn}


${embed(pbut)}
<DIV CLASS="cols">
<DIV CLASS="col">


\includegraphics{${embed(ge)}}

</DIV>

<DIV CLASS="col">

\includegraphics{${embed(gd)}}

</DIV>
</DIV>




`
