import {fetchJsonData, fetchModules} from "./lib/config-loader";
import {ImportMapInjector} from "./lib/import-map-injector";
import {ModulesController} from "./lib/modules-controller";

const importInjector = new ImportMapInjector(document);




let entryPath="/entry.json"

// @ts-ignore
const projectName=  import.meta.env?.MODE;
if (projectName!==undefined){
    console.log("ENTRY",projectName);
    const path = `/bootstraps/${projectName}`;
     entryPath=`${path}${entryPath}`;
}

function injectFavicon(url: string) {
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = url;
    document.head.appendChild(favicon);

}

async function  init(){
    const entry=await fetchJsonData(entryPath)
    const modName = entry.layout.module;
    const moduleLoader = new ModulesController(importInjector);
    const addModule= (name: string) => {
        return moduleLoader.addModule(name);
    }

    const module= await moduleLoader.addModule(modName)

    let layoutConf:{ title: string,logo:string,favicon:string } = entry.layout.data;
    const  mapping: { [name: string]: {module:string,data:any} } = {};
    let keys = Object.keys(entry.routes);
    for (const key of keys) {
        mapping[key.substring(1)] = entry.routes[key];
    }

    document.title = layoutConf.title;
    injectFavicon(layoutConf.favicon);

    module.ENTRY.bootstrap().then((mod) => {
        mod.setConfigSource(layoutConf, addModule,mapping);
    });
}


init();
