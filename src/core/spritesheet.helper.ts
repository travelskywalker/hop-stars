import * as PIXI from 'pixi.js';
import { App } from "@src/app";

export function spritesheetFromResource(
                  app: App,
                  key: string,
                  rows: number,
                  columns: number,
                  cells: number): PIXI.extras.AnimatedSprite {

  return new PIXI.extras.AnimatedSprite(spritesheetTexturesFromResource(app, key, rows, columns, cells));
}

export function spritesheetTexturesFromResource(
                  app: App,
                  key: string,
                  rows: number,
                  columns: number,
                  cells: number): PIXI.Texture[] {

  const sheet = app.getResource(key).texture as PIXI.BaseTexture;
  const cellW = Math.floor(sheet.width / columns);
  const cellH = Math.floor(sheet.height / rows);
  const textures = [];

  for (var r = 0; r < rows; ++r) {
    for (var c = 0; c < columns; ++c) {
      textures.push(
        new PIXI.Texture(
          sheet,
          new PIXI.Rectangle(cellW * c, cellH * r, cellW, cellH)
        )
      );
      if (textures.length == cells)
        return textures;
    }
  }

  console.log('done');
  return textures;
}