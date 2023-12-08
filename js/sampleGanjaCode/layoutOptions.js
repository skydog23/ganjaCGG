notebook();

md`

\title{some layout options}


<font color="#800080"> It is now easy to create big purple notebooks in $\LaTeX$</font>. 

<span style="color:purple; background:yellow">It really is.</span>
<span style="color:purple; background:#ffffcc">Not kidding.</span>
The default $\KaTeX$ support is limited to math mode. For layout options in the
surrounding text markdown allows the use of embedded HTML.

# Fonts and Colors

\`\`\`
<DIV STYLE="color:red">
Red Text and $\LaTeX$
</DIV>
\`\`\`

<DIV STYLE="color:red">
Red Text and $\LaTeX$
</DIV>

\`\`\`
<DIV STYLE="font-family:monospace">
Monospace font
</DIV>
\`\`\`

<DIV STYLE="font-family:monospace">
Monospace font
</DIV>


# Boxes

\`\`\`
<DIV STYLE="border:1px solid black; background:yellow; padding:5px; text-align:center">
Text in a full-width box
</DIV>
\`\`\`

<DIV STYLE="border:1px solid black; background:yellow; padding:5px; text-align:center">
Text in a full-width box
</DIV>

or if you don't want full-width, use a span instead of a div :

\`\`\`
<SPAN STYLE="border:1px solid black; background:yellow; padding:5px">
Text in a fitting box
</SPAN>
\`\`\`

<SPAN STYLE="border:1px solid black; background:yellow; padding:5px">
Text in a fitting box
</SPAN>

or centered:

\`\`\`
<CENTER>
<SPAN STYLE="border:1px solid black; background:yellow; padding:25px">
$ e^{B} = \sum\limits_{n=0}^\infty \cfrac {B^n} {n!} $
</SPAN>
</CENTER>
\`\`\`

<CENTER>
<SPAN STYLE="border:1px solid black; background:yellow; padding:25px">
$ e^{B} = \sum\limits_{n=0}^\infty \cfrac {B^n} {n!} $
</SPAN>
</CENTER>

all other CSS options also work, e.g. shadows:

\`\`\`
<CENTER>
<SPAN STYLE="border:1px solid black; background:yellow; padding:25px; 
             box-shadow:2px 2px 2px black">
$ e^{B} = \sum\limits_{n=0}^\infty \cfrac {B^n} {n!} $
</SPAN>
</CENTER>
\`\`\`

<CENTER>
<SPAN STYLE="border:1px solid black; background:yellow; padding:25px; box-shadow:2px 2px 2px black">
$ e^{B} = \sum\limits_{n=0}^\infty \cfrac {B^n} {n!} $
</SPAN>
</CENTER>

# Some CSS links

Best place to get references on this is on MDN. While it is possible to add a full stylesheet,
it is typically not needed and so called 'inline css' will cover most needs in these notebooks.

[https://developer.mozilla.org/en-US/docs/Web/CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)

[https://developer.mozilla.org/en-US/docs/Learn/CSS/Styling_text/Fundamentals](https://developer.mozilla.org/en-US/docs/Learn/CSS/Styling_text/Fundamentals)




`
