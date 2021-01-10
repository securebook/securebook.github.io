export interface Renderer {
	calculation: null | {
		result: any;
		isInitialRender: boolean;
		perform: () => void;
		onUpdate: () => void;
	}

	onCalculationChanged(): void;
}