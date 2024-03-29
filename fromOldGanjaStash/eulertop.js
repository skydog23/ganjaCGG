// Create a Clifford Algebra with 3,0,1 metric. 
Algebra(3,0,1,()=>{

  // We store position/orientation and linear/angular momentum in a single bivector.
  // This is isomorph to dual quaternion rigid body physics. 
 
  // Helper : points and RK4 integrator.
  var point = (x,y,z)=>!(1e0+x*1e1+y*1e2+z*1e3),
      RK4 = (f,y,h)=>{ var k1=f(y), k2=f(y+0.5*h*k1), k3=f(y+0.5*h*k2), k4=f(y+h*k3); return  y+(h/3)*(k2+k3+(k1+k4)*0.5); };

  // Our box definition, its vertices and faces in body coordinates. Its object.
  var mass  = 1, size  = [0.6,2,1],
      cubeB = [...Array(8)].map((x,i)=>point.apply(this,size.map((s,j)=>s*(((i>>j)%2)-0.5)))),
      cubeF = [[0,1,2],[1,2,3],[4,5,6],[5,6,7],[0,1,4],[4,5,1],[2,6,7],[2,3,7],[0,4,2],[4,2,6],[1,5,7],[1,3,7]].map(x=>x.map(i=>cubeB[i])),
      cube  = {data:cubeF, transform:1+1e0};

  // Inertia tensor and a map to apply it on a momentum bivector. (and the inverse map).
  // see https://en.wikipedia.org/wiki/List_of_moments_of_inertia#List_of_3D_inertia_tensors (diagonals)      
  var I  = 1/12*mass*this.Bivector(size[0]**2+size[1]**2,size[0]**2+size[2]**2,size[1]**2+size[2]**2,12,12,12),
      A  = (x)=>(0e0+x.Dual).map((x,i)=>x*(I[i]||1)),
      Ai = (x)=>(0e0+x).map((x,i)=>x/(I[i]||1)).Dual;
      
  // our physics state. [position/orientation, linear/angular velocity in body frame]
  var State  = [1+0e03, -.0e03-0.35e13-.27e12],
      dState = ([g,v])=>[g*v,Ai(A(v)*v-v*A(v))];

  // Graph the 3D items
  document.body.appendChild(this.graph(()=>{
  // Advance the state one time step of 0.05 and renormalize.  
    State = RK4(dState,State,0.05);
    State[0] = State[0].Normalized;
  // Apply the transformation to the cube.
    cube.transform = State[0];
  // Render the cube    
    return [0xCC00FF,cube,
    0xcccc00, State[0].Log().Grade(2)];
  },{animate:true,gl:true}));
});
