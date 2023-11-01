import {ImportMapInjector} from "./import-map-injector";

export class ModulesController {
    private modules: { [name: string]: any } = {};
    constructor(private importInjector: ImportMapInjector ) {

    }

    public addModule(name: string) {

        const modName=name.replace("@","")
        const path = `/modules/${modName}/index.js`;


        this.importInjector.addModule(name, path);
        this.importInjector.injectMap()


        if(this.modules[name]){
            console.log("MODULE ALREADY LOADED",name)
            return Promise.resolve(this.modules[name]);
        }else{
            let promise = import( path );
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




