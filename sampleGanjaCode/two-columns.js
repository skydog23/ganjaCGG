notebook();

// Macro for colors

const Red = text=>String.raw`<SPAN STYLE="color:red">${String.raw(text)}</SPAN>`;
const Box = text=>`<SPAN STYLE="display:inline-block; padding:5px;  border:1px solid black; background:#FFE">${String.raw(text)}</SPAN>`

md`Color test

${Red`color red $\KaTeX$`}

---
`

// Adding stylesheets to the page
document.head.appendChild(Object.assign(document.createElement('style'),{ innerHTML:`
  H1 { color : blue; font-family: cursive; text-shadow: 2px 2px 2px red } 
`}))


// Test custom style
md`

# test

---
`

// Example two column layout
document.head.appendChild(Object.assign(document.createElement('style'),{ innerHTML:`
  .col  { flex: 50%; font-size:85%; padding-left:10px; }
  .col:first-child {border-right:1px solid #DDD; padding-left:0px; padding-right:10px; }
  .cols { display: flex; flex-direction: row; flex-wrap: wrap;  width: 100%; }
`}))

md`

## Two column layout.

<DIV CLASS="cols">
<DIV CLASS="col">

### First Col

This is the text in the first column including $\KaTeX$ and other features.
${embed(Algebra(2,0,1,()=>{ 
  c = this.graph([1e1,1e2,1e12],{grid:1}); 
  c.style.width='100%'; 
  c.style.height='250px'; 
  c.style.background='white';
  c.style.border='1px solid black'
  return c;
}))}
\caption{Fig1 : the origin.}
</DIV>

<DIV CLASS="col">

### Second Col

*This* is the second column which has the
${Red`same`} features.
\begin{equation}
e^x = \sum\limits_{n=0}^{\infty} \cfrac {x^n} {n!}
\end{equation}

Text ${Box`in a box with $\KaTeX$.`} 

</DIV>
</DIV>


Continue with regular layout after we are done using two column layout. 

`


resolve_references();

