import {Conic} from "../util/conics.js"
import Algebra from "../util/ganja.cjs"
//var Algebra=require('../util/ganja.cjs');


//const {Algebra} = somepackage
let foo =  Algebra(6,0,0).inline((conics)=>{

    console.log("wedge = ",conics);

    let conic = (a,b,c,d,e,f)=>(a*1e1 + b*1e2 + c * 1e3 + d * 1e4+ e*1e5 + f*1e6)

    let [c0, c1, c2] = conics.map(x=>conic(...x));
    console.log("gaels = ",[c0,c1,c2]);
    console.log("wedge = ",c0^c1^c2)
    return [c0,c1,c2]
})

let uC = Conic.conicForCoeffs([1,1,-1,0,0,0]),
    uH = Conic.conicForCoeffs([1,-1,-1,0,0,0]),
    t2 = Conic.conicLinePair([1,0,1],[1,0,-1]);
console.log("coeffs = ",t2.getCoeffs())
console.log("inline func = ",foo([uC,uH,t2].map(x=>x.getCoeffs())))