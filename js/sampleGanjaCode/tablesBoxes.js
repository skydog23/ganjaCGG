notebook();

md`

\title{Notebook test}
\date{today}
\author{me}


\section{Tables}

Option 1 : **Markdown**

| header 1 | left | center | right |
|----------|:-----|:------:|------:|
| row 1    | abc  | def    | 123   |
| row 2    | abc  | def    | 123   |


Option 2 : $\LaTeX$

\begin{center}
\begin{tabular}{ |c|c|c| }
\hline
plane reflection & vector & $\mathbf e_i$\\
line reflection & bivector & $\mathbf e_{ij}$\\
point reflection & trivector & $\mathbf e_{ijk}$\\
\hline
\end{tabular}
\end{center}

\section{Code Highlighting}

Option 1 : **Markdown**

\`\`\`
  var square = x => x*x;
\`\`\`

Option 2: $\LaTeX$

\begin{minted}{javascript}
  var square = x => x*x;
\end{minted}



`
