document.body.appendChild(Object.assign(
  document.createElement('DIV'),
  {innerHTML:`<SELECT STYLE='position:absolute'>
    <OPTION SELECTED VALUE="0">Euclidean</OPTION>
    <OPTION  VALUE="-1">Hyperbolic</OPTION>
    <OPTION VALUE="1">Elliptic</OPTION>
  </SELECT><DIV STYLE="position:absolute; left:100px"></DIV>`}
)).onchange = function(e) {
    debugger
  regenerate(this.firstChild.value|0);    
}

function regenerate(sig=0) {

Algebra({
    metric:[sig,1,1],
    basis:['1','e0','e1','e2','e01','e02','e12','e012']
}).inline(()=>{

  var title = ["hyperbolic","euclidean","elliptic"][this.describe().metric[1]+1]; 

  // From "Doing euclidean plane geometry using projective geometric algebra" 
  // Charles Gunn - https://arxiv.org/abs/1501.06511, p21.
  
  //   Find and illustrate the unique direct isometry that takes (A,m) to (A2,m2)
  //   Note that ganja.js allows implementing this letter for letter like in
  //   the paper .. 
  
  var point      = (x,y)=>(1e12-x*1e02+y*1e01).Normalized,
      join       = (X,Y)=>(X&Y).Normalized,
  
  // lerp between motor x and y via the correct path. (we assume x.s > 0)
      lerp       = (x,y,a)=>y().s<0?(-(1-a)*x+a*y):(1-a)*x+a*y,
      {sin,cos,PI,E} = Math;
      
    // Start with two points A and A2 (and a helper)      
  var A=point(0,0.5), A2=point(0.5,0), B=point(0,0), B2=point(.1,1);

// If we already moved, restore positions.    
  if (localStorage.vals) {
      var vals = JSON.parse(localStorage.vals);
      A.set(vals.A); A2.set(vals.A2); B.set(vals.B); B2.set(vals.B2);
      A=A.Normalized; B=B.Normalized; B2=B2.Normalized; A2=A2.Normalized;
  }
  
  // Form the lines m and m2 using these points.
    var m=()=>join(B,A), m2=()=>join(A2,B2),
  
  // Find intersection of m and m2 and line through a and a2    
      M=()=>(m^m2), a=()=>join(A,A2),
      
  // Find the midpoint between A and A2 and the orthogonal line through it.      
      Am=()=>(A+A2), r=()=>(a|Am),
      
  // Find the line between m and m2 and cut that with r to find the center of our isometry      
      c=()=>(m-m2), C=()=>(r^c),
      
  // Construct the transformation as a rotation around C. (or translation if C is ideal)       
      s=()=>join(A,C), g=()=>(r*s),
  
  // Interpolate the isometry to illustrate the solution. 
      lines = [...Array(25)].map((x,xi)=>()=>lerp(1,g,xi*0.04)>>>m),
      path = [...Array(25)].map((x,xi)=>()=>lerp(1,g,xi*0.04)>>>A).map((x,i,a)=>[x,a[i-1]||x]),
      pathB = [...Array(50)].map((x,xi)=>()=>lerp(-1,g,xi*0.02)>>>A).map((x,i,a)=>[x,a[i-1]||x]),
      
  // The hyperbolic disk
     disc = [...Array(100)]
            .map((x,i)=>point(sin(i/50*PI),cos(i/50*PI)))
            .map((x,i,a)=>[x,a[i+1]||a[0]]),

  // The letter L
     LP = [[-1,-1],[-1,1],[0,1],[0,0.8],[-0.8,0.8],[-0.8,-1]]*0.7,
     letter = [...Array(6)]
            .map((x,i)=>()=>A-LP[i][0]*0.1e02 + LP[i][1]*0.1e01)
            .map((x,i,a)=>[x,a[i+1]||a[0]]),

  // all the letters L.
     circs = [...Array(50)].map((x,i)=>
       letter.map(x=>()=>E**((i/50*PI-PI/2)*C().Normalized)>>>x)
     ).flat();

   var old = document.querySelector('svg');
  if (old) document.body.removeChild(old);
  var svg=document.body.appendChild(this.graph(()=>{
     // save A,A2,B,B2
     localStorage.vals = JSON.stringify({A:[...A],A2:[...A2],B:[...B],B2:[...B2]})
     return [
    "","2D "+title+" PGA",
    0x888888,...lines,
    0xffff44,m,"m &rarr; ",m2,"m' &rarr;",B,B2,...(1e0*1e0==-1?disc:[]),//...points,
    0x00ff00,c,"c",
    0x00ffff,r,"r",Am,"Am",
    0xff4444,s,"s", 
//    0x8888ff,...circs,
    0xff88ff,A,"A",A2,"A'",a,"a",
    0xffffff,M,"M",C,"C",...path,0xFFAAAA,//...pathB,
  ]},{scale:1.5,lineWidth:2.0}));
  svg.style.backgroundColor = "black",
  svg.style.width = svg.style.height = '100%';
  })()}

regenerate();
