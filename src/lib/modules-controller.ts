import {ImportMap, ImportMapInjector} from "./import-map-injector";
import {fetchJsonObject} from "./config-loader";


export class ModulesController {
    private modules: { [name: string]: any } = {};

    constructor(private importInjector: ImportMapInjector) {

    }

    public async addModule(name: string) {

        const modName = name.replace("@", "")
        const importMapPatch = `/modules/${modName}/importmap.json`;
        const pathScript = `/modules/${modName}/index.js`;
        let importMapObj: ImportMap = await fetchJsonObject(importMapPatch);

        this.importInjector.joinImportMap(importMapObj);
        this.importInjector.injectMap()


        if (this.modules[name]) {
            console.log("MODULE ALREADY LOADED", name)
            return Promise.resolve(this.modules[name]);
        } else {
            let module = await import( pathScript );

            this.registerModule(name, module);

            return module
        }

    }

    public registerModule(name: string, module: any) { // todo
        this.modules[name] = module;
    }
}




