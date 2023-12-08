var hue=Algebra(3).inline((h)=>{
  var c=(Math.E**(-h*3*(1e12+1e13+1e23).Normalized) >>> 1e1);
  c = c.map(x=>Math.max(0,Math.min(1,Math.abs(x)))*255|0);
  return c.e1*256*256+c.e2*256+c.e3;
});

Algebra(2,0,1,()=>{
  // standard point definition
  var point = (x,y)=>1e12+x*1e02+y*1e01;
  
  // define three points for our triangle
  var a = point(0,-1.41),
      b = Math.E**(Math.PI/3*1e12) >>> a,
      c = Math.E**(Math.PI/3*2e12) >>> a;
      
  // first we'll collect the path points at regular distances
  var path=[],i;
  
  // we'll just do it for each side seperately
  var nr = 20;
  for (i=0;i<nr;i++) path.push( hue(i/nr/3+0/3), a*(1-i/nr) + b*(i/nr) );
  for (i=0;i<nr;i++) path.push( hue(i/nr/3+1/3), b*(1-i/nr) + c*(i/nr) );
  for (i=0;i<nr;i++) path.push( hue(i/nr/3+2/3), c*(1-i/nr) + a*(i/nr) );
  
  // Grab the current time, and start an animated graph
  var startTime = performance.now();
  var canvas=document.body.appendChild(this.graph(
      ()=>{
         // time in seconds since start 
         var time = (performance.now() - startTime)/2000; 
         
         // there's three parts ..
         var partNr = Math.floor(time)%3,
             partTime = time%1,
             cycletime = time%3;
             
         // select start and end point depending on partNr
         var start = [a,b,c][partNr],
             stop  = [b,c,a][partNr];
       
         // calculate current position of point
         var cur = start * (1-partTime) + stop*partTime;
         
         // return the elements we want graphed
         return [
            //...path.slice(0,cycletime*nr*2),
            //0xFFFFFF, cur,
            ...path.slice(0,cycletime*nr*2).map((x,i)=>i%2?!x:x),
            0xFFFFFF, !cur,
         ]
      },      
      {animate:true,pointRadius:1,lineWidth:2}
  ))
  canvas.style.backgroundColor = "black"
})
