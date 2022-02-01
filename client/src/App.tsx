// @ts-nocheck
import AsyncRoute from 'preact-async-route';
import Router from 'preact-router';
import { FC, useEffect, useState } from 'react';
import Spinner from './components/elements/Spinner/Spinner';
import { createHashHistory } from 'history';

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
            path={'/:about'}
            getComponent={(): Promise<FC> =>
              import('./components/pages/TextOnlyPage/TextOnlyPage').then(
                (module) => module.default
              )
            }
          />
          <AsyncRoute
            path={'/:abuse'}
            getComponent={(): Promise<FC> =>
              import('./components/pages/TextOnlyPage/TextOnlyPage').then(
                (module) => module.default
              )
            }
          />
          <AsyncRoute
            path={'/:contact'}
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
            path={'/:privacy'}
            getComponent={(): Promise<FC> =>
              import('./components/pages/TextOnlyPage/TextOnlyPage').then(
                (module) => module.default
              )
            }
          />
          <AsyncRoute
            path={'/profile/:username?'}
            getComponent={(): Promise<FC> =>
              import('./components/pages/Profile/Profile').then((module) => module.default)
            }
          />
          <AsyncRoute
            path={'/:resources'}
            getComponent={(): Promise<FC> =>
              import('./components/pages/TextOnlyPage/TextOnlyPage').then(
                (module) => module.default
              )
            }
          />
          <AsyncRoute
            path={'/:terms'}
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
