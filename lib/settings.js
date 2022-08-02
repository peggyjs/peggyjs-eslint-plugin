"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Settings = void 0;
class Settings {
    constructor(settings) {
        this.settings = settings;
    }
    get indent() {
        const ind = this.settings["@peggyjs/indent"];
        switch (typeof ind) {
            case "number":
                return "".padStart(ind);
            case "string":
                if (ind === "tab") {
                    return "\t";
                }
                return ind;
            default:
                return "  ";
        }
    }
    get newline() {
        const nl = this.settings["@peggyjs/newline"];
        return (typeof nl === "string") ? nl : "\n";
    }
}
exports.Settings = Settings;
