notebook();

md`
\title{Hello, World}
\date{today}

\section{uhuh graphics}\label{sec:test}

See graphics in \ref{sec:test}

\includegraphics[\textwidth]{${embed(
  Algebra(2,0,1,()=>{
    var c = this.graph([1e1,1e2,1e12]);
    c.style.width = '100%'; 
    c.style.background = 'white';
    c.style.border = '1px solid black';
    return c;
  })
)}}
`

resolve_references();

