import { connectFactory } from "typeconnect";
import { Store } from "@interfaces/Store";
import { Managers } from "@interfaces/Managers";
import { Connected } from "@interfaces/Connected";
import { createRenderer } from "@data/createRenderer";
import { Crypter } from "@view/Crypter";
import { createLocation } from "@view/createLocation";
import { QueryBuilder } from "@modules/QueryBuilder";
import { createIntents } from "@data/createIntents";
import { createGitlabNotifyAuth } from "@data/createGitlabNotifyAuth";
import { GitlabAuth } from "@modules/GitlabAuth";
import { LocationManager } from "@view/LocationManager";
import { gitlabConfig } from "@configs/Gitlab";
import { createGitlabAuthData } from "@data/createGitlabAuthData";
import { GitlabAuthStorage } from "@modules/GitlabAuthStorage";
import { PathManager } from "@modules/PathManager";
import { createNoteViewerIntent } from "@data/createNoteViewerIntent";
import { GitlabFilesystem } from "@modules/GitlabFilesystem";
import { GitlabRequest } from "@modules/GitlabRequest";
import { GitlabProjectManager } from "@modules/GitlabProjectManager";
import { createGitlabData } from "@data/createGitlabData";
import { Request } from "@view/Request";
import { GitlabCommits } from "@modules/GitlabCommits";
import { createPassword } from "@data/createPassword";
import { createNotes, getDefaultNote } from "@data/createNotes";
import { NoteManager } from "@modules/NoteManager";
import { PasswordManager } from "@modules/PasswordManager";
import { createEntityData } from "@data/createEntityData";
import { NoteContent, Note } from "@interfaces/Notes";
import { EntityManager } from "@modules/EntityManager";
import { createEditor } from "@editor/createEditor";
import { AuthURLStorage } from "@modules/AuthURLStorage";
import { createDarkMode } from "@view/createDarkMode";
import { PassStorage } from "@view/PassStorage";
import { EncryptedFilesystem } from "@modules/EncryptedFilesystem";

export function createApp(): [Connected, Store, Managers] {
	const connected: Connected = {
		createRenderer: connectFactory(createRenderer),
		createLocation: connectFactory(createLocation),
		createGitlabNotifyAuth: connectFactory(createGitlabNotifyAuth),
		createGitlabAuthData: connectFactory(createGitlabAuthData),
		createIntents: connectFactory(createIntents),
		createNoteViewerIntent: connectFactory(createNoteViewerIntent),
		createGitlabData: connectFactory(createGitlabData),
		createPassword: connectFactory(createPassword),
		// @ts-ignore: Not sure how to deal with generics in the following case
		createEntityData: connectFactory(createEntityData),
		createNotes: connectFactory(createNotes),
		createDarkMode: connectFactory(createDarkMode),
	};

	const crypter = new Crypter();
	const queryBuilder = new QueryBuilder();
	const location = connected.createLocation(queryBuilder);
	const locationManager = new LocationManager(location);
	const gitlabAuthStorage = new GitlabAuthStorage();
	const gitlabAuthData = connected.createGitlabAuthData();
	const authURLStorage = new AuthURLStorage(location, locationManager);
	const passStorage = new PassStorage();
	const gitlabAuth = new GitlabAuth(locationManager, gitlabConfig, queryBuilder, gitlabAuthStorage, gitlabAuthData, authURLStorage, passStorage);
	const pathManager = new PathManager(locationManager, authURLStorage);
	connected.createGitlabNotifyAuth(location, pathManager, gitlabAuth);
	const gitlabProjectManager = new GitlabProjectManager(gitlabAuthData, gitlabConfig);
	const gitlabData = connected.createGitlabData();
	const request = new Request();
	const gitlabRequest = new GitlabRequest(gitlabAuthData, gitlabProjectManager, gitlabConfig, gitlabData, request);
	const gitlabCommits = new GitlabCommits(gitlabRequest);
	const filesystem = new GitlabFilesystem(gitlabRequest, gitlabCommits, queryBuilder);
	const password = connected.createPassword(passStorage);
	const passwordManager = new PasswordManager(password, passStorage);
	const notesEntityData = connected.createEntityData<NoteContent, Note>();
	const notes = connected.createNotes(location, notesEntityData);
	const encryptedFilesystem = new EncryptedFilesystem(filesystem, password, crypter);
	const noteEntityManager = new EntityManager<NoteContent,Note>('notes', notesEntityData, encryptedFilesystem, getDefaultNote);
	const noteManager = new NoteManager(notes, noteEntityManager, pathManager);
	const noteViewerIntent = connected.createNoteViewerIntent(location, gitlabAuthData, password, notes, noteManager);
	const editor = createEditor();
	const darkMode = connected.createDarkMode();
	
	const intents = connected.createIntents([
		noteViewerIntent,
	]);

	return [
		connected,
		{
			darkMode,
			intents,
			authData: gitlabAuthData,
			password,
			notes,
			editor,
			noteViewerIntent,
		},
		{
			crypter,
			auth: gitlabAuth,
			filesystem,
			passwordManager,
			noteManager,
			locationManager,
		}
	]
}