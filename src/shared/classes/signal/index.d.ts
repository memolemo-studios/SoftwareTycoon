/* eslint-disable @typescript-eslint/no-explicit-any */

declare namespace Signal {
	/** A fake RBXScriptConnection object */
	export interface Connection extends RBXScriptConnection {
		/**
		 * Alias of `Disconnect` method, useful for cleaners have
		 * sensitive typings
		 * @alias Disconnect */
		Destroy(): void;
	}
}

type AnyCallback = (...args: any) => any;

/** RBXScriptSignal wrapper, it allows to make custom signals in any class, or variables */
interface Signal<C extends AnyCallback = () => void> {
	/**
	 * Fires the Signal with any number of arguments
	 * @param args The arguments to pass into the connected observers
	 */
	Fire(...args: Parameters<C>): void;

	/**
	 * Observes the signal's firing behavior. It will execute a callback
	 * found a parameter, whenever the signal is invoked.
	 * @param callback The function to call when signal is invoked
	 */
	Connect(callback: (...args: Parameters<C>) => void): Signal.Connection;

	/** Yields the current thread until the signal is invoked. */
	Wait(): LuaTuple<Parameters<C>>;

	/**
	 * Destroys the Signal, useful for cleaning things up to avoid neccessary invokes.
	 */
	Destroy(): void;
}

/** RBXScriptSignal wrapper, it allows to make custom signals in any class, or variables */
declare const Signal: new <C extends AnyCallback = () => void>() => Signal<C>;
export = Signal;
