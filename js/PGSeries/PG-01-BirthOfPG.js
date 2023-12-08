notebook();

const Box = text=>`<SPAN STYLE="display:inline-block; padding:5px;  border:1px solid black; background:#FFE">${String.raw(text)}</SPAN>`
const CBox = text=>`<CENTER><SPAN STYLE="display:inline-block; padding:5px;  border:1px solid black; background:#FFE">${String.raw(text)}</SPAN></CENTER>`

// Example two column layout
document.head.appendChild(Object.assign(document.createElement('style'),{ innerHTML:`
  .col  { flex: 50%; font-size:100%; padding-left:10px; }
  .col:first-child {border-right:1px solid #DDD; padding-left:0px; padding-right:10px; }
  .cols { display: flex; flex-direction: row; flex-wrap: wrap;  width: 100%; }
`}))


md`\title{The geometry of sight}
\date{today}
\author{Charlie Gunn}

At the beginning of the $15^{th}$ century, painters in Renaissance Italy 
began to see and draw points where parallel lines appear to meet. These so-called *vanishing points*
were a riddle that defied an understanding within the geometry of Euclid.

One hundred years later, the German artist Albert Dürer (1571-1628) wrote **A Manual of Measurement** (1525) devoted to
showing how perspective could be learned, indeed, how it could be mechanized.

Two hundred years later, the French mathematician and architect Rene Desargues (1591-1661) invented *projective
geometry* (1641), an extension of euclidean geometry that incorporates vanishing points with the same rights as ordinary points.

Today we call these new points *ideal points*. Instead of saying parallel lines never meet, projective geometry says that they
meet in an ideal point. Each family of parallel lines then share one ideal point.  Ideal points are like directions.


