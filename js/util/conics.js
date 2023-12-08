//import {matVecMul, det, normMat, coFactor, matInv, matMul, scVecMul, scMatMul, matTr} from "./LA3D.js";
import {coFactor, matVecMul, dotVec, vecVecAdd, scVecMul, vecNorm, cross} from "./LA3D.js";
import {pi, cos, sin, abs, max, sign, inv, det, sqrt, matrix, index, range, subset} from "mathjs"
class Conic {
    // cooefficients are for the binomials [x^2, y^2, z^2, 2yz, 2xz, 2xy]
    _coeffs  = [1,1,-1,0,0,0]
    _Q
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
        return Conic.conicForCoeffs(Conic.coeffsFromQ(coFactor(this._Q)))
    }
    setCoeffs( cf ) {
        this._coeffs = cf
        let [a,b,c,f,g,h] = this._coeffs
        this._Q=[[a,h/2,g/2],[h/2,b,f/2],[g/2,f/2,c]];
    }
    intersectWithLine([a,b,c]) {
        let P = (a==0) ? [0,-c/b,1] : [-c/a,0,1],
            v = [-b,a,0],
            C = this.biSymForm(P,P),
            B = 2*this.biSymForm(P,v),
            A = this.biSymForm(v,v),
            D = B*B-4*A*C
        console.log("P,v,A,B,C,D",P, v, A, B, C, D)
        if (D < 0) return []
        if (D == 0) return [vecVecAdd(P, scVecMul(-B/(2*A)))]
        let t0 = (-B+sqrt(D))/(2*A), t1 = (-B - sqrt(D))/(2*A);
        return [t0,t1].map(x=> vecVecAdd(P, scVecMul(x, v)))
    }
    getPointOnConic(initGuess = [2,0,1], tol = 1e-8) {
        let center = this.polarPlane([0,0,1]),
            line = cross(center, [1,0,0]),  // horizontal line through center
            pts = this.intersectWithLine(line)
        if (pts && pts.length > 0) return pts[0]
            line = cross(center, [0,1,0])   // vertical line through center
            pts = this.intersectWithLine(line)
        if (pts && pts.length > 0) return pts[0]
        // to be here means to be in a very weird state, should probably throw an error
        let error = this.QAtPoint(initGuess),
            count = 0,
            limit = 20,
            grad = [],
            pt = initGuess
        while (sqrt(abs(error)) > tol && count < limit) {
            grad = vecNorm(this.polarPlane(pt))
            grad[2] = 0.0
            pt = vecVecAdd(pt, scVecMul(-.2*error,grad))
            error = this.QAtPoint(pt)
            count++
            console.log(count,"error = ",error)
        }
        return pt;
    }
    // this method uses a trick to generate points on a conic.
    // that's because it first finds a point on the conic and then for a sampling of lines
    // in this line pencil, finding the second intersection point is a linear problem.
    getPointsOnConic(num=50) {
        let pt = this.getPointOnConic()
        scVecMul(1.0/pt[2],pt);     // normalize to have normalized coordinates
        return [...Array(num)].map((x,i)=>{
            let a = pi*i/num,
                v = [cos(a),sin(a),0]
             return vecVecAdd(pt, scVecMul(-2*this.biSymForm(pt,v)/this.QAtPoint(v), v))
        })
    }
    getCoeffs() { return this._coeffs}
    getQ() { return this._Q}
    normalize() {
        let maxval = max(...(this._coeffs.map(x=>abs(x))));
        if (maxval != 0) {let sc = 1.0/maxval; this.setCoeffs(this._coeffs.map(x=>x*sc))}
    }
//    isVeronese() { return }
    static coeffsFromQ(Q) {
        return [Q[0][0], Q[1][1], Q[2][2], 2*Q[1][2], 2*Q[0][2], 2*Q[0][1]];
    }

    QAtPoint(pt) { return this.biSymForm(pt, pt)}

    biSymForm(a,b) { return dotVec(a, this.polarPlane(b))}

    polarPlane(pt) {
        return matVecMul(this._Q,pt)
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
    foo.normalize();
    console.log("normalized = ",foo.getCoeffs());
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
    let vals = pts.map((x)=>cc.QAtPoint(x))
    console.log("conic = ",cc.getCoeffs())
    console.log("vals = ",vals)
    console.log("point on conic =", cc.getPointOnConic());
    let isect = cc.intersectWithLine([0,1,-.5]);
    console.log("intersection ",isect)
    let pointsOnConic = cc.getPointsOnConic(10)
    console.log("pts on conic = ",pointsOnConic)
    let xyz2svg = ([x,y,z])=>`${x},${y} `,
        pts2svg = (pts)=>pts.map(pt=>xyz2svg(pt)).join('');
    console.log("svg output ",pts2svg(pointsOnConic))
}
test();
export {Conic}