import { h, Fragment } from 'preact';
import Welcome from '@components/Welcome';
import SecureBook from '@components/SecureBook';
import { connect } from '@view/connect';
import { useContext } from 'preact/hooks';
import { StoreContext } from '@view/StoreContext';
import { Portals } from '@components/Portals';
import { AppContextProvider } from '@components/AppContext';

function App() {
	const { authData } = useContext(StoreContext);

	return (
		<Fragment>
			{
				authData.data.status !== "Authenticated"
					? <Welcome />
					: <SecureBook />
			}
			<AppContextProvider />
			<Portals />
		</Fragment>
	);
}

export default connect(App);