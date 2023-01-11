// Setup the notebook environment.

notebook()

// Use markdown with the md function.

md(String.raw`# ganja.js notebooks

Use markdown with integrated $\KaTeX$ support. *(remember you have to escape
backslashes in javascript strings)*

`)

// Interleave this with ganja.js graphs

Algebra(2,0,1,()=>{
  
  const {E,PI} = Math;
  
  var lines = [...Array(50)]
      .map((x,i)=>E**(i*PI/50*1e12) >>> (1e1+.5e0))
  
  var color = Math.random()*256*256*256;
  
  var but = button('Change Color',()=>color = Math.random()*256*256*256);
  
  var c = this.graph(()=>[color, ...lines],{animate:1});
 
  // Apply some styles to our graph.
  
  c.style.border     = '1px solid black';
  c.style.background = '#FFFFEE';
  c.style.maxHeight  = '300px';
  c.onwheel          = undefined;           // turn of mousewheel response.
  
  return c;
  
})

// Combine as many blocks as you like

md(`

For example follow up with more markdown.

| title | number      | description
|-------|:-----------:|------------
| test  | 1.0         | nicely styled tables

`)

// Or use the new (unreleased) symbolic GAmphetamine.

var res = GAmphetamine("3DPGA", {printFormat:"latex"}, ()=>{
  
  var a = Element.vector("a_{");
  var b = Element.vector("b_{");
  
  var B = Element.bivector("B_{")
  
  return {
    "a"  : a,
    "b"  : b,
    "aa" : a*a,
    "ab" : a*b,
    "ab - (a|b + a^b)" : (a*b) - (a|b + a^b),
    "B"  : B,
    "(B*xB)*" : 0.5*(B.dual()*B - B*B.dual()).undual(),
    "B**-1" : B**-1,
    "B**-1 * B" : B**-1 * B
  }

})

// And display its results with nice LaTeX

md(`

## Symbolic PGA

$ a = ${res.a} $

$ b = ${res.b} $

$ aa = ${res.aa} $

$ ab = ${res.ab} $

$ ab - (a \\cdot b + a \\wedge b) = ${res["ab - (a|b + a^b)"]} $

$ B = ${res.B} $

$ (B^* \\times B)^{-*} = ${res["(B*xB)*"]} $

$ B^{-1}B = ${res["B**-1 * B"]} $ 

$ B^{-1} = ${res["B**-1"]} $

`)


