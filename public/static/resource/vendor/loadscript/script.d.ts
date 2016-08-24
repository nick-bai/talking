declare var $script: scriptStatic;

interface scriptStatic {
    ready(key: string, callback: any): void
    get(path: string, callback: any): void
    done(): void
    path(path: string): void
    urlArgs(arg: string): void
    (obj: any, fnorkey?: any): void
}
