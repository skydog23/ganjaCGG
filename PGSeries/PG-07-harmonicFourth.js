notebook();

var {g3} = Algebra(2,0,1,()=>{
  // Using Geometric/Clifford algebra with signature (2,0,1), based on the work of Charles Gunn
  var pt    = (x,y)=>1e12-x*1e02+y*1e01,
      ideal = (x,y)=>-x*1e02+y*1e01,
      length = (X)=>sqrt(X|X).toFixed(3),
      {sqrt, abs, sin, round} = Math;
  
  var norm = (m)=> sqrt(abs(m | m));
  var pointWithCoord = ([Z,I,U], x)=>{
    let nZ = Z * norm(I&U),
        nI = I * norm(Z&U);
        console.log("pwc: ",Z,I,U,nZ,nI,nZ+nI);
        return nZ + x*nI;
  }
  var projPtLn = (pt, ln)=> (pt | ln)^ln;
  var P=pt(-1,-.5),
      Q=pt(1,0),
      C=pt(0,.7),
      A=pt(-1,0),
      
      m01=()=>A&Q,
      m12=()=>A&P,
      m23=()=>C&Q,
      m30=()=>C&P,
      m02=()=>A&C,
      m13=()=>B&D,
      B=()=>m12^m23,
      D=()=>m01^m30,
      R=()=>m02^m13,
      p=()=>Q&R,
      q=()=>R&P,
      r=()=>Q&P,
      M=()=>m02^r,
      N=()=>m13^r,

      PM=()=>P&M,
      PN=()=>P&N, //X,
      QM=()=>Q&M,
      QN=()=>Q&N; //X;
    // The minus sign on qm is a symptom that there is no capacity yet to calculate signed
    // distances along a line...
    var pm = ()=>length(PM),
        pn = ()=>length(PN),
        qm = ()=>-length(QM),
        qn = ()=>length(QN),
        cr = ()=>((pn * qm)/(pm * qn)).toFixed(3);
    
      
  var g3 = this.graph(()=>{
    var ticks = [...Array(40)].map((x,i)=>pointWithCoord([P,Q,N],-20+i/1.0)),
        fanC = ticks.map((x)=>x&C),
        fanB = ticks.map((x)=>x&B),
        tmpB = fanC.map((x)=>x^m12),
        fanQ = tmpB.map((x)=>x&Q);
    return ["Four-line and harmonic fourth. Drag P, Q, C, A.","cr =(pn/pm)/(qn/qm)="+pm+":"+pn+"::"+qm+":"+qn+"="+cr, 
      0x444444, A,'A', B,'B', C,'C', D,'D',
       0xaa00aa, m01, "e",m12,"f",m23,"h",m30,"i",
       0x00aaaa, m02, "j",m13,"k",
       0x60a000, P, "P",Q,"Q",R,"R",
       0xff9900, r,"r", // p, "p",q,"q",
       0xff9900, M, "M",N,"N",
       0xff0000, ...ticks,
       0xffaaaa, ...fanC,
       0xa0a0ff, ...fanB,
       0xa0ffa0, ...fanQ
           ]},{
        // more render properties for the default items.
        pointRadius:.5,  // point radius
        lineWidth:1.5,      // line width
        fontSize:1.0,     // font size
        grid:false,         // grid
    scale:1.0,
    backgroundColor:"white",
    width:window.innerWidth,
    dual:false,
    animate:false});
    g3.style.maxHeight ='700px';
  g3.style.width = '100%';
  g3.style.background = '#fffff0';
  g3.style.border  = '1px solid #444';
  return {g3};

})

md`
\title{Harmonic happenings}
\date{August, 2022}
\author{Charlie Gunn}

\includegraphics{${embed(g3)}}
`
