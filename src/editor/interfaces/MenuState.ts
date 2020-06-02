import { ParagraphAttrs } from "@editor/nodes/ParagraphNode";

export interface MenuState {
	strong: {
		isCurrent: boolean,
	},
	em: {
		isCurrent: boolean,
	},
	code: {
		isCurrent: boolean,
	},
	underline: {
		isCurrent: boolean,
	},
	strikethrough: {
		isCurrent: boolean,
	},
	link: {
		isCurrent: boolean,
		isSelected: boolean,
		attrs: {
			href: string,
			title: string,
		},
	},
	blockquote: {
		isCurrent: boolean,
	},
	codeBlock: {
		isCurrent: boolean,
	},
	heading: {
		isCurrent: boolean,
		level: number,
	},
	paragraph: {
		isCurrent: boolean,
		attrs: ParagraphAttrs,
	},
	bulletList: {
		isCurrent: boolean,
	},
	orderedList: {
		isCurrent: boolean,
	},
	todoList: {
		isCurrent: boolean,
	},
}