/** Decorator metadata for Flamework */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface DecoratorMetadata<T extends any[]> {
  type: string;
  arguments: T;
}
