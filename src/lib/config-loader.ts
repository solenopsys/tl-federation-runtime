

export type Entry = {
    layout: XsModule,
    routes: { [key: string]: XsModule }
}

export type   Modules = {[key:string]:string};

export type XsModule = {
    data: any,
    module: string,
}

export async function fetchJsonObject(url: string): Promise<any> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    return await response.json();
}
export async function fetchJsonData(url: string): Promise<Entry> {
    return await fetchJsonObject(url);
}

export async function fetchModules(url: string): Promise<Modules> {

    return  await fetchJsonObject(url);
}


