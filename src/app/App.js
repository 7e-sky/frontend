import React from 'react';
import { FuseAuthorization, FuseLayout, FuseTheme } from '@fuse';
import Provider from 'react-redux/es/components/Provider';
import { Router } from 'react-router-dom';
import jssExtend from 'jss-extend';
import history from '@history';
import { Auth } from './auth';
import store from './store';
import AppContext from './AppContext';
import routes from './fuse-configs/routesConfig';
import ScrollToTop from './ScrollToTop';
import { create } from 'jss';
import { StylesProvider, jssPreset, createGenerateClassName } from '@material-ui/styles';
import CookieConsent, { Cookies } from "react-cookie-consent";
//import routesConfig from './fuse-configs/routesConfig'; // Assurez-vous que le chemin est correct

const jss = create({
    ...jssPreset(),
    plugins: [...jssPreset().plugins, jssExtend()],
    insertionPoint: document.getElementById('jss-insertion-point'),
});
const generateClassName = createGenerateClassName();

const App = () => {

    return (
        <AppContext.Provider
            value={{
                routes
            }}
        >
            <StylesProvider jss={jss} generateClassName={generateClassName}>
                <Provider store={store}>
                    <Auth>
                        <Router history={history}>
                            <ScrollToTop />
                            <FuseAuthorization>
                                <FuseTheme>
                                    <FuseLayout />
                                    <CookieConsent
                                        location="top"
                                        buttonText="J'accepte"
                                        buttonClasses="uppercase font-bold rounded-full"
                                        cookieName="Les Achats Indsutriels Cookies "
                                        style={{ background: "rgba(0,0,0,0.7)" }}
                                        buttonStyle={{ color: "#fff", background: "#f48d35", fontSize: "13px", borderRaduis: '50px' }}
                                        expires={150}
                                    >
                                        En poursuivant votre navigation sur ce site, vous acceptez l’utilisation de cookies pour nous permettre de réaliser des statistiques de visites.
                                    </CookieConsent>
                                </FuseTheme>
                            </FuseAuthorization>
                        </Router>
                    </Auth>
                </Provider>
            </StylesProvider>
        </AppContext.Provider>
    );
};

export default App;

