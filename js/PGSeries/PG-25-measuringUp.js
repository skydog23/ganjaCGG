notebook();

md`\title{Measuring up}
\date{July, 2022}
\author{Charlie Gunn}


## History of projective geometry

In many ways projective geometry was an answer to the questions raised by perspective painting. In particular, painters discovered that to represent parallel lines realistically, they appeared in the painting as lines that intersect at a so-called \emph{vanishing point}. But how could that be?  After all, parallel lines are defined to be lines that never meet! 

Projective geometry solved this paradox by adding the vanishing points to the ordinary points and developing the resulting extended geometry independently of euclidean geometry.

By adding these extra points to the ordinary points of euclidean geometry, projective geometry could provide a full explanation of the technique of perspective painting, not possible in euclidean geometry alone. 

The price was that many of the traditional concepts of euclidean geometry had to be abandoned: measurements of distance and angle, as well as the notion of parallel lines. For many years, projective geometry developed in this way on its own. 

But in the middle of the $19^{th}$ century after decades of dramatic growth, projective geometry came into contact again with euclidean geometry.  A way was found to re-create euclidean geometry purely in terms of projective geometry. 

This so-called \emph{Cayley-Klein} construction (named after its inventors Felix Klein and Arthur Cayley) could be used not only give a model of euclidean geometry but also of the non-euclidean metric geometries that had been discovered during the same period.

This is what Arthur Cayley had in mind when he wrote:
<CENTER>
<SPAN STYLE="border:1px solid black; background:#ffffcc; padding:10px">
<b>Projective geometry is the mother of all geometry.</b>
</SPAN>
</CENTER>

To construct the euclidean plane, it picks out a single line including all its points and gives them a special status as \emph{ideal} elements. Combining this ideal line with the projective theory of conics allowed euclidean measurements to be re-introduced on the remaining elements. We sketch how this works for measuring angles.

## Ideal and parallel elements

The \emph{ideal} elements of the euclidean plane (EP) consists of an *ideal line* $z$ and all its points, the *ideal points*.
There is an elliptic involution $i$ on the point range $z$, $i:z\rightarrow z$, called the *absolute involution*.

Two lines are said to be $e$*-parallel* if their intersection point is ideal.  
Two lines are said to be $e$*-perpendicular* if their ideal points are paired by $i$.
%%such that $Y \perp X \iff Y = i(X)$ for ideal points $X$ and $Y$.

which dualizes to:

The ideal elements of the dual euclidean plane (DEP) consists of an *ideal point* $Z$ and all its lines, the *ideal lines*.
There is an elliptic involution $I$ on the line pencil $Z$, $I:Z\rightarrow Z$, called the *absolute involution*.

%%The notion of a right angle is provided by an  involution $i:Z\rightarrow Z$ 
%%:w$such that $y \perp x \iff y = i(x)$ for ideal lines $y$ and $x$.

Two points are said to be $d$-parallel if their joining line is ideal.   
Two points are said to be $d$*-perpendicular* if their ideal lines are paired by $I$.

`
