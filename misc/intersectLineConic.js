

Algebra(2,0,1,()=>{
  var {abs} = Math;
  var point = (x,y,z)=>z*1e12-x*1e02+y*1e01;
  var ptcoords = (pt)=>[-pt.e02,pt.e01,pt.e12];
  var mynorm = (pt) => {pt = pt.Normalized; if (pt.e12 < 0) pt = -pt; return pt;}
  
  var findRoot = ([a,b,c], [A,B,C])=> {
      var P0 = (c==0) ? 1e12 : mynorm(point(c*a,c*b, -(a*a+b*b))),
          V = point(b,-a,0);
      var ptAtTime = (t)=>P0+t*V,
          valueAtPt = ([x,y,z])=>A*x*x+B*y*y+C*z*z;
      var ot = 0.0, vt;
      // do {
      //     ot += .1;
      //     vt = valueAtPt(ptcoords(mynorm(ptAtTime(ot))));
      // } while (vt < 0);
      var count = 0, t = ot-.1, 
          Pt = mynorm(ptAtTime(ot)), 
          ovt = valueAtPt(ptcoords(Pt)), vt, df;
      console.log("count t vt ",count," ",ot," ",ovt," ",ptcoords(Pt));
      do {
            Pt = mynorm(ptAtTime(t)),
            vt = valueAtPt(ptcoords(Pt));
            df = (t-ot)/(vt-ovt); 
           // if (abs(vt-ovt)<.000001) break;
            console.log("count t vt ",count," ",t," ",vt," ",df," ",ptcoords(Pt));
            ot = t;
            ovt = vt;
            t = t - vt*df;
            count++;
      } while (count < 20 && abs(ovt) > .0001);
      // search for other root
      count = 0;
      t = -t;
      ot = t;
      Pt = mynorm(ptAtTime(ot)), 
      ovt = valueAtPt(ptcoords(Pt)); 
      do {
            Pt = mynorm(ptAtTime(t)),
            vt = valueAtPt(ptcoords(Pt));
            df = (t-ot)/(vt-ovt); 
           // if (abs(vt-ovt)<.000001) break;
            console.log("count t vt ",count," ",t," ",vt," ",df," ",ptcoords(Pt));
            ot = t;
            ovt = vt;
            t = t - vt*df;
            count++;
      } while (count < 20 && abs(ovt) > .0001);

       return ptcoords(Pt);
  }
  
  console.log(findRoot([1,1,-.3],[1,1,-1]));
  
  var c= this.graph(()=>[
    0xff0000,"Rooting", findRoot([1,1,-.3],[1,1,-1]).toString(),
  ],{scale:1.4, grid:1,pointRadius:1.5,fontSize:1.5})
  
  c.style.background='transparent';
  return c;

})
