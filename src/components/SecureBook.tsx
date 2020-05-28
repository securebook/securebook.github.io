import { h, Fragment } from 'preact';
import { connect } from '@view/connect';
import "@styles/SecureBook.scss";
import Input from '@components/Input';
import { useState, useContext } from 'preact/hooks';
import { StoreContext } from '@view/StoreContext';
import { ManagersContext } from '@view/ManagersContext';
import { filterNotesByTags } from '@utils/tags';
import { getValues } from '@utils/object';
import EditorPresenter from '@components/EditorPresenter';
import Icon from '@components/Icon';
import { getFormattedDateTime } from '@utils/time';
import ContextMenu from '@components/ContextMenu';
import { useContextMenu } from '@view/useContextMenu';
import { Portal } from '@components/Portals';
import { DropDown, DropDownItem } from '@components/DropDown';

function SecureBook() {
	const { password, notes } = useContext(StoreContext);
	const { passwordManager, noteManager } = useContext(ManagersContext);
	const [tagSearch, setTagSearch] = useState('');
	const trimmedTagSearch = tagSearch.trim();
	const list = getValues(notes.list);
	const isContentLoaded = notes.selected
		&& (notes.selected.content.status === 'loaded'
			|| notes.selected.content.status === 'loaded: not created');
	const isContentLoading = notes.selected
		&& (notes.selected.content.status === 'loading');
	const { contextMenuId, getTriggerProps, contextMenuProps } = useContextMenu();
	return <div className="SecureBook">
		<aside className="SecureBook__Sidebar">
			<article className="SecureBook__Section">
				<h1>Password</h1>
				<Input type="text" value={password.value} onChange={e => passwordManager.providePassword(e.currentTarget.value)} />
				<div>Status: {password.status}</div>
			</article>
			<article className="SecureBook__Section">
				<h1>Tag search</h1>
				<Input type="text" value={tagSearch} onInput={e => setTagSearch(e.currentTarget.value)} />
			</article>
			<div className="SecureBook__Section">Note status: { notes.status }</div>
			<div className="SecureBook__Section"><button onClick={() => noteManager.createNoteAndSelect()}>Add note</button></div>
			{
				(trimmedTagSearch
					? filterNotesByTags(list, trimmedTagSearch)
					: list)
				.map(note => (
					<article
						key={note.id}
						className={`SecureBook__Section SecureBook__Note ${notes.selectedId === note.id ? `SecureBook__NoteSelected` : ``}`}
						onClick={() => noteManager.selectNote(notes.selectedId !== note.id ? note.id : null)}
						{...getTriggerProps(note.id)}
					>
						<h1 className="SecureBook__NoteName" title={note.name}>{!note.name ? <em>Unnamed note</em> : note.name}</h1>
						{note.tags.length > 0 &&
							<div className="SecureBook__Tags" title={note.tags.join(' ')}>
								<Icon type="local_offer" /> {note.tags.join(' ')}
							</div>}
						<div className="SecureBook__DateTime" title={
							"Last edited: " + getFormattedDateTime(note.lastUpdatedTime, true) + "\n" +
							"Created: " + getFormattedDateTime(note.createdTime, true)}>
							<Icon type="edit" /> {getFormattedDateTime(note.lastUpdatedTime)}</div>
						{contextMenuId === note.id && <Portal>
							<ContextMenu {...contextMenuProps}>
								<DropDown>
									<DropDownItem type="delete" label="Delete note" onClick={() => noteManager.deleteNote(note.id)} />
								</DropDown>
							</ContextMenu>
						</Portal>}
					</article>
				))
			}
		</aside>
		<main className="SecureBook__Main">
			{
				notes.selected
					? <Fragment>
						<div className="SecureBook__Editor">
							<EditorPresenter
								disabled={!isContentLoaded}
								showLoading={!!isContentLoading}
								contentId={!isContentLoading && notes.selected.id}
								content={notes.selected.content.value || { html: '' }}
								onContentChange={(text, content) => {
									noteManager.updateSelectedNoteContent(text, content);
								}}
							/>
						</div>
						<div className="SecureBook__BottomBar">
							<button onClick={() => noteManager.saveSelectedNote()}>Save note</button>
							<div>Status: {notes.selected.content.status}</div>
							<div>
								Tags: <Input value={notes.selected.tags.join(' ')}
									onInput={e => noteManager.updateSelectedNoteTags(
										e.currentTarget.value.length
											? e.currentTarget.value.split(/\s+/)
											: [])}
								/>
							</div>
						</div>
					</Fragment>
					: <div>Not selected</div>
			}
		</main>
	</div>;
}

export default connect(SecureBook);