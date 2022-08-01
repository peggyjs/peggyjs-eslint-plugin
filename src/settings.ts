export interface PeggyPluginSettings {
  "@peggyjs/indent"?: number | string | "tab";
  "@peggyjs/newline"?: string;
}

export class Settings {
  private settings: PeggyPluginSettings;

  public constructor(settings: PeggyPluginSettings) {
    this.settings = settings;
  }

  public get indent(): string {
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

  public get newline(): string {
    const nl = this.settings["@peggyjs/newline"];
    return (typeof nl === "string") ? nl : "\n";
  }
}
