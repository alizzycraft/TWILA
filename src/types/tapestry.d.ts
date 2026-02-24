// Extend the base Tapestry interface with our log method
interface BaseTapestryObject {
  mod: {
    define(definition: any): void;
  };
  client: {
    players: {
      getLocal(): any;
      raycastBlock(options: any): any;
    };
  overlay: {
      register(overlay: any): void;
      setVisible(modId: string, overlayId: string, visible: boolean): void;
    };
  };
  scheduler: {
    nextTick(callback: Function): string;
  };
}

// Extended interface with log method
interface TapestryObject extends BaseTapestryObject {
  log(message: string): void;
}

export interface ModDefinition {
  id: string;
  version?: string;
  onLoad(tapestry: TapestryObject): void;
  onEnable?(tapestry: TapestryObject): void;
  onDisable?(tapestry: TapestryObject): void;
}
