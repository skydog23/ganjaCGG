Algebra(2,0,1,()=>{
  let {abs, floor} = Math;
  var n = 360, s = 123, ss = 1;
  var P = 1e12 + 0.5e20 + 0.5e01,
    Q = 1e12 + .55e20 + .5e01;
  var roots = (mm, sc) => [...Array(mm)].map((x,k)=>1e12 + sc*Math.cos(2*Math.PI*k/mm)*1e20 + sc*Math.sin(2*Math.PI*k/mm)*1e01)
  return this.graph(()=>
  { s=s+0.02 * P.e01;
    n = floor(abs(2*360 * P.e02));
    let rts = roots(n, ss*(2*Q.e01)*(Q.e01));
    var lines = [...Array(n)].map((x,k)=>rts[k] & rts[Math.floor((k*s)%n)]);
    // var lc = floor(abs(Q.e20 * 0xffffff));
    //lines.unshift("s = "+s.toFixed(2),0x888888)
    return [0xaa0000, P , 0x00aaaa, Q, 0x888888, ...lines]
  },
  { scale : 1.5, linewidth : .25,  animate:true}
  ) 
})
