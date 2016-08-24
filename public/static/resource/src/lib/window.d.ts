declare module RongIMLib {
    class Expression {
        static retrievalEmoji(a: any, b: any): string
        static getEmojiObjByEnglishNameOrChineseName(obj: any): any
        static getAllExpression(number: any, start: any): any
    }
    class voice {
        static play(content: string, time: any): void
    }
    // class RongIMEmoji {
    //     static emojis: any[]
    //     static init(): void
    //
    //     static emojiToSymbol(str: string): string
    //     static symbolToEmoji(str: string): string
    //     static symbolToHTML(str: string): string
    //     static emojiToHTML(str: string): string
    // }
    // class RongIMVoice {
    //     static init(): void
    //     static play(data: string, duration: number): void
    //     static stop(): void
    //     static onprogress(): void
    // }
}

interface Window {
    webkitURL: any
    RongIMLib: any
    Notification: Notification
    $script: any
}
interface Notification extends Function {
    title: string;
    dir: string;
    lang: string;
    body: string;
    tag: string;
    icon: string;
    data: any;
    slient: boolean;

    onclick: (ev: MouseEvent) => any;
    onerror: () => any;
    onshow: () => any;
    onclose: () => any;
    close: () => any;
}
declare var Notification: {
    new (title: string, config: any): Notification
    requestPermission(fun: any): void
    permission: any
}
declare var $script: any
interface JQueryStatic {
    rebox: any
    nicescroll: any
}
interface JQuery {
    rebox(target: any): JQuery
    niceScroll(config: any): any
}

declare var jQuery: JQueryStatic

declare var Qiniu: Qiniu;

interface Qiniu {
    uploader(config: any): Qiniu
}
