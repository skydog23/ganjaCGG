
// Switch to notebook mode.
notebook();

// Create some graphs.
const g1 = Algebra(2,0,1,()=>this.graph([1e1,1e2,1e12]));
g1.style.width = '100%';
g1.style.background = 'white';
g1.style.border = '1px solid #888';

// Add some content to the page.
md`
\title{Ganja.js standalone notebook}
\author{by enki}

\section{Including graphics.}

\includegraphics[\textwidth]{${embed(g1)}}

$\KaTeX$ supported.
`;

// should be here for KaTeX
renderMathInElement(document.body);