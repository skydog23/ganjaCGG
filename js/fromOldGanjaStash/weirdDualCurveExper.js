
Algebra(2,0,1,()=>{
  // standard point definition
  var point = (x,y)=>1e12-x*1e02+y*1e01;
  var line = (x,y,z)=>x*1e1+y*1e2+z*1e0;
  var lerp = (a,b,t)=> (1-t)*a + t*b;
  var {floor} = Math;
  
  var sleep = (milliseconds) => {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

  var clerp = (a,b,t)=> floor((1-t)*255)*65536 + floor(t*255);
  var curve = (a,b,num) => [...Array(num)].map((x,i)=> lerp(a,b,i/(num-1.0)).Normalized);
//  var hnormalized = (P) => { let Q = P.Normalized; return (Q.e12 < 0) ? -Q : Q; }
  var hnormalized = (P) => P.Normalized;
  
  var zip = (arr1, arr2) => [...Array(arr1.length)].map((x,i)=>[arr1[i],arr2[i]]);
  var unzip = (arr) => {
    let num = arr.length,
      arr1 = [...Array(num)],
      arr2 = [...Array(num)];
      arr.map((x,i)=>{arr1[i] = x[0]; arr2[i] = x[1]});
      return [arr1, arr2];
  }
  
  var insertcolors = (list, c1, c2)=> {
    let num = list.length;
    return list.map((x,i) => [clerp(c1, c2, i/(num-1)), x]).flat();
  }
  
  // bring a point and a line together in the fairest way
  var incidize = (pt, ln) => {
    let perp = pt<<ln, //(pt*ln - ln*pt)/2,
        closest = perp*ln,
        parallel = perp*pt,
        M = hnormalized(pt + closest),
        m = (ln + parallel).Normalized;
        return [M,m];
  }
  
    // incidize the two curves using the magic incidizer function
  var incidizeL = (pts, lns)=> {
    let fullcurve = zip(pts, lns);
    let fullcurve2 = fullcurve.map((x)=>incidize(x[0], x[1]));
    return unzip(fullcurve2);
  }
  
  var pointsFromLines = (lns) => {
    return [...Array(lns.length-1)].map((x,i)=> hnormalized(-lns[i]^lns[i+1]));
  }
  
  var linesFromPoints = (pts) => {
    return [...Array(pts.length-1)].map((x,i)=>(pts[i]&pts[i+1]).Normalized);
  }
  
  var pullPoints = (pts, lns) => {
    let n = pts.length;
    let ctrs = pointsFromLines(lns);
    let npts = pts.map((x,i)=>{
      let t = .5; //i/(n-1.0);
      if (i == 0 || i==(n-1)) return x; // don't change
      else return hnormalized(x + pointW * stepsize * ((1-t)*ctrs[i-1]+t*ctrs[i]));
    });
    return npts;
  }
  
  var pullLines = (pts, lns) => {
    let n = lns.length;
    let tgts = linesFromPoints(pts);
    let nlns = lns.map((x,i)=>{
      let t = .5; //i/(n-1.0);
      if (i == 0 || i==(n-1)) return x; // don't change
      else return (x + lineW * stepsize * ((1-t)*tgts[i-1]+t*tgts[i])).Normalized;
    });
    return nlns;
  }
  
   // try to bring point-wise and line-wise curves to be derivatives of each other
  // assume that first and last elements are fixed
  // var dualize = (pts, lns) => {
  //   let n = pts.length;
  //   let centers = pointsFromLines(pts,lns);
  //   let tangents = linesFromPoints(pts, lns);
  //   let npts = pts.map((x,i)=>{
  //     let n = pts.length;
  //     if (i == 0 || i==(n-1)) return x; // don't change
  //     return hnormalized(x + pointW * stepsize * centers[i]);
  //   });
  //   let nlns = lns.map((x,i)=>{
  //     let n = lns.length;
  //     if (i == 0 || i==(n-1)) return x; // don't change
  //     let foo = (x - lineW * stepsize * tangents[i]);
  //     return x.Normalized;
  //   });
  //   return [npts, nlns];
  // }
 

  // parameters
  var stepsize = .01,
      pointW = 1.0,
      lineW = 1.0;
  var num = 10,
      its =30,
      ctr = 0,
      slp = 200;
  var color1 = 0xff0000,
      color2 = 0x0000ff,
      color3 = 0xffff00,
      color4 = 0x00ff00;
  // define two line elements
  var P1 = point(0,0),
      p1 = line(0,1,0),
      P2 = point(1,1),
      p2 = line(1,0,-1);

  var linecurve = curve(p1,p2,num),
    pointcurve = curve(P1,P2,num),
    centers = pointsFromLines(linecurve),
    tangents = linesFromPoints(pointcurve);

  // pointcurve = pointcurve.reverse();
  // linecurve = linecurve.reverse();
  var canvas=document.body.appendChild(this.graph(
      ()=>{
        if (ctr == 0) {
            [pointcurve, linecurve] = incidizeL(pointcurve, linecurve);
            sleep(1000);
            ctr++;
        }
        else if (ctr < its)  {
          sleep(slp);
          var linecurve2 = pullLines(pointcurve, linecurve);
          pointcurve = pullPoints(pointcurve, linecurve2);
          centers = pointsFromLines(linecurve);
          tangents = linesFromPoints(pointcurve);
          linecurve = linecurve2;
         ctr++;
        }
        var clinecurve = insertcolors(linecurve, color1, color2);
        var cpointcurve = insertcolors(pointcurve, color1, color2);

         // return the elements we want graphed
         return [
//            0xFF0000,p1, 0x0000ff, p2,
            0x0,
            ...clinecurve,
            ...cpointcurve,
            color3, ...centers,
            color4, ...tangents
            // ...fullcurve
         ]
      },      
      {animate:true,pointRadius:1,lineWidth:1, grid:true}
  ))
  canvas.style.backgroundColor = "white"
})
