notebook();

const Box = text=>`<SPAN STYLE="display:inline-block; padding:5px;  border:1px solid black; background:#FFE">${String.raw(text)}</SPAN>`
const CBox = text=>`<CENTER><SPAN STYLE="display:inline-block; padding:5px;  border:1px solid black; background:#FFE">${String.raw(text)}</SPAN></CENTER>`

// Example two column layout
document.head.appendChild(Object.assign(document.createElement('style'),{ innerHTML:`
  .col  { flex: 50%; font-size:100%; padding-left:10px; }
  .col:first-child {border-right:1px solid #DDD; padding-left:0px; padding-right:10px; }
  .cols { display: flex; flex-direction: row; flex-wrap: wrap;  width: 100%; }
`}))

var {g1} = Algebra(2,0,1,()=>{
  // Using Geometric/Clifford algebra with signature (2,0,1), based on the work of Charles Gunn
  var point    = (x,y,z)=>z*1e12-x*1e02+y*1e01,
      {sqrt, abs, sin, round} = Math;
      
      let Z = point(-1,-1,1),
          A = point(1,0,1),
          B = point(0,1,1),
          z = () => A&B;
          
        let g1 = this.graph(()=>{
          return [0x0, Z,"P", A, B, z, "z"
       ]
    }, {
        // more render properties for the default items.
        pointRadius:.75,  // point radius
        lineWidth:2,      // line width
        fontSize:1.5,     // font size
        grid:false,         // grid
        scale: .7,
    //width:window.innerWidth, 
        animate:false,
        dual:false});
      g1.style.maxHeight ='700px';
      g1.style.width = '100%';
      g1.style.background = '#fffff0';
      g1.style.border  = '1px solid #444';

        return {g1};
})


md`\title{Central projectivities}
\date{November 2022}
\author{Charlie Gunn}

\includegraphics{${embed(g1)}}

`

