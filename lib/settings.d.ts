export interface PeggyPluginSettings {
    "@peggyjs/indent"?: number | string | "tab";
    "@peggyjs/newline"?: string;
}
export declare class Settings {
    private settings;
    constructor(settings: PeggyPluginSettings);
    get indent(): string;
    get newline(): string;
}
