import { useState, useContext } from "preact/hooks";
import { useUnmount } from "@view/useUnmount";
import { ConnectedContext } from "@view/ConnectedContext";
import { useOnce } from "@view/useOnce";

export function connect<T>(Component: T): T {
	return function(...args) {
		let result;
		const C = Component as any;
		const { createRenderer } = useContext(ConnectedContext);
		const [,setState] = useState({});
		const renderer = useOnce(() => {
			return createRenderer();
		});
		renderer.calculation = {
			isInitialRender: true,
			perform() {
				result = C(...args);
			},
			onUpdate() {
				setState({});
			}
		};
		useUnmount(() => {
			renderer.calculation = null;
		});
		return result;
	} as unknown as T;
}