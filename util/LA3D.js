let {pow} = Math;
let transpose = (a2d) => a2d[0].map((_, colIndex) => a2d.map(row => row[colIndex]));
let coFactor = ([[a,b,c],[d,e,f],[g,h,i]])=> [[e*i-f*h,-(d*i-f*g),d*h-e*g], [-(b*i-c*h), a*i-c*g,-(a*h-b*g)], [b*f-c*e, -(a*f-c*d), a*e-b*d]];
let matInv = (m)=> {let d = det(m); return (d == 0)? coFactor(m) : scMatMul(pow(1/d,1), coFactor(m))}
let normMat = (m)=> {let d = det(m); return (d == 0)? m : scMatMul(pow(1/d,1/3), m)}
let det = ([[a,b,c],[d,e,f],[g,h,i]]) => a*(e*i-f*h) - b *(d*i-f*g) + c*(d*h-e*g)
let matTr = ([[a0,a1,a2],[b0,b1,b2],[c0,c1,c2]])=>[[a0,b0,c0],[a1,b1,c1],[a2,b2,c2]];

let matMul = (m1, m2) => {let ret = [[0,0,0],[0,0,0],[0,0,0]]; // Array(3).fill(Array(3).fill(0));
    for (let i = 0; i<3; ++i) {
        for (let j = 0; j<3; ++j) {
            for (let k = 0; k<3; ++k) {
                ret[i][j] += m1[i][k] * m2[k][j];
            }
        }
    }
    return ret;
}
let matVecMul = (m, v) => {let ret = [0,0,0]; // Array(3).fill(Array(3).fill(0));
    for (let i = 0; i<3; ++i) {
        for (let j = 0; j<3; ++j) {
            ret[i] += m[i][j] * v[j];
        }
    }
    return ret;
}

let scVecMul = (s, v) => v.map((x)=>x*s);
let scMatMul = (s, m) => m.map((x)=>x.map((y)=>y*s));

let dotVec = (u,v) => u[0]*v[0] + u[1]*v[1] + u[2]*v[2];

let vecVecAdd = (u,v) => u.map((x,i)=>x+v[i]);

// test it a bit
let m = [[1,0,0],[0,2,0],[0,0,3]],
    v = [2,-2,1];

console.log(m, " ",matVecMul(m,v), " ", det(m))
console.log(normMat(m), " ",det(normMat(m)))
console.log(matInv(m), det(matInv(m)), matMul(m,matInv(m)))

export {matVecMul, det, normMat, coFactor, matInv, matMul, scVecMul, scMatMul, matTr};