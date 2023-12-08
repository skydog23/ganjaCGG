// Constrained motion in 2D euclidean space
// A triangle with two vertices running along perpendicular tracks.
// Original problem from Peter Hagedorn, Technische Mechanik, Band 3, (Dynamik), Exercise 8.1.3
// 2022 Charlie Gunn
notebook()

Algebra(2,0,1,()=>{
  
   class Collector {
    constructor(length) {
      this.length = length;
    }
    count = 0;
    snake = new Array(length);
    collect(obj) { this.snake[this.count%this.length] = obj; this.count++; this.count = this.count%this.length;}
    getSnake() {return this.snake;}
    getCount() {return this.count;}
    reset() {this.count = 0; this.snake = new Array(length);}
  };
  
  var rectangle = (C, w,h)=>[C + point(w/2, h/2,0), C + point(-w/2, h/2,0), C + point(-w/2, -h/2,0), C + point(w/2, -h/2,0)];
  var paused = false;
  var but = button('pause', ()=>paused = !paused);
  var showHistory = false;
  var but2 = button('show history', ()=>{showHistory = !showHistory; 
                                    if (!showHistory) { intenscoll.reset(); momcoll.reset();}});
  var bwlerp = (t) => (floor(t*255) * 65536 + floor((1-t)*255));
  var lerp = (imin,imax,omin,omax,t)=> { let id = imax-imin, od = omax-omin; if (t < imin) t = imin; if (t>imax) t = imax; return omin + (((t-imin)/id)*od);}
  // standard point definition
  var point = (x,y,z)=>z*1e12-x*1e02+y*1e01;  // basis vector should be e20 but it isn't ...
  var {floor, sqrt, cos, sin, PI} = Math;
  // 4th order Runge-Kutta solver, courtesy of Steven de Keninck
  var RK4 = (f,y,h)=>{ var k1=f(y), k2=f(y+0.5*h*k1), k3=f(y+0.5*h*k2), k4=f(y+h*k3); return  y+(h/3)*(k2+k3+(k1+k4)*0.5); };
  
  var num = 100;
  // triangle
  var [A,B,C] = [point(0,0,1), point(1,0,1), point(.5, sqrt(3)/2,1)];
  // orbit of velocity state and of center of rotation
  var velc =  [...Array(2*num)].map((x,i)=>point(-cos(2*PI*(i/(2*num))), sin(2*PI*(i/(2*num))),1));
  var rotc =  [...Array(num)].map((x,i)=>point(.5-.5*cos(2*PI*(i/num)), .5*sin(2*PI*(i/num)),1));
  var lambda = .5,    // controls how the speed of rotation of R in 
    V=-lambda*B,      // initial instantaneous center of rotation (ICR)
    R,                // center of rotation (CR) of motion
    Vb,               // instantaneous center of rotation (ICR) in body coordinate system
    rotor = 1+0*B,    // start at the identity; the construction 0*B guarantees that it's an algebra element.
    // the derivatives for the solver    
    // we have a second order linear ODE.  The functions to integrate are:
    // [g, v]   where g is a path in the Lie group (rotor group)
    //          and v is the velocity in space (a bivector == a point == element of Lie algebra of the rotor group)
    // [g', v'] = [g*v, (v*1e12).Grade(2)]  
    // first term ollows from the definition of velocity in space v = g^{-1}g'
    // second part says v' is v rotated 90 degrees CCW 
    // (the geometric product V*P of two points is the normal direction to their joining line)
    dState = ([m,v])=>[m*v,(v*1e12).Grade(2)];  

  var Ctri = (A+B)/2,    // make it a bar
      tlate = Ctri-A,
      tlateP = 1e12*tlate,
      body2tri = 1-.5*tlateP,
      Mb = point(1,0,0),M,
      momcoll = new Collector(400),
      intenscoll = new Collector(400);
  var mass = 5;
  var trotor=rotor; // temporary variable 
  var integrate = true;  // two methods for generating the animation: solve equation of motion, or geometrically
   
   document.body.appendChild(this.graph(
      ()=>{ 
        if (!paused) {
        if (integrate) { 
          let 
            State = RK4(dState,[trotor,V],0.0157);
          // To get the right velocity, lambda should be .5
          // (This ensures that the triangle rotates exactly once before returning to its position)
          [trotor,V] = [State[0].Normalized, lambda*State[1].Normalized];
          // rotation center
          R = trotor.Grade(2).Normalized;
          // In order for the integrated rotation to have proper spin, 
          // have to take the inverse of the rotor. Why??
          rotor = trotor.Reverse;
	       } 
        else { // purely geometric treatment
          let t=4*Date.now()/50000;
          V = point(cos(2*PI*t), sin(2*PI*t), 1); // see accessory geometry below for an explanation
          R = (B+V)/2; //point(-.5-.5*cos(2*PI*(t)), .5*sin(2*PI*(t)),1);
          // here with the minus sign we get the reversal 
          // that we have to do by hand with the integration
          rotor = sin((PI)*t)*R;
          rotor.s = cos((PI)*t);
        }
        }
        Vb = rotor.Reverse>>>V;  // velocity state in the body is obtained by transforming by the inverse of the motion
        // calculate the momentum in the body
        var Vt = body2tri>>>Vb;
        var Mt = !Vt;
        Mt.e2 *= mass;
        Mt.e1 *= mass;
        Mb = body2tri.Reverse>>>Mt;
        var strength = sqrt((Mb*Mb).s);
        var mcol = bwlerp(lerp(0,3,0,1,strength));
    
        //console.log("strength = ",strength);
        // compute accessory geometry
        var [tA, tB, tC] = [A,B,C].map((x)=>rotor>>>x),   // transformed triangle
        a = tA & A,       // joining lines: should be the x- and y-axis
        b = tB & B,
        pa = (a<<tA).Normalized,  // perpendiculars to a and b at the transformed vertices, given by inner product of point and line.
        pb = (b<<tB).Normalized,  // pa^pb = V: ICR lies on perpendicular to x-axis at B', similar for y-axis and A'
        ma = (a<<(A+tA)).Normalized,  // perpendiculars to a and b at the midpoints of AA' and BB'
        mb = (b<<(B+tB)).Normalized;  // ma^mb = R  center of rotation is intersection of perp bis of AA' and of BB'
        M = rotor>>>Mb;
        if (!paused) {
          momcoll.collect([mcol,M]);
          // var graphpt = point(lerp(0,400,-1,1,intenscoll.getCount()), 
          // lerp(0,4,0,1,strength),          1);
          // intenscoll.collect(graphpt);
        }
        var momhistory = [];
        if (showHistory) momhistory = [
            ...momcoll.getSnake().flat()]; 
//            0x0, ...intenscoll.getSnake(),
//            0xffff00, graphpt, M, rotor>>>Mb, "m", rotor>>>(Mb|Vb)];
        else momhistory = [mcol,  rotor>>>Mb, "m", rotor>>>(Mb|Vb)];
        
        // calculate
        //console.log("graph = ",graphpt);
        // return a list of the geometry to be displayed.  The numbers are RGB colors, strings are labels.
        return [0x0, "Double sliding motion of a bar using 2D PGA", 
            "A is constrained to y-axis, B to the x-axis.",
            "V is the instantaneous center of rotation (ICR) in the world frame.",
            "Vb is the ICR in the body frame.",
            "Hence the red circle is the herpolhode, the cyan is the polhode.",
            "R is the center of rotation of the motion.",
            "m is the momentum line in the world frame",
             ...momhistory,
            0x00ffff, rectangle(Ctri,1.1,.1), //[A,B,C],
            0xff8800, A, "A",tA, "A'", a,  ma,
            0x0088ff, B, "B",tB, "B'", b,  mb,
//            0x008844, C, "C", tC, "C'",
            0x888888, rectangle(Ctri,1.1,.1).map((x)=>rotor>>>x), //[tA,tB,tC], 
            0xff0000, ...velc,
            0x00aaaa, ...rotc,
            0x0, R,"R", V,"V", [B,V],Vb,"Vb",
            0xff0000, pa, pb,
            // 0xaa00aa, [A,B,C].map((x)=>body2tri>>>x),
            // 0xaa00aa,  rotor>>>Mb, "m", //Mb, "Mb", ...collector.getSnake()
            0xff0000, rotor>>>Ctri, "C",  
           
        ]
      },      
      {animate:true,pointRadius:.3,lineWidth:2, grid:true}
  ))
  // canvas.style.backgroundColor = "white"
})
