import { useState, useContext, useRef } from "preact/hooks";
import { useUnmount } from "@view/useUnmount";
import { ConnectedContext } from "@view/ConnectedContext";
import { useOnce } from "@view/useOnce";

export function connect<T extends (...args: any[]) => any>(Component: T): T {
	return function(...args) {
		const { createRenderer } = useContext(ConnectedContext);
		const [,setState] = useState({});
		const renderer = useOnce(() => {
			return createRenderer();
		});
		renderer.calculation = {
			result: null,
			isInitialRender: true,
			perform() {
				this.result = Component(...args);
			},
			onUpdate() {
				setState({});
			}
		};
		useUnmount(() => {
			renderer.calculation = null;
		});
		return renderer.calculation.result;
	} as unknown as T;
}