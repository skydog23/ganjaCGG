// Miniature Raytracer - following "Paraxial Optics for PGA" by Ted Corcovilos and Katelyn Spadavecchia  

// in 2D PGA
var app = Algebra(2,0,1).inline(helpers=>{

  const {PI,E,abs} = Math;
  const point = (x=0,y=0)=>!(1e0 + x*1e1 + y*1e2);
  const numRays = 15;
  var render = [0], renderLength = 1, sources = [], elements = [];
  
  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  // Add a light source.
  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  const addLight = ()=>{
    var light = {
          position : point(-1.5,0),
          handle   : point(-1,0),
          rays     : function(){ 
              this.handle.set( this.position + (0.5*((this.handle-this.position).Dual.Normalized.Dual)) );
              return [[(this.position & this.handle).Normalized, this.position]] 
          },
          render   : function(){ return [
              0x664444, '<G stroke-width=0.06>', [this.position, this.handle], '</G>', 0xFFFFFF, this.position,  0xFF0000, this.handle, 
          ]},
        }
    sources.push(light); render.splice(renderLength,1000,...light.render()); renderLength = render.length;  
  }
  
  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  // Add a light bundle.
  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  const addLightBundle = ()=>{
    var light = {
          position : point(-1.5,0),
          handle   : point(-1,0),
          rays     : function(){ 
              this.handle.set( this.position + (0.5*((this.handle-this.position).Dual.Normalized.Dual)) );
              var angle = this.slider.value*1;
              return [...Array(numRays)].map((x,i)=>[
                        Math.E**(this.position*(i-numRays/2)*2*angle/numRays)>>>(this.position & this.handle).Normalized, 
                        this.position
                     ]); 
          },
          render   : function(){ 
              this.slider = Object.assign(document.createElement('input'),
                            {className:'extra',type:'range',min:0,max:Math.PI/10,step:0.001,value:0.1});
              document.getElementById('UI').appendChild(this.slider);
              return [
                0xAA4444, '<G stroke-width=0.06>', [this.position, this.handle], '</G>', 
                0xFFFFFF, this.position,  0xFF0000, this.handle, 
              ]
          },
        }
    sources.push(light); render.splice(renderLength,1000,...light.render()); renderLength = render.length;  
  }
  
  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  // Add a planar mirror.
  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  const addMirrorPlane = ()=>{
    var mirror = {
          point1    : point (1,0.5),
          point2    : point (1.2,-0.5),
          intersect : function([ray,point]) {
            // The mirror line.  
            var mirror    = (this.point1 & this.point2);
            // Intersect ray with mirror line.
            var ipoint    = (ray ^ mirror).Normalized;
            ipoint = ipoint*ipoint.e12; // make sure its positive.
            // The center of the mirror
            var midpoint  = (this.point1 + this.point2)/2;
            // The length of the mirror
            var length    = (this.point1 & this.point2).Length;
            // See if we're less then half the length away from the midpoint
            var intersect = (midpoint & ipoint).Length < length/2;
            // Make sure the ray has the same direction as the ray origin to our intersection point
            var sameside  = (ray|(point&ipoint)).s > 0;
            // If so, return the distance, intersection point and new ray
            return [ intersect&&sameside, (point & ipoint).Length, ipoint, mirror >>> ray ];
          },
          render    : function() { return [
            0x0000FF, this.point1, this.point2, '<G stroke-width="0.02">', [this.point1,this.point2], '</G>',
          ]}
        }
    elements.push(mirror); render.splice(renderLength,1000,...mirror.render()); renderLength = render.length;    
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  // Add a circle mirror.
  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  const circle = (p, radius, subd=64, range=1, ofset=0)=>[...Array(subd)].map((x,i)=>E**(((i-31.5)*range)/(subd)*PI*p + (ofset/(subd))*PI*p)>>>(p+radius*!1e1));
  const addMirrorSphere = ()=>{
    var mirror = {
          point1    : point (0,-0.7),
          point2    : point (0,-0.2),
          intersect : function([ray,point]) {
            // The radius between the two dragable points.  
            var radius    = (this.point1 & this.point2).Length;
            // The distance of the center to the ray.
            var dist      = Math.abs(!(this.point1 ^ ray));
            // See if that is within the radius.
            var intersect = dist < radius;
            // Temporary point where the ray cuts the line orthogonal to the ray, through the point.
            var temp1     = ((ray * this.point1) ^ ray).Normalized;
            temp1 = temp1 * temp1.e12;
            // The intersection point, using pythagoras and a translator
            var i_point   = (1-abs(radius**2 - dist**2)**.5*ray*.5e012) >>> temp1;
            // The normal ray from the center to the intersection point
            var n_ray     = (i_point & this.point1).Normalized;
            // The outputray is the ray reflected along this normal
            var out_ray   = -n_ray * ray * n_ray;
            // Check if the sphere is cutting the ray past the origin.
            var sameside  = (ray | (point&i_point)).s > 0;  
            // Return distance, intersection point and new ray.
            return [ intersect&&sameside, (point & i_point).Length, i_point, out_ray ];
          },
          render    : function() { return [
            0x0000FF, this.point1, this.point2, ()=>circle(this.point1, (this.point1 & this.point2).Length)    
          ]}
        }
    elements.push(mirror); render.splice(renderLength,1000,...mirror.render()); renderLength = render.length;    
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  // Add a thin lens.
  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  const addThinLens = ()=>{
    var lens = {
          point1    : point (0.8,0.6),
          point2    : point (0.8,-0.4),
          point3    : point (0.5,0),
          lens      : ()=>(lens.point1&lens.point2).Normalized,
          backplane : ()=>(1 - (lens.point3 & ( (lens.lens|lens.point3)*lens.lens ))*.5e012) >>> lens.lens,
          intersect : function([ray,point]) {
            // The plane of the lens
            var lens    = (this.point1 & this.point2);
            // The intersection point with the ray
            var p         = (lens ^ ray).Normalized;
            p = p*p.e12;
            // The midpoint, length, and intersection check. (includes 'front ray test')
            var midpoint  = (this.point1 + this.point2)/2;
            var length    = (this.point1 & this.point2).Length;
            // Figure out if the mirrors is hit in its segment, with the 'forward' ray
            var intersect = (lens|point|ray).s * (point&lens).s > 0 && (midpoint & p).Length < length/2;
            // Now figure out if the focal point is on the front as seen from the ray.
            var focalfront = (this.lens^this.point3).e012 * (this.lens^point).e012 > 0;
            // Also figure out the focal lenth (signed!)
            var focalpositive = (this.lens^this.point3).e012 > 0; 
            if (intersect) {
               var p3 = focalfront==focalpositive ? this.point3 : this.lens >>> this.point3;
               var bp = focalfront==focalpositive ? this.backplane : this.lens >>> this.backplane;
               var r_through_f = (ray|p3)*p3;
               var out_ray   = (focalfront?1:-1) * p & ((r_through_f ^ lens | lens) ^ bp).Normalized;
            };
            return [ intersect, (point & p).Length, p, out_ray ];
          },
          render    : function() { return [
            0x008800, '<G stroke-width="0.003" stroke-opacity=0.5>', this.backplane, '</G>', this.point1, this.point2, this.point3, 
            ()=>"F="+(this.point3^this.lens).e012.toFixed(2), '<G stroke-width="0.02">', [this.point1,this.point2], '</G>'    
          ]}
        }
    elements.push(lens); render.splice(renderLength,1000,...lens.render()); renderLength = render.length;    
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  // Add a thick lens.
  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  const addThickLens = ()=>{
    var lens = {
          point1    : point (-0.25,0),
          point2    : point (0.29,0),
          intersect : function([ray,point,inside=false]) {
            // The radius between the two dragable points.  
            var radius    = (this.point1 & this.point2).Length;
            // The distance of the center to the ray.
            var dist      = Math.abs(!(this.point1.Normalized ^ ray.Normalized));
            var dist2     = Math.abs(!(this.point2.Normalized ^ ray.Normalized));
            // See if that is within the radius.
            var intersect = (dist < radius) && (dist2 < radius);
            // Temporary point where the ray cuts the line orthogonal to the ray, through the point.
            var temp1     = ((ray * this.point1) ^ ray).Normalized;
            temp1 = temp1 * temp1.e12;
            // And for the other circle..
            var temp2     = ((ray * this.point2) ^ ray).Normalized;
            temp2 = temp2 * temp2.e12;
            // The intersection point, using pythagoras and a translator
            var i_point    = (1+(inside?1:-1)*abs(radius**2 - dist**2)**.5*ray*.5e012) >>> temp1;
            var i_point2   = (1+(inside?1:-1)*abs(radius**2 - dist2**2)**.5*ray*.5e012) >>> temp2;
            var [s1,s2] = [((i_point&point)|ray).s, ((i_point2&point)|ray).s ];
            var [l1,l2] = [s1<0?(i_point&point).Length:-1,s2<0?(i_point2&point).Length:-1];
            if (inside) {
              var ip         = l1<=l2?i_point:i_point2;
              var cp         = l1<=l2?this.point1:this.point2;
            } else {
              var ip         = l1>=l2?i_point:i_point2;
              var cp         = l1>=l2?this.point1:this.point2;
            }
            intersect = ((ip & this.point1).Length < radius+0.001) && ((ip&this.point2).Length < radius+0.001);
            if (intersect) {
                // The interface tangent line at the intersection
                var I = cp&ip|ip;
                // Travel distance n1 back on the ray, call this point 'A'
                var in_n = 1*(parseFloat(this.edit.value)||1);
                var n1 = inside?in_n:1.0, n2 = inside?1.0:in_n;
                var A  = (1-n1*ray*.5e012) >>> ip;
                // Construct line 'p' by projecting on the interface.      
                var p = (I|A).Normalized
                // Measure the distance from 'S' to 'p'
                var S_to_p = Math.abs(!(ip ^ p)); 
                // This gives us the distance from the interface to point 'B'
                var I_to_B = (n2**2 - S_to_p**2);
                // Total internal reflection.
                if (I_to_B<0) return [ true, (point & ip).Length, ip, I*ip >>> -ray, inside===true];
                // Now construct B by moving along p.
                var B = (1+(inside?1:-1)*I_to_B**.5*p*.5e012) >>> (p ^ I);
                return [ true, (point & ip).Length, ip, -B&ip, inside===false ];
            }
            // Return distance, intersection point and new ray.
            return [ false, (point & ip).Length, ip ];
          },
          render    : function() { 
            this.edit = document.getElementById('UI').appendChild(helpers.input('n2',1.47));  
            return [
            ()=>this.edit.value<1?0xFF0000:0x0000FF, this.point1, this.point2,0x0FFFF, 
            ()=>'<G stroke="'+(this.edit.value<1?'red':'blue')+'" fill-opacity="0.3">',
              ()=>[...(1+(this.point1&this.point2).Normalized*(1e2|this.point1)).Normalized >>> circle(this.point1, (this.point1 & this.point2).Length,64,0.339,16 ), 
              ...(1+(this.point1&this.point2).Normalized*(1e2|this.point2)).Normalized >>> circle(this.point2, (this.point1 & this.point2).Length,64,0.339,-16 )], 
            '</G>'  
          ]}
        }
    elements.push(lens); render.splice(renderLength,1000,...lens.render()); renderLength = render.length;    
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  // Add a refractive sphere.
  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  const addRefractiveSphere = ()=>{
    var sphere = {
          point1    : point (-0.25,0),
          point2    : point (0.29,0),
          intersect : function([ray,point,inside=false]) {
            // The radius between the two dragable points.  
            var radius    = (this.point1 & this.point2).Length;
            // The distance of the center to the ray.
            var dist      = Math.abs(!(this.point1.Normalized ^ ray.Normalized));
            // See if that is within the radius.
            var intersect = (dist < radius);
            // Temporary point where the ray cuts the line orthogonal to the ray, through the point.
            var temp1     = ((ray * this.point1) ^ ray).Normalized;
            temp1 = temp1 * temp1.e12;
            // The intersection point, using pythagoras and a translator
            var i_point    = (1+(inside?1:-1)*abs(radius**2 - dist**2)**.5*ray*.5e012) >>> temp1;
            if (intersect) {
                // The interface tangent line at the intersection
                var I = this.point1&i_point|i_point;
                // Travel distance n1 back on the ray, call this point 'A'
                var in_n = 1*(parseFloat(this.edit.value)||1);
                var n1 = inside?in_n:1.0, n2 = inside?1.0:in_n;
                var A  = (1-n1*ray*.5e012) >>> i_point;
                // Construct line 'p' by projecting on the interface.      
                var p = (I|A).Normalized
                // Measure the distance from 'S' to 'p'
                var S_to_p = Math.abs(!(i_point ^ p)); 
                // This gives us the distance from the interface to point 'B'
                var I_to_B = (n2**2 - S_to_p**2);
                // Total internal reflection.
                if (I_to_B<0) return [ true, (point & i_point).Length, i_point, I*i_point >>> -ray, inside===true];
                // Now construct B by moving along p.
                var B = (1+(inside?1:-1)*I_to_B**.5*p*.5e012) >>> (p ^ I);
                return [ true, (point & i_point).Length, i_point, -B&i_point, inside===false ];
            }
            // Return distance, intersection point and new ray.
            return [ false, (point & i_point).Length, i_point ];
          },
          render    : function() { 
            this.edit = document.getElementById('UI').appendChild(helpers.input('n2',1.47));  
            return [
            ()=>this.edit.value<1?0xFF0000:0x0000FF, this.point1, this.point2, 
            ()=>'<G stroke="'+(this.edit.value<1?'red':'blue')+'" fill-opacity="0.1">',
              ()=>circle(this.point1, (this.point1 & this.point2).Length), 
            '</G>'  
          ]}
        }
    elements.push(sphere); render.splice(renderLength,1000,...sphere.render()); renderLength = render.length;    
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  // Add a screen 
  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  const addScreen = ()=>{
    var screen = {
          point1    : point (1.2,0.5),
          point2    : point (1.2,-0.5),
          reset     : function() { this.ctx.clearRect(0, 0, 256, 30); },
          intersect : function([ray,point]) {
            // The screen line.  
            var screen    = (this.point1 & this.point2);
            // Intersect ray with screen line.
            var ipoint    = (ray ^ screen).Normalized;
            ipoint = ipoint*ipoint.e12; // make sure its positive.
            // The center of the screen
            var midpoint  = (this.point1 + this.point2)/2;
            // The length of the screen
            var length    = (this.point1 & this.point2).Length;
            // See if we're less then half the length away from the midpoint
            var intersect = (screen|point|ray).s * (point&screen).s > 0 && (midpoint & ipoint).Length < length/2;
            // If so, return the distance, intersection point and new ray
            return [ intersect, (point & ipoint).Length, ipoint, undefined, function(i,d,ipoint,f,ray,raycolor){
               var pos = (ipoint & this.point1).Length / (this.point2&this.point1).Length * 256;
               this.ctx.strokeStyle = `rgb(${raycolor>>16},${raycolor>>8&255},${raycolor&255})`;
               this.ctx.beginPath();
               this.ctx.moveTo(pos,0); this.ctx.lineTo(pos,30);
               this.ctx.stroke();
            } ];
          },
          render    : function() { 
            var canvas = document.createElement('canvas');
            canvas.style.background = 'black'; canvas.style.border='1px solid white';
            canvas.width = 256; canvas.height = 30; canvas.className = 'extra';
            this.ctx = canvas.getContext('2d');
            this.ctx.strokeStyle = 'white'; this.ctx.lineWidth=2;
            this.ctx.globalCompositeOperation = 'lighter';
            document.getElementById('UI').appendChild(canvas);
            return [0xFFFFFF, this.point1, this.point2, '<G stroke-width="0.005">', [this.point1,this.point2], '</G>'];
          }
        }
    elements.push(screen); render.splice(renderLength,1000,...screen.render()); renderLength = render.length;    
  }

 
  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  // Buttons.
  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  document.body.appendChild(helpers.block(
      helpers.button('clear',(a)=>{ 
          render.splice(1,1000); sources=[]; elements=[]; renderLength = 1; 
          while (a = document.querySelector('.extra')) a.parentElement.removeChild(a);
      }),
      helpers.button('add light',addLight),
      helpers.button('add light bundle',addLightBundle),
      helpers.button('add mirror plane',addMirrorPlane),
      helpers.button('add mirror sphere',addMirrorSphere),      
      helpers.button('add refractive sphere',addRefractiveSphere),
      helpers.button('add thin lens',addThinLens),
      helpers.button('add thick lens',addThickLens),
      helpers.button('add screen',addScreen),
  ));
  addThickLens();
  addScreen();
  addLightBundle();
  
  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  // Trace the rays ..
  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  window.svg = document.body.appendChild(this.graph(()=>{
    var rays = [];
    // Frame reset.
    elements.forEach(e=>e.reset&&e.reset());
    // For each lightsource .. create a ray, max 50 bounces.
    sources.map(s=>s.rays()).flat().forEach((ray,si)=>{
        var raycolor = [0xFF0000,0xFF8800,0xFFFF00,0x00FF00,0x00FFFF,0x0088FF,0x0000FF][si%7]; 
        rays.push(raycolor)
        var bounce=0, laste = -1;
        while (bounce++<50) {
            var min = 0, mine = -1;
            // Find the nearest element on the ray.
            elements.forEach((element,ei)=>{
                var cur=element.intersect(ray)
                if (laste != ei && cur[0] && (min==0 || min[1]>cur[1])) { min=cur; mine = ei; }
            }); laste = mine;
            // If we hit something, add segment, create new ray
            if (min && min[0]) {
              rays.push([ray[1],min[2]]);
              if (min[3]===undefined) return min[4].call(elements[mine],...min,raycolor);
              ray = [min[3].Normalized, min[2]];
              while (min[4]===true && bounce++<50) {
                 min = elements[mine].intersect([...ray,true]);
                 rays.push(0xAAAAFF,[ray[1],min[2]],raycolor);
                 ray = [min[3].Normalized, min[2]];
              }
            // else we're done, add outgoing segment  
            } else {
              rays.push([ray[1],(1+ray[0]*10e012)>>>ray[1]])
              break;
            }
        }
    });
    render.splice(renderLength,1000,
       0xFF0000,'<G stroke-dasharray="0.01,0.02" comp-op="lighten" stroke-width="0.005" >',
       ...rays,
       '</G>');
    return render;
  },{animate:1,camera:1+0e1,grid:0}));
  
  svg.style.background='black';
  setInterval(()=>{ svg.setAttribute("stroke-dashoffset", -performance.now()/5000); },1000/30);
    
})


// Some helpers for UI etc.

const helpers = {
  button : (name, func)=>Object.assign(document.createElement('input'),{type:'button', value:name, onclick:func}),
  input  : (name,value='')=>Object.assign(document.createElement('input'),{className:'extra',type:'text',placeHolder:name,value}),
  block  : (...els)=>{ 
              div = document.createElement('div'); div.id='UI'; 
              Object.assign(div.style,{position:'fixed',top:'00px',display:'flex',flexDirection:'column'}); 
              els.forEach(e=>div.appendChild(e)); 
              return div; 
            },
}

// Startup.
app(helpers);
