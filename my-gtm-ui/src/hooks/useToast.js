import { toast } from 'react-toastify';

const useToast = () => {
  return ({ type = 'info', message, options = {} }) => {
    const config = {
      position: 'top-right',
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progressClassName: `toast-progress-${type}`, // color-matching bar
      ...options,
    };

    // Show the toast based on type
    toast[type](message, config); // e.g., toast({ type: 'success', message: "..." })
  };
};

export default useToast;