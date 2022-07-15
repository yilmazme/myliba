import Swal, { SweetAlertIcon } from 'sweetalert2';

class CAlertService {
  Alert(
    title: string,
    message: string | HTMLElement,
    type: 'success' | 'info' | 'warning' | 'error' | 'question' | null = null,
    // icon: undefined,
    showConfirmButton: boolean = true,
    showCancelButton: boolean = false,
    confirmButtonText: string = 'OK',
    cancelButtonText: string = 'Cancel',
    showIcon: boolean = true,
    question: boolean = false
  ) {
    return Swal.fire({
      title,
      html: message,
      icon: type as SweetAlertIcon,
      showCloseButton: true,
      showConfirmButton,
      showCancelButton,
      confirmButtonText,
      cancelButtonText,
      customClass: {
        container: `alert-${type} ${
          !showCancelButton ? 'hide-cancel-btn' : ''
        } ${showIcon ? 'title-icon title-icon-' + type : ''}`,
      },
    });
  }
}

const AlertService = new CAlertService();
export default AlertService;
