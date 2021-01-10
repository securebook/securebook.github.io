import { useState, useContext, useRef } from "preact/hooks";
import { useUnmount } from "@view/useUnmount";
import { ConnectedContext } from "@view/ConnectedContext";
import { useOnce } from "@view/useOnce";

export function connect<T extends (...args: any[]) => any>(Component: T): T {
	return function(...args) {
		const result = useRef(null);
		const { createRenderer } = useContext(ConnectedContext);
		const [,setState] = useState({});
		const renderer = useOnce(() => {
			return createRenderer();
		});
		renderer.calculation = {
			isInitialRender: true,
			perform() {
				result.current = Component(...args);
			},
			onUpdate() {
				setState({});
			}
		};
		useUnmount(() => {
			renderer.calculation = null;
		});
		renderer.calculation;
		return result.current;
	} as unknown as T;
}