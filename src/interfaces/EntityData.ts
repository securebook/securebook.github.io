export type BaseEntity<T> = {
	id: string,
	content: {
		status: 'not loaded: lost' |
			'not loaded: not created' |
			'not loaded: created' |
			'loaded: not created' |
			'loading' |
			'error' |
			'loaded' |
			'creating' |
			'updating' |
			'deleting' |
			'deleted',
		value: null | T
	},
};

export type EntityListFileContent<C, T extends BaseEntity<C>> = { [k: string]: Omit<T, 'content'> };

export type UserEntity<C, T extends BaseEntity<C>> = Omit<T, 'content'> & {
	content: {
		value: null | C
	}
};

export interface EntityData<C, T extends BaseEntity<C>> {
	status: 'not loaded' |
		'loading' |
		'loaded' |
		'loading entity' |
		'creating entity' |
		'updating entity' |
		'deleting entity' |
		'error',
	loadedList: { [k: string]: T },
	workingList: { [k: string]: T },
}