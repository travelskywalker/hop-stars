import { App } from '@src/app';
import { SpriteActor } from '@src/core/sprite.actor';

export class Tilemap extends PIXI.particles.ParticleContainer {

  sprites: SpriteActor[] = [];

  constructor(_app: App, tileset_name: string, tilemap_name: string, tilemap_spritesheet_name: string, tile_size: number) {

    super(10000);

    const tileset = _app.getResource(tileset_name).data;
    const tilemap = _app.getResource(tilemap_name).data;

    // load tilesets
    interface TileTexture { id: number; texture: string; }
    const tile_textures: TileTexture[] = tileset.tiles.map((t: any) => {
      const texture_path = t.image.split('\/');
      return {
        id: t.id + 1,
        texture: texture_path[texture_path.length - 1],
      };
    });

    // create tilemap
    tilemap.layers.forEach((layer: any) => {
      let tile_index = 0;
      for (let y = layer.y; y < layer.height; ++y) {
        for (let x = layer.x; x < layer.width; ++x) {
          const tile_type = layer.data[tile_index++];
          if (tile_type === 0) continue;
          const tile_sprite: SpriteActor = new SpriteActor(
            `tile_x_${x}_y_${y}`,
            _app,
            tilemap_spritesheet_name,
            tile_textures.find(t => t.id === tile_type).texture,
          );
          tile_sprite.setScaleUpToScreenPercWidth(tile_size);
          tile_sprite.setPosition(x * tile_sprite.sprite.width, y * tile_sprite.sprite.height);
          this.addChild(tile_sprite.getSprite());
          this.sprites.push(tile_sprite);
        }
      }
    });
  }
}
