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

function regenerate(sig=-1) {
    console.log("sig = "+sig);  
Algebra({
    metric:[sig,1,1],
    basis:['1','e0','e1','e2','e01','e02','e12','e012']
}).inline(()=>{
    var point      = (x,y)=>(1e12-x*1e02+y*1e01).Normalized;
    var p = point(.5,-.5);
    // hyperbolic disc
    var {sin,cos,PI,E} = Math;
    var disc = [...Array(100)].map((x,i)=>point(sin(i/50*PI),cos(i/50*PI))).map((x,i,a)=>[x,a[i+1]||a[0]]);    
    var animate=1;
     var old = document.querySelector('svg');
    if (old) document.body.removeChild(old);
    var svg=document.body.appendChild(this.graph(()=>{
     var l = 1e1+1e2 -.5e0;
     if (animate == 1) l = l+Math.sin(Date.now()/1000)*.5e1;
     l = l.Normalized;
    return [
          0xffffff, p, "P",
          0xffffff, l, " &#8467; ",
          0xff0000,l*p, "&#8467;.P = -P.&#8467; ",l*p*1e012,"&#8467;PI",
          0xff8800,(l*p*l).Grade(2),"&nbsp;&nbsp; &#8467;P&#8467;",
          0x00AA88,(p*l*p).Grade(1),"P&#8467;P",
          0x0088ff,((p|l)*p).Grade(1),"(P.&#8467;)P",
          0x00ffff,((l|p)*l).Grade(2),"(&#8467;.P)&#8467;",
          0xffff00, ...(1e0*1e0==-1?disc:[])
  ]},{animate:1,lineWidth:2,scale:1.2,fontSize:1.6}));
  svg.style.backgroundColor='black';
   svg.style.width = svg.style.height = '100%'; 
})()};
regenerate();
