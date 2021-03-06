import { h } from "preact";
import "@styles/Welcome.scss";
import { connect } from "@view/connect";
import { useContext } from "preact/hooks";
import { StoreContext } from "@view/StoreContext";
import { ManagersContext } from "@view/ManagersContext";
import Link from "@components/Link";

function Welcome() {
	const { authData } = useContext(StoreContext);
	const { auth } = useContext(ManagersContext);

	return (
		<main className="Welcome">
			<article className="Welcome__WelcomeCard">
				<h1 className="Welcome__Header Welcome__AppName">Secure Book</h1>
				<section className="Welcome__Information">
					<p><span className="Welcome__AppName">Secure Book</span> is a free private note-taking web application. It provides convenient note editing and encrypted storage using <strong>aes-256</strong> standard.</p>
				</section>
				<section className="Welcome__HowSection">
					<h2 className="Welcome__How">How does it work?</h2>
					<ol className="Welcome__HowList">
						<li className="Welcome__HowListItem">
							<p>Sign in / sign up via GitLab. GitLab is a service that allows you to create private repositories and store content inside of them.</p>
							<p><strong className="Welcome__Note">Note</strong>: if you'd like to sign up via Google, GitHub, Twitter, etc, please <Link className="Welcome__Link" href="https://gitlab.com/users/sign_up">Sign Up here</Link> and accept <strong>Terms and Conditions</strong> before entering the app.</p>
						</li>
						<li className="Welcome__HowListItem">Choose a password for your notes. Nobody will be able to read the contents of the notes without knowing the password.</li>
						<li className="Welcome__HowListItem">Create, edit and delete notes.</li>
					</ol>
				</section>
				{
					authData.data.error ?
					<section className="Welcome__CredentialsError">
						Error: {authData.data.error}. {authData.data.errorDescription}
					</section> :
					null
				}
				<button className="Welcome__LoginButton" onClick={() => { auth.login(); }}>
					Login via GitLab
				</button>
			</article>
		</main>
	);
}

export default connect(Welcome);