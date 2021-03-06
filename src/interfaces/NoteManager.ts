import { NoteContent } from "@interfaces/Notes";

export interface NoteManager {
	loadNotes(): Promise<any>;
	loadNote(id: string): Promise<any>;
	selectNote(id: string | null): void;
	createNoteAndSelect(): void;
	updateSelectedNoteContent(textContent: string, contentValue: NoteContent): void;
	updateSelectedNoteTags(tags: string[]): void;
	deleteNote(id: string): Promise<any>;
	saveSelectedNote(): Promise<any>;
	cancelSelectedNoteChanges(): void;
}