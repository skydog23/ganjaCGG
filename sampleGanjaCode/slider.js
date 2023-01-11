u
Algebra(2,0,1,()=>{
    // Using Geometric/Clifford algebra with signature (2,0,1), based on the work of Charles Gunn
   var pt    = (x,y)=>1e12-x*1e02+y*1e01,
      line = (a,b,c)=>a*1e1+b*1e2+c*1e0,
      rotor = (biv, t)=>E**(t * biv),
      {E,PI,asin,sqrt, sin, cos, round} = Math;
      
   var buffer = [];
   var trace = (point)=>{
         buffer.push(point);
         if (buffer.length>320) buffer.shift();
         return buffer.map((x,i,a)=>[x,i?a[i-1]:x]);
   }
   
  // a slider for the controls defined using a standard html.
  var bslider_html=`<INPUT STYLE="position:fixed; width: 400px; zDepth:1" TYPE="range" MIN="0" MAX="200" STEP="1" VALUE="80" dlist="steplist">
                   <datalist id="steplist"><option>0</option><option>50</option><option>100<option><option>150</option><option>200</option></datalist>`;

  // we add the html to the document body
  document.body.innerHTML += bslider_html;
  
  // now we find the element that was created.
  var bslider = document.body.querySelector('input');  
  var b =  2.0, oldb = -1;
   var orbit = [], orbitsegs=[], time1=[], time1segs=[], tans=[];
   var s=0, count = 0, num =300, cnum = 300;
   var svg=document.body.appendChild(this.graph(()=>{
       s = count * (PI/num);
       count = count + 1;
       b = bslider.value/40;
       var 
          a = .5,
        m = line(0,1,0), // the rotating line (steering wheel)
        n = line(0,1,1), // the fixed line
        Cr = pt(0,-1),   // their intersection point
        P = pt(0,0),     // the origin (lies on fixed line)
        tt = a*s,
        rr = rotor(Cr, tt),  // rotor around the rotating point
        f = rr >>> n,    // image of the rotating line
        CC = f*m,        // intesection of rotating and fixed line
        logCC = f^m;     // the inters. point of the lines (has length sin(angle))
        if (logCC.e02 < 0) logCC = -logCC;  // interesting when you leave this out!
        var logCCL = logCC.e12 == 0 ? ((!logCC).Length) : asin(logCC.Length),  // find the angle
        logCC= logCC.Normalized,  // normalize the point
        Q = rotor(logCC, b*logCCL) >>> P,  // double the angle
        q = Q&P,
        printB = round(b*10000)/10000;
        
       var fnQ = (aa, bb, ss)=>{
           var rr = rotor(Cr, aa*ss),  // rotor around the rotating point
            f = rr >>> n,    // image of the rotating line
            CC = f*m,        // intesection of rotating and fixed line
            logCC = f^m;     // the inters. point of the lines (has length sin(angle))
            if (logCC.e02 < 0) logCC = -logCC;  // interesting when you leave this out!
            var logCCL = logCC.e12 == 0 ? ((!logCC).Length) : asin(logCC.Length),  // find the angle
            logCC= logCC.Normalized,  // normalize the point
            Q = rotor(logCC, bb*logCCL) >>> P;  // double the angle
            return Q
        };
         
        orbit = [...Array(num)].map((x,k)=> rotor(logCC, oldb*logCCL*k/num) >>> P); //(E**(2*logCCL*(k/num)*logCC)>>>P));
         orbitsegs = orbit.map((x,i,a)=>[x,i?a[i-1]:x]);
    if (oldb != b){
        oldb = b;
          time1 = [...Array(cnum)].map((x,k)=> fnQ(a, b, PI*k/cnum)); //(E**(2*logCCL*(k/num)*logCC)>>>P));
         time1segs = time1.map((x,i,a)=>[x,a[(i-1+cnum)%cnum]]);
         tans = [...Array(cnum)].map((x,k)=> time1[k] & time1[(k+1)%cnum]);
   }
      
      return [0xffffff, "Cardioid: -2(1-cos(t))(e0+sin(t)e1+cos(t)e2)","b="+printB+"", 
      0xffffff, m, "r",
      0x00ffff, CC, "C",f,"f",
      0xffff00,Cr, "O", P, "P",q,"q",0x88ff88, tans[count%cnum],
      0xff00ff, 
      0xff8800, Q, "Q", ...time1segs,
      0x00ff00, ...orbitsegs
           ]},{
        // more render properties for the default items.
        pointRadius:1.0,  // point radius
        lineWidth:2,      // line width
        fontSize:1.5,     // font size
        grid:false,         // grid
        scale:(.4),
    width:window.innerWidth,
    animate:true}));
    svg.style.backgroundColor = "black",
  svg.style.width = svg.style.height = '100%';

})
