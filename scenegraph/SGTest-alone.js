
  var rid = 1;
  class SGNode {
     static count = 0;
     static base = "000000";
     static formatCount = ()=>{
         let num = SGNode.count.toString().length;
         return SGNode.base.substring(1,6-num)+SGNode.count.toString();
     }
    
    #name = '';
    constructor() {
       this.#name = `${this.constructor.name}-${SGNode.formatCount()}`;
       SGNode.count++;
       console.log("constructing ",SGNode.count," ",this.#name);
    }
    getName() {return this.#name}
    render(rdr) {console.log("rendering ",this.#name, "currTf = ",rdr.tfstack)}
    reset() {}
  }
  
  class SGT extends SGNode {
    rotor = rid;
    render(rdr) { super.render(rdr); rdr.pushTF(this.rotor);}
    postrender() { rdr.popTF(); }
    reset() {this.rotor = rid;}
  }
  
  class SGG extends SGNode {
    ellist = [];
    render(rdr) { 
      super.render(rdr); 
      let currTF = rdr.currTF();
      rdr.addEls(this.ellist.map(x=>x*currTF)); 
    }
    reset() {this.ellist = [];}
  }
  
  class SGC extends SGNode {
     tform = new SGT();
     geom = new SGG();
     color = 0xff0000;
     children = [];
     addChild(c) { this.children.push(c); }
     render(rdr) { 
       super.render(rdr); 
       rdr.addEls([this.color]);
       this.tform.render(rdr);
       this.geom.render(rdr);
       this.children.forEach( x => x.render(rdr));
       this.tform.postrender();
     }
     reset() {this.tform.reset(); this.geom.reset(); this.children = []; }
  }
  
  class Renderer {
    root = new SGC();
    dllist = [];
    tfstack = [rid];
    render() {this.root.render(this);}
    
    addEls(els) {this.dllist = this.dllist.concat(els);}
    
    pushTF(tf) {this.tfstack.push(tf*this.tfstack[this.tfstack.length-1]);}
    popTF() {this.tfstack.pop();}
    currTF() {return this.tfstack[this.tfstack.length-1];}
  }
  
    let rdr = new Renderer(),
    root = new SGC(),
    c1 = new SGC(),
    c2 = new SGC();
    rdr.root = root;
    root.addChild(c1);
    root.addChild(c2);
    root.tform.rotor = rid;
    let geom = new SGG();
    geom.ellist = [1,2,3,4,5]; //  extent1t(A,B,10);
    c2.geom = c1.geom = geom;
    c1.tform.rotor = rid;
    c1.color = 0xff00;
    c2.tform.rotor = 2;
    c2.color = 0xff;
    rdr.render();

    console.log(rdr);
  

