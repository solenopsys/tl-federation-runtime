import {fetchJsonData, fetchModules} from "./lib/config-loader";
import {ImportMapInjector} from "./lib/import-map-injector";
import {ModulesController} from "./lib/modules-controller";

const importInjector = new ImportMapInjector(document);




let entryPath="/entry.json"

// @ts-ignore
const projectName=  import.meta.env?.MODE;
const devMode=projectName!==undefined
if (devMode){
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
    const addModule= async (name: string) => {
        return await moduleLoader.addModule(name,devMode);
    }

    const module= await moduleLoader.addModule(modName,devMode)

    let layoutConf:{ title: string,logo:string,favicon:string } = entry.layout.data;
    const  mapping: { [name: string]: {module:string,data:any} } = {};
    let keys = Object.keys(entry.routes);
    for (const key of keys) {
        mapping[key.substring(1)] = entry.routes[key];
    }



    document.title = layoutConf.title;
    if(devMode){
        layoutConf.logo=`/bootstraps/${projectName}/${layoutConf.logo}`
        layoutConf.favicon=`/bootstraps/${projectName}/${layoutConf.favicon}`
    }
    injectFavicon(layoutConf.favicon);

    module.ENTRY.bootstrap().then((mod) => {
        mod.setConfigSource(layoutConf, addModule,mapping);
    });
}


init();
