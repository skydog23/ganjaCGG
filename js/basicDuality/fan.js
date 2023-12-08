var hue=Algebra(3).inline((h)=>{
  var c=(Math.E**(-h*3*(1e12+1e13+1e23).Normalized) >>> 1e1);
  c = c.map(x=>Math.max(0,Math.min(1,Math.abs(x)))*255|0);
  return c.e1*256*256+c.e2*256+c.e3;
});

Algebra(2,0,1,()=>{
  // standard point definition
  var point = (x,y)=>1e12+x*1e02+y*1e01;
  var line = (x,y,z)=>x*1e1+y*1e2+z*1e0;
  
  // define two points for our segment
//   var a = point(0,-1),
//       b = point(1, .5)
  var a = line(0,1,0),
      b = line(1,.5,0)
      
  // first we'll collect the path points at regular distances
  var path=[],i;
  
  // we'll just do it for each side seperately
  var nr = 20;
  for (i=0;i<nr;i++) path.push( 0x00ffff, a*(1-i/nr) + b*(i/nr) );
  for (i=0;i<nr;i++) path.push( 0x00ffff, b*(1-i/nr) + a*(i/nr) );
 
  // Grab the current time, and start an animated graph
  var startTime = performance.now();
  var canvas=document.body.appendChild(this.graph(
      ()=>{
         // time in seconds since start 
         var time = (performance.now() - startTime)/2000; 
         
         // there's three parts ..
         var partNr = Math.floor(time)%2,
             partTime = time%1,
             cycletime = time%2;
             
         // select start and end point depending on partNr
         var start = [a,b][partNr],
             stop  = [b,a][partNr];
       
         // calculate current position of point
         var cur = start * (1-partTime) + stop*partTime;
         
         // return the elements we want graphed
         return [
            0xFF0000,()=>a^b, //a&b,
            0x00FFFF, a, "a", b, "b", ...path.slice(partNr*2*nr, partNr*2*nr + partTime*2*nr),
               0xFFFFFF, cur,
          //  ...path.slice(0,cycletime*nr*2).map((x,i)=>i%2?!x:x),
            //0xFFFFFF, !cur,
         ]
      },      
      {animate:true,pointRadius:1,lineWidth:2}
  ))
  canvas.style.backgroundColor = "black"
})
