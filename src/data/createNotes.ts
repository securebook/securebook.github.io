import { Notes, NoteContent, Note } from "@interfaces/Notes";
import { EntityData, UserEntity } from "@interfaces/EntityData";
import { getTimeInMS } from "@utils/time";
import { Location } from "@interfaces/Location";

export function getDefaultNote(id: string): UserEntity<NoteContent, Note> {
	return {
		id,
		name: '',
		tags: [],
		createdTime: getTimeInMS(),
		lastUpdatedTime: getTimeInMS(),
		content: {
			value: { html: '' }
		}
	}
}

export function createNotes(location: Location, notesEntityData: EntityData<NoteContent, Note>): Notes {
	return {
		get status() {
			return notesEntityData.status;
		},

		get list() {
			return notesEntityData.workingList;
		},

		get selectedId() {
			return !location.query.page && location.query.note || null;
		},

		get selected() {
			return this.selectedId && this.list[this.selectedId] || null;
		},

		dirty: {},

		state: {},

		get tags() {
			const tags: string[] = [];
			const tagExists: { [k: string]: boolean } = {};
			for (const id in this.list) {
				const note = this.list[id];
				for (let i = 0; i < note.tags.length; i++) {
					const tag = note.tags[i];
					if (!tagExists[tag]) {
						tags.push(tag);
						tagExists[tag] = true;
					}
				}
			}
			return tags;
		},
	}
}