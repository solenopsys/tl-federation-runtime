import {ImportMapInjector} from "./import-map-injector";

export class ModulesController {
    private modules: { [name: string]: any } = {};
    constructor(private importInjector: ImportMapInjector,private mapping: {[key:string]:string}) {

    }

    public addModule(name: string) {

        let modName = this.mapping[name] ;

        this.importInjector.addModule(name, modName);
        this.importInjector.injectMap()


        if(this.modules[name]){
            console.log("MODULE ALREADY LOADED",name)
            return Promise.resolve(this.modules[name]);
        }else{
            let promise = import( modName );
            promise.then((module)=>{
                this.registerModule(name,module);
            })
            return promise
        }

    }

    public registerModule(name: string, module: any) { // todo
        this.modules[name] = module;
    }
}




