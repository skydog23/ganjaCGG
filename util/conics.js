//import {matVecMul, det, normMat, coFactor, matInv, matMul, scVecMul, scMatMul, matTr} from "./LA3D.js";
import {coFactor, matVecMul, dotVec} from "./LA3D.js";
import {inv, det, sqrt, matrix, index, range, subset} from "mathjs"
let {abs} = Math;
class Conic {
    // cooefficients are for the binomials [x^2, y^2, z^2, 2yz, 2xz, 2xy]
    #coeffs  = [1,1,-1,0,0,0]
    #Q
    static getVeroneseEmbedding([x,y,z]) {
        return [x*x, y*y, z*z, y*z, x*z, x*y]
    }
    static conicForCoeffs(cf) {
        let connie = new Conic();
        connie.setCoeffs(cf);
        return connie;
    }
    static conicLinePair([a0,b0,c0], [a1,b1,c1]){
        return Conic.conicForCoeffs([a0*a1,b0*b1,c0*c1, (b0*c1+b1*c0), (a0*c1+a1*c0), (a0*b1+a1*b0)]);
    }
    static conicFromFivePoints(pts) {
        let rows = [...Array(5)].map((x,j)=>j),
             m = matrix(pts.map(pt=>this.getVeroneseEmbedding(pt))),
            val = [...Array(6)].map((x, i) => {
                let columns = [...Array(6)].map((x, j) => j)
                columns.splice(i, 1)   // remove the ith entry
                return ((-1) ** i) * det(m.subset(index(rows, columns)));
            })
        console.log("coeffs = ",val)
        return Conic.conicForCoeffs(val);
    }
    getDualConic()  {
        return Conic.conicForCoeffs(Conic.coeffsFromQ(coFactor(this.#Q)))
    }
    setCoeffs( cf ) {
        this.#coeffs = cf
        let [a,b,c,f,g,h] = this.#coeffs
        this.#Q=[[a,h/2,g/2],[h/2,b,f/2],[g/2,f/2,c]];
    }
    getCoeffs() { return this.#coeffs}
    getQ() { return this.#Q}
    normalize() {
        let firstNonzero = this.#coeffs.find(x=>abs(x) > 1E-8);
        if (firstNonzero) {let sc = 1.0/firstNonzero; this.setCoeffs(this.#coeffs.map(x=>x*sc))}
    }
//    isVeronese() { return }
    static coeffsFromQ(Q) {
        return [Q[0][0], Q[1][1], Q[2][2], 2*Q[1][2], 2*Q[0][2], 2*Q[0][1]];
    }

    evaluateAtPoint(pt) { return dotVec(pt, this.polarPlane(pt))}

    polarPlane(pt) {
        return matVecMul(this.#Q,pt)
    }
}

let test = () => {

    const M = [
        [1,2,3],
        [4,5,6],
        [7,8,9]
    ]
    let M2 = subset(M, index(range(0,2), range(0,3))) // [[1,2,3],[4,5,6]]
    console.log("M2=",M2)
    console.log("dot =", dotVec(M[0],M[1]))
    let foo = Conic.conicForCoeffs([1, 2, -3, 0, 0, 0])
    console.log(foo.getQ())
    console.log(inv(foo.getQ()))
    let dfoo = foo.getDualConic()
    console.log("dual = ", dfoo.getCoeffs())
    let v = [2, 0, 0]
    console.log("polar plane of ", v, " is ", foo.polarPlane(v))
    let l0 = [0, 1, -1], l1 = [1, 0, -1], lp = Conic.conicLinePair(l0, l1)
    console.log("line pair is ", lp.getCoeffs())
    let Q = lp.getQ()
    console.log("det=", det(Q))
    console.log("coeffs=", Conic.coeffsFromQ(Q), "dual =  ", lp.getDualConic().getCoeffs())
    let pts = [[1,0,1],[0,1,1],[-1,0,1],[0,-1,1],[sqrt(2)/2, sqrt(2)/2,1]]
    let cc = Conic.conicFromFivePoints(pts);
    let vals = pts.map((x)=>cc.evaluateAtPoint(x))
    console.log("conic = ",cc.getCoeffs())
    console.log("vals = ",vals)


}
//test();
export {Conic}