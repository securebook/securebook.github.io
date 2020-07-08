import { KeyBindings, AddKeyBinding } from "@editor/interfaces/KeyBindings";
import { KeyBindingsManager as IKeyBindingsManager, KeyMap } from "@editor/interfaces/KeyBindingsManager";
import { Schema } from "prosemirror-model";
import { EditorPlugins, AddEditorPlugin } from "@editor/interfaces/EditorPlugins";
import { keymap } from "prosemirror-keymap";
import { baseKeymap } from "prosemirror-commands";
import { isMac } from "@utils/keycode";

export class KeyBindingsManager implements IKeyBindingsManager, EditorPlugins {
	private readonly keyBindings: KeyBindings[];

	constructor(keyBindings: KeyBindings[]) {
		this.keyBindings = keyBindings;
	}

	addEditorPlugins(addEditorPlugin: AddEditorPlugin, schema: Schema) {
		for (let i = 0; i < this.keyBindings.length; i++) {
			addEditorPlugin(keymap(this.getKeyMap(this.keyBindings[i], schema)));
		}
		addEditorPlugin(keymap(baseKeymap));
	}

	getKeyMap(keyBindings: KeyBindings, schema: Schema) {
		const keys: KeyMap = {};
		const addKeyBinding: AddKeyBinding = (key, cmd) => {
			keys[key] = cmd;
		};
		keyBindings.addKeyBindings(addKeyBinding, schema, isMac());
		return keys;
	}
}