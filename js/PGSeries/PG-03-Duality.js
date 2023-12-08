notebook();

const Box = text=>`<SPAN STYLE="display:inline-block; padding:5px;  border:1px solid black; background:#FFE">${String.raw(text)}</SPAN>`
const CBox = text=>`<CENTER><SPAN STYLE="display:inline-block; padding:5px;  border:1px solid black; background:#FFE">${String.raw(text)}</SPAN></CENTER>`

// Example two column layout
document.head.appendChild(Object.assign(document.createElement('style'),{ innerHTML:`
  .col  { flex: 50%; font-size:90%; padding-left:10px; }
  .col:first-child {border-right:1px solid #DDD; padding-left:0px; padding-right:10px; }
  .cols { display: flex; flex-direction: row; flex-wrap: wrap;  width: 100%; }
`}))


md`\title{Everything comes in pairs}
\date{today}
\author{Charlie Gunn}

We saw in the previous tutorial that projective geometry arose out of 
perspective painting by the addition of new elements, first noticed by Renaissance painters,
where parallel lines and planes meet.

The addition of these new elements in projective geometry (PG) 
had unexpected and far-reaching consequences.
To simplify the discussion, we focus now on 2D projective geometry, the projective plane $P(\mathbb{R}^2)$.
It arises from the euclidean plane $\mathbf{E}^2$ by adding an ideal line along with all its points,
the *ideal* points of the projective plane.

%%gives rise to a deep symmetry known as *duality*.  
%%This arises from the fact that the basic axioms of PG come in pairs.
%%Each axiom can be obtained from its partner by replacing a small set of terms with a *dual* term.

The innocent-looking addition of these ideal elements brings far-reaching consequences for projective geometry.
Consider the following two statements in plane geometry.


<DIV CLASS="cols">
<DIV CLASS="col">
Every two distinct points have a unique joining line.
${embed(Algebra(2,0,1,()=>{ 
  let P = 1e12 - 1e02 + .3e01,
     Q = 1e12 - .5e02 - .5e01,
     m = ()=>P&Q;
  c = this.graph([0xff0000, P, "P", Q, "Q", 0x0000ff, m, "m"],{lineWidth:4,pointRadius:2, fontSize:2,scale:2,grid:false}); 
  c.style.width='100%'; 
  c.style.height='250px'; 
  c.style.background='white';
  c.style.border='1px solid black'
  return c;
}))}

</DIV>

<DIV CLASS="col">
Every two distinct lines have a unique intersection point. 
${embed(Algebra(2,0,1,()=>{ 
  let p =  !(1e12 - 1e02 + .3e01),
     q = !(1e12 - .5e02 - .5e01),
     M = ()=>p^q;
  c = this.graph([0xff0000, p, "p", q, "q", 0x0000ff, M],{lineWidth:4,pointRadius:2, fontSize:2,grid:false}); 
  c.style.width='100%'; 
  c.style.height='250px'; 
  c.style.background='white';
  c.style.border='1px solid black'
  return c;
}))}

</DIV>
</DIV>

Notice that the second statement is not true in euclidean geometry since the two lines can be parallel. 
But with the addition of ideal points, it **is** always true in projective geometry.

## Dictionary of duality

Dualizing means to use a *dictionary of duality* to replace dual terms with their dual partners.  Some of the pairs in the dictionary are nouns (point/line) while others are verbs (join/intersect). Any term not in the dictionary remains unchanged by dualizing.

For two dimensions, the beginning of the dictionary of duality looks like:

\begin{center}
\begin{tabular}{ |c|c| }
\hline
\textbf{Term} & \textbf{dual term}\\
\hline
line & point \\
join & intersect \\
lies on & passes through \\
rotate around & move along
\hline
\end{tabular}
\end{center}

Notice that the dual pairs are symmetric; for each pair, I could also write it in the opposite order.
So it's not like an ordinary dictionary one of the partner terms belongs to, say, English and the other is French.  
There is only
the language of projective geometry, and within this language there are pairs of dual partners.

Example: The dual of:
\begin{minted}{}
  A point moving along a line and joined to a point not lying on the line.
\end{minted}
is
\begin{minted}{}
  A line rotating around a point and intersected with a line not passing through the point.
\end{minted}


%From this follows the *Principle of duality*: 

<CENTER>
<SPAN STYLE="border:1px solid black; background:#ffffcc; padding:10px">
<b>A statement in projective geometry is true $\iff$ its dual statement is true.</b>
</SPAN>
</CENTER>



`
