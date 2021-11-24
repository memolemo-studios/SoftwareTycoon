declare function coreCall<T extends InstanceMethodNames<StarterGui>>(
  method: T,
  ...args: Parameters<StarterGui[T]>
): boolean[];

export = coreCall;
