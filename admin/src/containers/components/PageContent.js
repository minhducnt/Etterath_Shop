import { Route, Routes } from 'react-router-dom';

import { lazy } from 'react';
import { useEffect, useRef } from 'react';

import { useSelector } from 'react-redux';

import routes from '../../routes/ProtectedSidebar';

import Header from './Header';

const Page404 = lazy(() => import('../../pages/error/NotFound'));

function PageContent() {
  const mainContentRef = useRef(null);
  const { pageTitle } = useSelector(state => state.header);

  useEffect(() => {
    mainContentRef.current.scroll({
      top: 0,
      behavior: 'smooth'
    });
  }, [pageTitle]);

  return (
    <div className="drawer-content flex flex-col">
      <Header />
      <main className="flex-1 overflow-y-auto p-6 bg-base-200" ref={mainContentRef}>
        <Routes>
          {routes.map((route, key) => {
            return <Route key={key} exact={true} path={`${route.path}`} element={<route.component />} />;
          })}

          <Route path="*" element={<Page404 />} />
        </Routes>
      </main>
    </div>
  );
}

export default PageContent;
