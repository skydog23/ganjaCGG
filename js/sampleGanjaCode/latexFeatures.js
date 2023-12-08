// Switch to notebook mode.
notebook();

// <style>
// * {
//   box-sizing: border-box;
//   }

// .row {
//   display: flex;
// }

// /* Create two equal columns that sits next to each other */
// .column {
//   flex: 50%;
//   padding: 10px;
//   height: 300px; /* Should be removed. Only for demonstration */
// }
// </style>

// Declare an option and display a checkbox for it.
// checkbox(name, options) => creates a checkbox
// checkbox(name)          => returns 1 or 0 for the option.
checkbox("bold",{description:`Use bold for vectors`})

// support bold vectors as option.
if (checkbox("bold")) macros`\renewcommand\vec[1]{{\bf{#1}}}`

// Preamble is only for tex output (so this *does* nothing for HTML) ..
preamble`
  \documentclass{article}
  
  \usepackage{graphicx}
  \usepackage{minted}
  \usepackage{xcolor}
  \definecolor{LightGray}{gray}{0.75}
`;

// Add some LaTeX macros
macros`
  %% Some handy shortcuts.
  \newcommand\e[1]{{\mathbf e_{#1}}}
  \newcommand\GR[1]{{\mathbb R_{#1}}}
  
  %% some easy to use vectors.
  \newcommand\a{{\vec{a}}}
  \newcommand\b{{\vec{b}}}
  \newcommand\x{{\vec{x}}}
`;

// Now start writing markdown/latex
var color1 = "#ffaa00";
//var bgc = "<font color='#ff9900'>", enc = "</font>";

md`

%% Latex comments

\title{Latex notebooks in ganja.js}
\author{Steven De Keninck}
\date{February 2022}

\begin{document}
\maketitle

<font color="#800080"> It is now easy to create purple notebooks in $\LaTeX$</font>. 
No extra escaping is needed.

a vector $\x$


 You can use a selection of latex commands  to define sections, equations and everything
%%that is supported in math mode by katex. For the same price, get nice HTML and pro PDF
%%files!


The idea is not to provide full latex support, but rather a minimal subset that allows
for better interop between html and latex. 

\section{Introduction}

\subsection{Getting Started}

To start a notebook use the following function call

\begin{minted}[bgcolor=LightGray,fontsize=\footnotesize,]{javascript}
notebook();
\end{minted}

After this, you can start writing markdown / latex by using the md function call,
remember to use it as template string, so you do not to have to
escape backslashes.

\begin{minted}[bgcolor=LightGray,fontsize=\footnotesize,]{javascript}
md\`
  ... your latex and markdown code here ...
\`;
\end{minted}

to setup latex macros, use the macros function instead.

\begin{minted}[bgcolor=LightGray,fontsize=\footnotesize,]{javascript}
macros\`
  \newcommand\e[1]{{\mathbf e_{#1}}}
\`;
\end{minted}

At the end of your notebook, add the following call to resolve references and fill
in equation numbers.

\begin{minted}[bgcolor=LightGray,fontsize=\footnotesize,]{javascript}
resolve_references();
\end{minted}

Minimal support for user options is added using a single function called \emph{checkbox}

\begin{minted}[bgcolor=LightGray,fontsize=\footnotesize,]{javascript}
// Create a checkbox and add it to the notebook
checkbox("arrows",{description:"Use arrows for vectors"});

// Do something depending on the checkbox state.
if (checkbox("arrows") == 1) ...
\end{minted}

\subsection{Supported commands}

In Math mode you get very complete latex support. See e.g. \ref{exp}, \ref{test}. In the
main notebook, support is limited:

\begin{center}
\begin{tabular}{ |c|c| } 
 \hline
 sections   & section, subsection, subsubsection                      \\ 
 comments   & $\LaTeX$ comments                                       \\
 labels     & for equations and sections                              \\
 references & references to labeled equations.                        \\
 tabular    & minimal support.                                        \\
 equation   & equation (numbered) and square bracket (unnumbered)     \\
 lstlisting & code environment                                        \\
 minted     & code environment                                        \\
 emphasis   & emphasis                                                \\
 center     & centering                                               \\
 \hline  
\end{tabular}
\end{center}

\subsection{Supported environments}

Support is limited. For now you get the unnumbered square bracket

\[
\a\b = \a\cdot\b + \a\wedge\b
\]

and the numbered equation environments \ref{exp} 

\begin{equation}\label{exp}
e^\x = \sum_0^\infty \cfrac {\x^n} {n!}
\end{equation}

You can reference equations like \ref{exp} before or after you declare them.

\subsection{Using macros}

You can setup $\LaTeX$ macros using the \emph{macros} command.

\begin{equation}\label{test}
\GR{p,q,r}
\end{equation}

And here \ref{test} is another reference. I should make those clickable.

\section{Including interactive graphs}

The situation becomes more interesting when we want to include interactive
graphs into our notebooks. Can we maintain a 'copy-paste' style setup where
we can make our content purely online and still get directly usable latex
out of it?
%%
\includegraphics[width=\textwidth]{${embed(Algebra(2,0,1,()=>{
  var c = this.graph(()=>[
    0x009977,
    ...[...Array(50)].map((x,i)=>Math.E**((performance.now()/1000+i)*0.5e12)>>>(Math.sin(performance.now()/1000)*1e0+1e1))
  ],{animate:1}); 
  c.style.width='100%';
  c.style.maxHeight = '400px';
  c.style.background = 'white';
  return c;
}))}}
%%
Using the \emph{embed} call and \emph{ganja.js} we can easily create interactive
animated graphs. 

\section{Including symbolic math}

It is also possible to include symbolic expressions without having to type them out.

$$ \a\b = ${GAmphetamine(checkbox("2D")?"++":"+++",{printFormat:"latex"},()=>
  Element.vector("a_")*Element.vector("b_")
)} $$

\section{Local Content}

While the ability to create and share ganja.js examples online is certainly a great
advantage, for more advanced notebooks it is nice to manage your content locally.

Doing so is as easy as drag-dropping a local text file onto the coffeeshop. It will
automatically be monitored so you can just edit and save locally to see updates.

\end{document}
`;

checkbox("2D",{description:"Do this in two dimensions instead.."});
checkbox("bold",{description:`Use bold for vectors`})

md`<BUTTON onclick="saveTex()">Save tex</BUTTON>`

resolve_references();
