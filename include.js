module.exports = exports = (function(){
    return function(file,pushTo=null){
        if(pushTo === null)pushTo = global;
        var stuff = require('fs').readFileSync(file);
        if(stuff.length>0){
            var str = stuff.toString(); 
            (function _imports(val, reg = /import ({?)([\w_,\s]+)}? from (?:"|')(.+)(?:"|')/g, arr = []){
                var t = reg.exec(val);
                return (t == null) ? arr : _imports(val,reg,arr.concat([t.slice(1)])); 
            })(str).forEach(i=>{
                var aliases = i[1].split(",").map(x=>x.replace(/\s/g,""));
                if(i[0] === "{"){
                    var _tmpLoad = require(i[2]);
                    aliases.forEach(x=>{
                        if(!Reflect.has(pushTo,x) && Reflect.has(_tmpLoad,x)) 
                            pushTo[x] = _tmpLoad[x]; 
                        else ;
                            // console.log("Couldn't load module");
                    });
                }else if(!Reflect.has(pushTo,i[0]))pushTo[i[1]] = require(i[2]);
            });
            str.split(/export(?= )/g).forEach(x=>{
                var thing = /class ([\w-]+){([^]+)}/g.exec(x);
                if(thing != null){
                    var brackets = (function getBrackets(reg,body,r = []){
                        for(var s = reg.exec(body); s != null; s = reg.exec(body))
                            r.push(s[2] !== undefined ? {
                                name : s[2],args : s[3],
                                isStatic : s[1] === "static",
                                start :  s.index + s[0].length + 1,
                                end : null,body : ""
                            }:{start : s.index,isClosed : s[0] === "}"});
                        return r;
                    })(/(?:if|(?:(static) )?([\w-]+))\((.*)\)\s*{|{|}/g,thing[2]);
                    var classBuilder = brackets.filter(y=>Reflect.has(y,"name")).map(func=>{
                        var closed = brackets.filter(y=>y.start > func.start).find((fi,oo,rr) =>fi.isClosed && 
                            rr.filter(fil=> !fil.isClosed && fil.start>func.start && fil.start < fi.start).length === rr.filter(fil=> fil.isClosed && 
                                    fil.start>func.start && 
                                    fil.start < fi.start).length);
                        func.end = closed.start;
                        func.body = thing[2].substring(func.start,closed.start);
                        return func;
                    });
                    var classString =[
                        "(function(){\n",
                        "var "+thing[1]+" = "+classBuilder.filter((y,i,rr)=>!y.isStatic && rr.filter(el=>el.start < y.start && el.end > y.end).length === 0).reduce((a,c)=>
                            c.name === "constructor" ? ["function("+ c.args +"){",c.body].concat(a,"};\n") : 
                                a.concat(["this."+c.name+" = function("+ c.args +"){"+c.body+"}\n",a[a.length-1] === "};\n"? a.pop():null]),[]).join("")
                    ].concat(classBuilder.filter(y=>y.isStatic).map(y=>thing[1]+"."+y.name+" = function("+y.args+"){" + y.body+"};\n"),["return "+thing[1]+";\n})()\n"]).join("");
                    if(classString !== "" && classString !== null && typeof(pushTo)==="object")pushTo[thing[1]] = eval(classString);
                }
            });
        }
        return pushTo;
    }
})();
