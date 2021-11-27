import Roact, { mount, unmount } from "@rbxts/roact";
import { HoarcekatStory } from "types/hoarcekat";

type OnUnmountCallback = (callback: () => void) => void;

/**
 * Makes a Hoarcekat story without a much of a boilerplate code
 * for Hoarcekat
 */
export function makeStory(callback: (onUnmounted: OnUnmountCallback) => Roact.Element) {
  return identity<HoarcekatStory>(parent => {
    const queued_cleanups = new Array<() => void>();
    const add_queue = (callback: () => void) => {
      queued_cleanups.push(callback);
    };
    const tree = mount(callback(add_queue), parent, "story");
    return () => {
      unmount(tree);
      for (const call of queued_cleanups) {
        call();
      }
    };
  });
}
