//import {matVecMul, det, normMat, coFactor, matInv, matMul, scVecMul, scMatMul, matTr} from "./LA3D.js";
import {matVecMul} from "./LA3D.js ";

class Conic {
    #coeffs  = [1,1,-1,0,0,0]
    #Q
    static conicForCoeffs(cf) {
        let connie = new Conic();
        connie.setCoeffs(cf);
        return connie;
    }
    setCoeffs( cf ) {
        this.#coeffs = cf
        let [a,b,c,f,g,h] = this.#coeffs
        this.#Q=[[a,h,g],[h,b,f],[g,f,c]]
    }
    getCoeffs() { return this.#coeffs}
    getQ() { return this.#Q}

    polarPlane(pt) {
        return matVecMul(this.#Q,pt)
    }
}

let foo = Conic.conicForCoeffs([1,1,-1,0,0,0])
console.log(foo.getQ())
let v = [2,0,0]
console.log("polar plane of ",v," is ",foo.polarPlane(v))