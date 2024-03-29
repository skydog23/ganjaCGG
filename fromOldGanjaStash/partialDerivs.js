// Create a Clifford Algebra with 3,0,1 metric. 
Algebra(3,0,1,()=>{ 
    
  // Automatic differentiation allows you to easily evaluate derivatives of arbitrary polynomial functions.
  // Unlike numerical methods, using dual numbers for this purpose is artefact free and enables machine-level
  // precision. The degenerate metric of the PGA framework embeds with e01 and e02 two ideal (;)) elements to use
  // for the calculation of partial derivatives. We demonstrate by graphing a two variable function and both
  // its partial derivatives. 
    
  // range and point helpers and our camera.
  var range=(start,stop,step)=>{ var ret=[]; for (var i=start; i<stop; i+=(step||1)) ret.push(i); return ret; },
      point = (x,y,z)=>1e123-x*1e012+y*1e013+z*1e023,
      camera=0e0, step=0.25;
  
  // To display the function value we allocate some points.
  var points = [].concat.apply([], range(-1,1,step).map(x=>range(-1,1,step).map(y=>point(x,0,y))))
  
  // For the partial x and y derivatives we will display them with edges (arrays of two points)
  var dy = [].concat.apply([], range(-1,1,step).map(x=>range(-1,1,step).map(y=>[point(x,0,y),point(x,0,y)])))
  var dx = [].concat.apply([], range(-1,1,step).map(x=>range(-1,1,step).map(y=>[point(x,0,y),point(x,0,y)])))

  // We pre-create our render array and will just update positions in our loop.
  var render = [].concat( 0x444444,"f(x,y)=t*(x^3)/2 - 5t*(y^2)/2 + 1",0xCC4444,"f(x,y)/dx",0x4444CC,"f(x,y)/dy", 0x444444,points,0xFF0000,dx,0x0000FF,dy);

  // The function we are graphing. (0.5*x^3 - 0.5*y^2 + 1) - feel free to change !
  var f = (x,y,time)=>0.5*Math.sin(time*5)*x*x*x-0.5*Math.cos(time)*y*y+1;
  
  // Graph the 3D items
  document.body.appendChild(this.graph(()=>{
    // A time parameter, and our camera rotation.
    var time=performance.now()/4000;    
    camera.set(Math.cos(time)+Math.sin(time)*1e13);

    // Evaluate over the field and update our points.
    for (var i=0,x=-1; x<1; x+=step) for (var y=-1; y<1; i++,y+=step) {
    // Evaluate the function for current x,y and time. Add in e01 and e02 to x and y respectively to
    // enable the automatic differentiation. (the 1 comes from differentiating 'x' or 'y' ) 
       var r = f(x + 1e01, y + 1e02, time);
    
    // r.s   = f(x,y,t)    = the function value
    // r.e01 = f'x(x,y,t)  = how function value changes when just x changes
    // r.e02 = f'y(x,y,t)  = how function value changes when just y changes
       
    // Update the positions of our points and edges.
       points[i].e013 = dy[i][0].e013 = dx[i][0].e013 = r.s; // update points and edge starting points.
       dx[i][1].set(points[i]-0.15e013*r.e01+0.15e012);      // update edge endpoint for f/dx
       dy[i][1].set(points[i]+0.15e013*r.e02+0.15e023);      // update edge endpoint for f/dy
    }     
    return render;
  },{animate:true,camera})); 
  
});
