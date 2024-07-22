import LeftSidebar from './components/LeftSidebar';
import PageContent from './components/PageContent';

function ProtectedLayout() {
  return (
    <>
      <div className="drawer drawer-mobile">
        <LeftSidebar />
        <PageContent />
      </div>
    </>
  );
}

export default ProtectedLayout;
