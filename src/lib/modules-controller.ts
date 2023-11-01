import {ImportMap, ImportMapInjector} from "./import-map-injector";
import {fetchJsonObject} from "./config-loader";


export class ModulesController {
    private modules: { [name: string]: any } = {};
    constructor(private importInjector: ImportMapInjector ) {

    }

    public async   addModule(name: string) {

        const modName=name.replace("@","")
        const path = `/modules/${modName}/importmap.json`;
        let importMapObj:ImportMap = await fetchJsonObject(path);

        this.importInjector.joinImportMap(importMapObj);
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




