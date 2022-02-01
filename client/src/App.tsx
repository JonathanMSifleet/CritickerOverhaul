import { createHashHistory } from 'history';
import AsyncRoute from 'preact-async-route';
import Router from 'preact-router';
import { FC, useEffect, useState } from 'react';
import Spinner from './components/elements/Spinner/Spinner';

const App: FC = () => {
  const [fontReady, setFontReady] = useState(false);

  useEffect(() => {
    document.fonts.load('1rem "Roboto"').then(() => {
      setFontReady(true);
    });
  }, []);

  return (
    <>
      {fontReady ? (
        <Router history={createHashHistory()}>
          <AsyncRoute
            path={'/'}
            getComponent={(): Promise<FC> =>
              import('./components/pages/Home/Home').then((module) => module.default)
            }
          />
          <AsyncRoute
            path={'/information/:about'}
            getComponent={(): Promise<FC> =>
              import('./components/pages/TextOnlyPage/TextOnlyPage').then(
                (module) => module.default
              )
            }
          />
          <AsyncRoute
            path={'/information/:abuse'}
            getComponent={(): Promise<FC> =>
              import('./components/pages/TextOnlyPage/TextOnlyPage').then(
                (module) => module.default
              )
            }
          />
          <AsyncRoute
            path={'/information/:contact'}
            getComponent={(): Promise<FC> =>
              import('./components/pages/TextOnlyPage/TextOnlyPage').then(
                (module) => module.default
              )
            }
          />
          <AsyncRoute
            path={'/film/:id'}
            getComponent={(): Promise<FC> =>
              import('./components/pages/Film/Film').then((module) => module.default)
            }
          />
          <AsyncRoute
            path={'/information/:privacy'}
            getComponent={(): Promise<FC> =>
              import('./components/pages/TextOnlyPage/TextOnlyPage').then(
                (module) => module.default
              )
            }
          />
          <AsyncRoute
            path={'/profile/'}
            getComponent={(): Promise<FC> =>
              import('./components/pages/Profile/Profile').then((module) => module.default)
            }
          />
          <AsyncRoute
            path={'/information/:resources'}
            getComponent={(): Promise<FC> =>
              import('./components/pages/TextOnlyPage/TextOnlyPage').then(
                (module) => module.default
              )
            }
          />
          <AsyncRoute
            path={'/information/:terms'}
            getComponent={(): Promise<FC> =>
              import('./components/pages/TextOnlyPage/TextOnlyPage').then(
                (module) => module.default
              )
            }
          />
          {/* to do: <AsyncRoute
            path={'/*'}
            getComponent={(): Promise<FC> =>
              import('./components/pages/Home/Home').then((module) => module.default)
            }
          /> */}
        </Router>
      ) : (
        <Spinner />
      )}
    </>
  );
};

export default App;
