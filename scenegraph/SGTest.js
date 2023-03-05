 notebook();
 
 // Example two column layout
document.head.appendChild(Object.assign(document.createElement('style'),{ innerHTML:`
  .col  { flex: 50%; font-size:85%; padding-left:10px; }
  .col:first-child {border-right:1px solid #DDD; padding-left:0px; padding-right:10px; }
  .cols { display: flex; flex-direction: row; flex-wrap: wrap;  width: 100%; }
  div.c  {text-align:center; font-size:150%; padding: .3em 0em .3em 0em }
  table, th, td {border:1px solid black;}

`}))

let {gr1, gr2, gr3, gr4, pbut} = 
Algebra(3,0,1,()=>{
  
  let pause = false;
  let pbut = button('pause rotate', ()=> {pause = !pause;});

  var point = (x,y,z,w)=> !plane(x,y,z,w),
      plane = (a,b,c,d)=> (a*1e1 + b*1e2 + c * 1e3 + d * 1e0),
      {E, PI, cos, sin} = Math;
  var myprint   = (lab,num)=>lab+num.toFixed(3);
  const rid = 1+0*1e12; 
  
  const setprops = (s)=>{
  s.style.maxHeight ='400px';
	s.style.width = '100%';
	s.style.background = '0xffff00';
	s.style.border  = '1px solid #444';
    return s;
  };

  var tlator = (vec, t=1) => E**(-t*((1e123&vec)*1e0123)/2),
      rotor = (axis, t=1) => E**(t*axis);
      
  var lerp = (t0, t1, n=10)=>{
    let dt = (t1-t0)/(n-1.0);
    return [...Array(n)].map((x,k)=> t0 + (k*dt));
  }

  var motion = (biv, t0, t1, n=10)=> lerp(t0,t1,n).map(x=> E**(biv*x));
  
  var extent1d = (e0, e1, n = 20, t0 = 0, t1 = PI) => { 
     return  lerp(t0, t1, n).map((x) => (cos(x)*e0 + sin(x)*e1));
  };
  
  var SGcopies = (sgc, geom, rotlist) => {
    //let chl=[];
    rotlist.map((x)=>{
      let ch = new SGC();
      ch.geom = geom;
      ch.tform = new SGT(x);
      sgc.addChild(ch);
   });
    //sgc.addChildren(chl);

    return sgc;
  }
  
  class SGNode {
     static count = 0;
     static base = "000000";
     static formatCount = ()=>{
         let num = SGNode.count.toString().length;
         return SGNode.base.substring(1,6-num)+SGNode.count.toString();
     }
    
    name = '';
    constructor() {
       this.name = `${this.constructor.name}-${SGNode.formatCount()}`;
       SGNode.count++;
       console.log("constructing ",SGNode.count," ",this.name);
    }
    getName() {return this.name}
    render(rdr) {}
    reset() {}
  }
  
  class SGCam extends SGNode {
    
  }
  class SGT extends SGNode {
    constructor(rotor) {
      super();
      this.rotor = rotor;
    }
    render(rdr) { super.render(rdr); rdr.pushTF(this.rotor);}
    postrender() { rdr.popTF(); }
    reset() {this.rotor = rid;}
  }
  
  class SGG extends SGNode {
    
  }
  class SGGEls extends SGG {
    ellist = [];
    isFlat = true;
    constructor(ellist, b = true) {
      super();
      this.ellist = ellist;
      this.isFlat = b;
    }
    render(rdr) { 
      super.render(rdr); 
      let currTF = rdr.currTF();
      rdr.addEls(this.ellist.map(x=>currTF>>>x), this.isFlat); 
    }
    reset() {this.ellist = [];}
  }
  class SGTriSet extends SGG {
    pts = [];
    ind = [];
    constructor(pts, ind) {
      super();
      this.pts = pts;
      this.ind = ind;
      this.isFlat = true;
    }
    render(rdr) { 
      rdr.addEls({transform: rdr.currTF(), data: this.pts, idx: this.ind}); 
    }
    reset() {this.ellist = [];}
  }
  
  class SGC extends SGNode {
     color = 0xff0000;
     children = [];
     camera = [];
     tform = new SGT(rid);
     addChild(c) { this.children.push(c); }
     addChildren(c) { c.map(x=>this.children.push(x)); }
     render(rdr) { 
       super.render(rdr); 
       rdr.addEls([this.color]);
       if (this.tform) this.tform.render(rdr);
       if (this.geom) this.geom.render(rdr);
//       console.log("rendering ",this.name, "currTf = ",rdr.currTF())
       if (this.children.length) this.children.forEach( x => x.render(rdr));
       if (this.tform) this.tform.postrender();
     }
     reset() {if (this.tform) this.tform.reset(); if (this.geom) this.geom.reset(); this.children = []; }
  }
  
  class Renderer {
    root = new SGC();
    dllist = [];
    tfstack = [rid];
    render() {this.dllist=[]; this.tfstack=[rid]; this.root.render(this);}
    
    addEls(els, isFlat=true) {this.dllist = this.dllist.concat(isFlat ? els : [els]);}
    
    pushTF(tf) {this.tfstack.push(this.tfstack[this.tfstack.length-1]*tf);}
    popTF() {this.tfstack.pop();}
    currTF() {return this.tfstack[this.tfstack.length-1];}
  }
  

   var A = point(0,0,0,1),
      B = point(0,1,0,0),
      a = plane(1,0,0,0),
      b = plane(0,0,1,0),
      square = [point(1,1,0,1), point(-1,1,0,1), point(-1,-1,0,1), point(1,-1,0,1)],
      m = A&B,
      n = a^b,
      axis = (A&point(1,-1,-1,1)).Normalized,
      view = E**((PI/6)*axis),
      rot = (t)=>E**(t*m);
 
//  let dlist = (sgg) => 
    let [c1, c2, c3, c4] = [...Array(4)].map(x=>new SGC());
    c1.name = "c1";
    c2.name = "c2";
    c3.name = "c3";
    c4.name = "c4";
    let rotlist = motion(m, 0, PI, 10);
    let square2 = new SGTriSet(square, [0,1,2,2,3,0]);
    SGcopies(c1, square2, rotlist );
    c1.color = 0xff00;
    c2.geom =  new SGGEls([A&B]); 
    c2.color = 0xff;
    
    c3.geom =  new SGGEls(extent1d(A,B,30)); 
//    c2.tform = new SGT(tlator(point(1,0,0,0)));
    
    let rdr = new Renderer(),
    root = new SGC(),
    world = new SGC();
    rdr.root = root;
    root.name="root";
    root.addChild(world);
    world.addChildren([c1,c2]);
    root.color = 0xff0000;
    root.tform = new SGT(view);
    world.tform = new SGT(rid);
    rdr.render();
//    let dlist1 = rdr.dllist;
    
    let rdr2 = new Renderer();
    root = new SGC(),
    world = new SGC();
    rdr2.root = root;
    root.tform = new SGT(view);
    world.tform = new SGT(rid);
    root.addChild(world);
    world.addChildren([c2,c3]);
    rdr2.render();
//    let dlist2 = rdr2.dllist;
    
    // console.log(rotlist);
    // console.log(rdr);
    let rdr3 = new Renderer();
    rdr3.dllist= [0xffffff, point(0,0,0,1), 0x0, "???"];
    let rdr4 = new Renderer();
    rdr4.dllist = [0xff0000, a^b, 0xff, a, "a", b, "b"];

  let graphfn = (rendr, rerender=true)=>[()=>{
//    console.log("render = ",rendr.dllist," ",rerender);
    if (rerender && !pause) {
      let tt = (performance.now()/1500);
      rendr.root.children[0].tform.rotor = E**((tt)*m);
      rendr.render();
    }
   return [...rendr.dllist,
  ]},{
    gl:1, animate:1,
    grid        : false, // Display a grid
    lineWidth   : 3,    // Custom lineWidth (default=1)
  }];
  
  let gr2 = this.graph(...graphfn(rdr2,true));
  let gr1 = this.graph(...graphfn(rdr,true));
  let gr3 = this.graph(...graphfn(rdr3, false));
  let gr4 = this.graph(...graphfn(rdr4, false));

  [gr1,gr2,gr3,gr4].map(x=>setprops(x));
	return {gr1, gr2, gr3, gr4, pbut};
	
});

md`${embed(pbut)}

<div class="c"> $\wedge$ </div>
<DIV CLASS="cols">
<DIV CLASS="col">
<div class="c"> Plane-based algebra </div>

\includegraphics{${embed(gr1)}}


</DIV>

<DIV CLASS="col">
<div class="c"> Point-based algebra </div>
\includegraphics{${embed(gr2)}}

</DIV>
</DIV>
<div class="c"> $\vee$ </div>
<DIV CLASS="cols">
<DIV CLASS="col">

\includegraphics{${embed(gr3)}}


</DIV>

<DIV CLASS="col">
\includegraphics{${embed(gr4)}}

</DIV>
</DIV>




`


