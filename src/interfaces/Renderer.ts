export interface Renderer {
	calculation: null | {
		isInitialRender: boolean,
		perform: () => void;
		onUpdate: () => void;
	}

	onCalculationChanged(): void;
}