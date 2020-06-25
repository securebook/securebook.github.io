import { h, Fragment } from 'preact';
import { connect } from '@view/connect';
import "@styles/SecureBook.scss";
import { useState, useContext, useRef, useEffect } from 'preact/hooks';
import { StoreContext } from '@view/StoreContext';
import { ManagersContext } from '@view/ManagersContext';
import { filterNotesByTags } from '@utils/tags';
import { getValues } from '@utils/object';
import EditorPresenter from '@components/EditorPresenter';
import Icon from '@components/Icon';
import ContextMenu from '@components/ContextMenu';
import { useContextMenu } from '@view/useContextMenu';
import { DropDown, DropDownItem } from '@components/DropDown';
import PasswordDialog from '@components/PasswordDialog';
import { orderByUpdatedDate, unsavedChangesListener, isConfirmedUnsavedChanges } from '@utils/notes';
import TextLoading from '@components/TextLoading';
import EditorMenu from '@components/EditorMenu';
import { useEffectOnce } from '@view/useEffectOnce';
import Checkbox from '@components/Checkbox';
import Donate from '@components/Donate';
import LoadingSpinner from '@components/LoadingSpinner';
import Tags from '@components/Tags';
import NoteItem from '@components/NoteItem';

const optionalSidebarScreenWidth = `1450px`;

function SecureBook() {
	const { notes, darkMode, noteViewerIntent } = useContext(StoreContext);
	const { noteManager, auth } = useContext(ManagersContext);
	const [tagSearch, setTagSearch] = useState<string[]>([]);
	const list = orderByUpdatedDate(getValues(notes.list));
	const noteResultingList = filterNotesByTags(list, tagSearch);
	const isContentLoaded = notes.selected
		&& (notes.selected.content.status === 'loaded'
			|| notes.selected.content.status === 'loaded: not created'
			|| notes.selected.content.status === 'not loaded: not created');
	const isContentLoading = notes.selected
		&& (notes.selected.content.status === 'loading');
	const isEditorSpinnerShown = notes.selected
		&& (
			notes.selected.content.status === 'deleting' ||
			notes.selected.content.status === 'updating' ||
			notes.selected.content.status === 'creating'
		);
	const { contextMenuId, getTriggerProps, contextMenuProps } = useContextMenu();
	const focusedId = contextMenuId ?? notes.selectedId;
	const contentId = notes.selected && !isContentLoading && notes.selected.id;

	const mql = window.matchMedia(`(max-width: ${optionalSidebarScreenWidth})`);
	const [isOptionalSidebar, setOptionalSidebar] = useState(mql.matches);
	const [isSidebarOpen, setSidebarOpen] = useState(true);

	useEffect(
		() => {
			if (darkMode.isDarkMode) {
				document.body.classList.add('dark-mode');
			}
			else {
				document.body.classList.remove('dark-mode');
			}
			return () => {
				document.body.classList.remove('dark-mode');
			}
		},
		[darkMode.isDarkMode]
	);

	useEffectOnce(() => {
		const resetOptionalSidebar = () => setOptionalSidebar(mql.matches);

		mql.addListener(resetOptionalSidebar);

		return () => {
			mql.removeListener(resetOptionalSidebar);
		}
	});

	const isNoteSelected = !!notes.selected?.id;
	useEffect(
		() => {
			if (isNoteSelected && isSidebarOpen) {
				setSidebarOpen(false);
			}
		},
		[isNoteSelected]
	);

	const [isSettingsOpen, setSettingsOpen] = useState(false);
	const settingsRef = useRef<HTMLButtonElement>(null);

	const onMainClick = (e: MouseEvent) => {
		if (isOptionalSidebar && isSidebarOpen) {
			e.preventDefault();
			e.stopPropagation();
			setSidebarOpen(false);
		}
	};

	
	useEffect(
		() => {
			let isAdded = noteViewerIntent.hasUnsavedChanges;
			if (isAdded) {
				window.addEventListener('beforeunload', unsavedChangesListener);
			}
			return () => {
				if (isAdded) {
					window.removeEventListener('beforeunload', unsavedChangesListener);
				}
			};
		},
		[noteViewerIntent.hasUnsavedChanges]
	);

	const donateFormRef = useRef<HTMLFormElement>(null);

	return <div className="SecureBook">
		{
			<aside className={`SecureBook__Sidebar ${
				(isOptionalSidebar && !isSidebarOpen) ? `SecureBook__Sidebar--hidden` : ``
			}`}>
				<article className="SecureBook__SidebarTop">
					<button
						title="Add note"
						onClick={() => {
							noteManager.createNoteAndSelect();
							setSidebarOpen(false);
						}}
					>
						<Icon type="add_box" />
					</button>
					<Tags
						iconType="search"
						type="text"
						placeholder="Tag search"
						className="SecureBook__TagSearch"
						tags={tagSearch}
						onTagsChange={setTagSearch}
					/>
				</article>
				<section className="SecureBook__Notes">
					{
						notes.status === 'loading'
							?
								<Fragment>
									<TextLoading className="SecureBook__Loading" />
									<TextLoading className="SecureBook__Loading" />
									<TextLoading className="SecureBook__Loading" />
								</Fragment>
							:
						noteResultingList.length === 0 && notes.status === 'loaded'
							?
								<div className="SecureBook__EmptyNotes">
									No notes are currently added. To add a note, click <Icon type="add_box" /> above.
								</div>
							:
								noteResultingList.map(note =>
									<NoteItem
										note={note}
										isDirty={!!notes.dirty[note.id]}
										selectedId={notes.selectedId}
										focusedId={focusedId}
										setSidebarOpen={setSidebarOpen}
										getTriggerProps={getTriggerProps}
										contextMenuId={contextMenuId}
										contextMenuProps={contextMenuProps}
									/>)
					}
				</section>
			</aside>
		}
		<main
			className={`SecureBook__Main ${
				isOptionalSidebar && isSidebarOpen
					? `SecureBook__Main--under-sidebar`
					: ``
			} ${
				isEditorSpinnerShown
					? `SecureBook__Main--loading`
					: ``
			}`}
			onClickCapture={onMainClick}
		>
			{
				isEditorSpinnerShown &&
					<LoadingSpinner className="SecureBook__MainLoading" />
			}
			<div
				className={`SecureBook__MainTop ${
					isOptionalSidebar && isSidebarOpen
						? `SecureBook__MainTop--under-sidebar`
						: ``
				}`}
				onClickCapture={onMainClick}
			>
				{
					isOptionalSidebar &&
						<button
							className="SecureBook__OpenMenu"
							onClick={() => setSidebarOpen(true)}
						>
							<Icon type="notes" />
						</button>
				}
				<EditorMenu className="SecureBook__Menu" />
				<button
					ref={settingsRef}
					className="SecureBook__Settings"
					onClick={() => setSettingsOpen(!isSettingsOpen)}
				>
					<Icon type="more_vert" />
				</button>
				{
					isSettingsOpen && <ContextMenu
							relativeRef={settingsRef}
							onClose={() => setSettingsOpen(false)}
						>
							<DropDown>
								<DropDownItem
									labelProps={{ className: "SecureBook__DarkModeChk" }}
									onClick={() => { darkMode.isDarkMode = !darkMode.isDarkMode; }}
									label="Dark mode"
								>
									<Checkbox isChecked={darkMode.isDarkMode} className="SecureBook__SettingsIcon" />
									<span>Dark mode</span>
								</DropDownItem>
								<DropDownItem
									onClick={() => donateFormRef.current.submit()}
									label="Donate"
								>
									<Donate formRef={donateFormRef}>
										<span className="SecureBook__SettingsIcon">❤️</span>
										<span>Donate</span>
									</Donate>
								</DropDownItem>
								<DropDownItem
									isLink
									iconType="github"
									href="https://github.com/securebook/securebook.github.io"
									label="View on Github"
								/>
								<DropDownItem
									isLink
									iconType="bug_report"
									href="https://github.com/securebook/securebook.github.io/issues"
									label="Report an issue"
								/>
								<DropDownItem
									iconType="exit_to_app"
									onClick={() => {
										if (!noteViewerIntent.hasUnsavedChanges || isConfirmedUnsavedChanges()) {
											auth.logout();
										}
									}}
									label="Log out"
								/>
							</DropDown>
						</ContextMenu>
				}
			</div>
			{
				!notes.selected && notes.status === 'loaded'
					? <div className="SecureBook__EditorEmpty">
						Note is not selected. You can select a note, or add a new one in the sidebar{
							isOptionalSidebar &&
								<Fragment> by clicking <Icon type="notes" /></Fragment>}.
					</div>
					: !!notes.selected && <Fragment>
						<div className="SecureBook__Editor">
							<EditorPresenter
								disabled={!isContentLoaded}
								showTextLoading={!!isContentLoading}
								contentId={contentId}
								content={notes.selected.content.value}
								onContentChange={(text, content) => {
									noteManager.updateSelectedNoteContent(text, content);
								}}
							/>
						</div>
						<div className="SecureBook__BottomBar">
							<button
								className="SecureBook__SaveButton"
								onClick={() => noteManager.saveSelectedNote()}
							>
								<Icon type="save" />
								{
									notes.selected.content.status === 'creating' ||
									notes.selected.content.status === 'updating'
										? <span>Saving...</span> :
									notes.selected.content.status === 'loading'
										? <span>Loading...</span>
										: <span>Save</span>
								}
							</button>
							<Tags
								key={contentId}
								isNewAllowed
								isChangedOnInput
								className="SecureBook__AddTags"
								iconType="local_offer"
								placeholder="Add tags"
								direction={{ v: 'top', h: 'left' }}
								tags={notes.selected.tags}
								onTagsChange={tags => noteManager.updateSelectedNoteTags(tags)}
							/>
							{
								!!(notes.selectedId && notes.dirty[notes.selectedId]) && <button
									className="SecureBook__CancelButton"
									onClick={() => noteManager.cancelSelectedNoteChanges()}
								>
									<Icon type="cancel" /><span>Cancel</span>
								</button>
							}
						</div>
					</Fragment>
			}
		</main>
		<PasswordDialog />
	</div>;
}

export default connect(SecureBook);