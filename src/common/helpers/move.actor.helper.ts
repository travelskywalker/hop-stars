import { Actor } from '@src/core/actor';

export function moveActorOnYAxis(actor: Actor, speed: number, angle: number, _delta: number) {

    actor.getDisplayObject().x += _delta * speed * Math.sin(angle);
    actor.getDisplayObject().y += _delta * speed * Math.cos(angle);
}

export function moveActorOnXAxis(actor: Actor, speed: number, angle: number, _delta: number) {

    actor.getDisplayObject().x += _delta * speed * Math.cos(angle);
    actor.getDisplayObject().y += _delta * speed * Math.sin(angle);
}