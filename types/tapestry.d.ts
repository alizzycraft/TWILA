// Basic Tapestry type definitions for TWILA development

declare global {
  var tapestry: TapestryObject;
}

interface TapestryObject {
  mod: {
    define(mod: ModDefinition): void;
  };
  players?: {
    list(): PlayerInfo[];
    get(id: string): PlayerInfo | null;
    findByName(name: string): PlayerInfo[];
    sendChat(id: string, message: string): void;
    sendActionBar(id: string, message: string): void;
    sendTitle(id: string, title: string, subtitle?: string): void;
    getPosition(id: string): Position;
    getLook(id: string): Vector3;
    getGameMode(id: string): string;
    raycastBlock(id: string, maxDistance?: number): BlockInfo | null;
  };
  client?: {
    overlay: {
      register(overlay: OverlayDefinition): void;
    };
  };
  utils?: {
    mikel(template: string, data?: any): string;
  };
  rpc?: any;
  env?: {
    side: 'client' | 'server';
  };
}

interface ModDefinition {
  id: string;
  onLoad?(): void;
  onEnable?(): void;
  onDisable?(): void;
  onUnload?(): void;
}

interface PlayerInfo {
  id: string;
  name: string;
  position: Position;
  health: number;
  maxHealth: number;
}

interface Position {
  x: number;
  y: number;
  z: number;
  dimension: string;
}

interface Vector3 {
  x: number;
  y: number;
  z: number;
}

interface BlockInfo {
  type: string;
  position: Position;
  properties: Record<string, any>;
}

interface OverlayDefinition {
  id: string;
  render(): void;
}

export { TapestryObject, ModDefinition, PlayerInfo, Position, Vector3, BlockInfo, OverlayDefinition };