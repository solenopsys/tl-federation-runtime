import {ImportMap, ImportMapInjector} from "./import-map-injector";
import {fetchJsonObject} from "./config-loader";


export class ModulesController {
    private modules: { [name: string]: any } = {};

    constructor(private importInjector: ImportMapInjector) {

    }

    public async addModule(name: string,devMode=false) {

        if (this.modules[name]) {
            console.log("MODULE ALREADY LOADED", name)
            return Promise.resolve(this.modules[name]);
        } else {
            const modName = name.replace("@", "")

            const indexFile =devMode?"src/index.ts":"index.js";
            const pathScript = `/modules/${modName}/${indexFile}`;

            if(!devMode) {
                const importMapPatch = `/modules/${modName}/importmap.json`;
                let importMapObj: ImportMap = await fetchJsonObject(importMapPatch);

                this.importInjector.joinImportMap(importMapObj);
                this.importInjector.injectMap()
            }
            let module = await import( pathScript );

            this.registerModule(name, module);

            return module
        }

    }

    public registerModule(name: string, module: any) { // todo
        this.modules[name] = module;
    }
}




