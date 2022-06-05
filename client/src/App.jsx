import React, { useContext, useState, useEffect } from 'react';
import 'react-app-polyfill/stable';

import './App.scss';

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  useHistory,
} from 'react-router-dom';

import PrivateRoute from './routes/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import { GlobalDataProvider } from './context/GlobalDataContext';
import ReactResizeDetector from 'react-resize-detector';

import { PubSub } from './services/PubSub';

import PrivacyPolicy from './components/privacyPolicy/PrivacyPolicy.jsx';
import Login from './components/login/Login.jsx';
import HrHome from './components/hR/HrHome';
import ExeHome from './components/executives/ExeHome';
import CustomerHome from './components/customer/CustomerHome';

import { SnackbarProvider } from 'notistack';
import NotiStack from './reUseComponents/notiStack/NotiStack.jsx';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faCheckSquare,
  faCoffee,
  faBell,
  faCheckCircle,
  faExclamationCircle,
  faTachometerAlt,
  faUser,
  faEnvelope,
  faKey,
  faHome,
  faUsers,
  faArrowAltCircleRight,
  faNotesMedical,
  faHospital,
  faPencilAlt,
  faEye,
  faCube,
  faWrench,
  faCartArrowDown,
  faLifeRing,
  faCreditCard,
  faCalendarCheck,
  faListAlt,
  faLongArrowAltLeft,
  faTimes,
  faAngleDown,
  faTrashAlt,
  faArrowRight,
  faLock,
  faLockOpen,
  faPlus,
  faChevronLeft,
  faChevronRight,
  faChevronDown,
  faEllipsisV,
  faShareSquare,
  faSearch,
  faSortAmountUp,
  faFilter,
  faShoppingCart,
  faBuilding,
  faUserTie,
  faCogs,
  faDownload,
  faUserEdit,
  faCalendarAlt,
  faTimesCircle,
  faUpload,
  faQuestionCircle,
  faEdit,
  faPenSquare,
  faRupeeSign,
  faChartBar,
} from '@fortawesome/free-solid-svg-icons';

library.add(
  faCheckSquare,
  faCoffee,
  faBell,
  faCheckCircle,
  faExclamationCircle,
  faTachometerAlt,
  faUser,
  faEnvelope,
  faKey,
  faHome,
  faUsers,
  faArrowAltCircleRight,
  faNotesMedical,
  faHospital,
  faPencilAlt,
  faEye,
  faCube,
  faWrench,
  faCartArrowDown,
  faLifeRing,
  faCreditCard,
  faCalendarCheck,
  faListAlt,
  faLongArrowAltLeft,
  faTimes,
  faAngleDown,
  faTrashAlt,
  faArrowRight,
  faLock,
  faLockOpen,
  faPlus,
  faChevronLeft,
  faChevronRight,
  faChevronDown,
  faEllipsisV,
  faShareSquare,
  faSearch,
  faSortAmountUp,
  faFilter,
  faShoppingCart,
  faBuilding,
  faUserTie,
  faCogs,
  faDownload,
  faUserEdit,
  faCalendarAlt,
  faTimesCircle,
  faUpload,
  faQuestionCircle,
  faEdit,
  faPenSquare,
  faRupeeSign,
  faChartBar
);

const App = () => {
  const [responseNotifiedData, setResponseNotifiedData] = useState(null);
  useEffect(() => {
    windowOnResize(window.innerWidth);
    PubSub.subscribe(PubSub.events.SNACKBAR_PROVIDER, (data) => {
      setResponseNotifiedData(data);
    });

    return () => {
      PubSub.unsubscribe(PubSub.events.SNACKBAR_PROVIDER);
    };
  });
  const windowOnResize = (width) => {
    if (width < 768) {
      PubSub.publish(PubSub.events.IS_MOBILE, true);
    } else {
      PubSub.publish(PubSub.events.IS_MOBILE, false);
    }
  };
  return (
    <div className="App">
      <ReactResizeDetector
        handleWidth
        handleHeight
        refreshMode="debounce"
        refreshRate={200}
        onResize={windowOnResize}
      >
        <Router>
          <AuthProvider>
            <GlobalDataProvider>
              <Switch>
                <Route path="/privacy-policy" component={PrivacyPolicy} />
                <Route path="/login" component={Login} />
                <PrivateRoute exact path="/" component={HrHome} />
                <Route path="/hr-home" component={HrHome} />
                <Route path="/executive-home" component={ExeHome} />
                <Route path="/customer-home" component={CustomerHome} />
              </Switch>

              {responseNotifiedData ? (
                <SnackbarProvider>
                  <NotiStack dataModel={responseNotifiedData} />
                </SnackbarProvider>
              ) : null}
            </GlobalDataProvider>
          </AuthProvider>
        </Router>
      </ReactResizeDetector>
    </div>
  );
};

export default App;
