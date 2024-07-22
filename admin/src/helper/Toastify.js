import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const notifySuccess = message =>
  toast.success(message, {
    position: 'top-left',
    autoClose: 2500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined
  });

const notifyError = message =>
  toast.error(message, {
    position: 'top-left',
    autoClose: 2500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined
  });

const ToastifyContainer = () => (
  <ToastContainer
    position="top-left"
    autoClose={2500}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
  />
);

export { ToastifyContainer as ToastContainer, notifySuccess, notifyError };
