import { RunService } from "@rbxts/services";

export namespace Thread {
  /** Creates a timed loop with connection returned */
  export function loop<T extends unknown[]>(interval: number, callback: (...args: T) => void, ...args: T) {
    let timer = 0;
    const connection = RunService.Heartbeat.Connect(dt => {
      timer += dt;
      if (timer >= interval) {
        timer = 0;
        callback(...args);
      }
    });
    return connection;
  }
}
