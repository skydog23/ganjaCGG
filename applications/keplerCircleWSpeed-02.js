
Algebra(2,0,1,()=>{
  
    class Collector {
    constructor(length, samplerate) {
      this.length = length;
      this.samplerate = samplerate;
    }
    count = 0;
    snake = new Array(length);
    collect(obj) { if (((this.count) % this.samplerate) == 0) this.snake[((this.count)/this.samplerate)%this.length] = obj; this.count++;}
    getSnake() {return this.snake;}
    getCount() {return this.count;}
  };

  var paused = false;
  var pbut = button('pause', ()=>paused = !paused);
  var dodu = true;
//  var dbut = button('dual', ()=>dodu = !dodu);

  // standard point definition
  var point = (x,y,z)=>z*1e12-x*1e02+y*1e01;
  var line = (x,y,z)=>x*1e1+y*1e2+z*1e0;
  var lerp = (a,b,t)=> (1-t)*a + t*b;
  var myprint   = (lab,num)=>lab+num.toFixed(3);
  var {floor, sqrt, cos, sin, PI} = Math;
  var RK4 = (f,y,h)=>{ var k1=f(y), k2=f(y+0.5*h*k1), k3=f(y+0.5*h*k2), k4=f(y+h*k3); return  y+(h/3)*(k2+k3+(k1+k4)*0.5); };
  var euler = (f,y,h)=>{  return  y+h*f(y); };
  
  var num = 100;
  var O = point(0,0,1);
  var o = line(1,0,100000);
  var velc =  [...Array(2*num)].map((x,i)=>point(-cos(2*PI*(i/(2*num))), sin(2*PI*(i/(2*num))),1));
  var lambda = 0.8, str = .5, vstr = 1.0;
  var ctr = point(lambda,0,1),  dv=point(0,1,0);
  var rotor = 1+0*ctr, 
    vel = ctr, 
    f2 = line((2* lambda/(1-lambda*lambda)), 0, 1),  // preimage of second focal point
    P0 = ctr + point(1,0,0), P=P0, p=!P,
    cline = line(1,0,(1/lambda)-lambda),
    pointcoll = new Collector(80, 5),
    velcoll = new Collector(80,5);
  var dState, count = 0, res, tan = ((vel&P)*1e012)&P, otan = tan;
  // Graph the 3D items
  // document.body.appendChild(this.graph(()=>{
  document.body.appendChild(this.graph(
      ()=>{
        // calculate vstrength by considering this curve as an ellipse in counterspace
        // the point of this dual ellipse is obtained by dualizing the tangent line to the space curve
        var Pell = (!tan).Normalized;
        // d is the euclidean length of this vector
        var d = (!Pell).Length;
        // a global scaling variable
        var globalStr = 2;
        vstr = globalStr/(d*d) ; //!= 0 ? 1.0/d : 1.0;
          dv = ([rotor,vel])=>[vel*rotor,0];        // the velocity is constant
          if (!paused) {
            res = RK4(dv,[rotor,vstr*vel],.0157);
            rotor = res[0].Normalized;
  //         vel = res[1];
            P = (rotor>>>P0).Normalized; //!((!(rotor>>>P0)).Normalized);
            pointcoll.collect(P);
          }
          otan = tan;

          p = (!P).Normalized;
          var Tan =  (vel&P)*1e012;    // velocity vector: join the point to the velocity state and polarize
              tan = P&Tan;           // weighted tangent line
          var   Acc = Tan*ctr,         //  acceleration vector at P (rotate T by 90 degrees)
              acc = P&Acc,            //  weighted line
              mP =   ctr>>>P,       // reflect P in ctr
              mtan = ctr>>>tan,     // opposite tangent
              m =   ctr&Tan;  
          var dPell = (!acc).Normalized,
          vvel = (P&1e12);
        var sweptTri = dodu ? [1e0, !Pell, !(Pell + !(P&1e12))] : [1e12,Pell,Pell+!(P&1e12)];
          if (!paused) {
              var area = (globalStr/2)*(1e12 & Pell & !(P & 1e12)).s;
              velcoll.collect([1e12,!(1e0+1e12*vvel)]);
          }
          var velco =  velcoll.getSnake();
      return [0x0, "Integrate a circle",
            myprint("Speed = ",vstr),
            myprint("area =",area),
            0x0, ctr,"O", 1e12, "Z", cline, "z",
            0xffaa88, ...pointcoll.getSnake(),
            0x0044aa, ...velco,
            0xff0000, P,"P", mP, "-P",
            0x0000ff, acc, "a", Acc, "A", vel, "V",
            0x00aa66, tan,"t", Tan, "T", mtan, "-t", 0xff00ff, m,
            0x008800, o, "o", otan,"ot",
//            0x000000, (dodu ? [1e0, tan, P&1e12] : [1e12,Pell,!(P&1e12)]),
            0x000000, ...[1e0, !Pell, !(Pell + !(P&1e12))],
            // 0x0, trotor>>>O,"z",
            // 0x0, trotor>>>lai,"Z",
            // 0x0, trotor>>>vel,"v",
            // 0x0, trotor>>>acc,"a",
            // 0xff0000, ...(velc.map((x)=>trotor>>>x)),
        ]
      },      
      {animate:true,pointRadius:.3,lineWidth:1, grid:true, dual:dodu}
  ))
  // canvas.style.backgroundColor = "white"
})
