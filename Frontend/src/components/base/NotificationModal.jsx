import React from 'react';
import { Button, Dialog, DialogTrigger, Heading, Modal, ModalOverlay } from 'react-aria-components';
import { CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';

// Icon mapping for different notification types
const iconMap = {
  success: { Icon: CheckCircle, color: 'text-green-500' },
  error: { Icon: XCircle, color: 'text-red-500' },
  warning: { Icon: AlertTriangle, color: 'text-yellow-500' },
  info: { Icon: Info, color: 'text-blue-500' }
};

/**
 * NotificationModal - A reusable modal for displaying messages to users
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls modal visibility
 * @param {function} props.onClose - Callback when modal closes
 * @param {string} props.title - Modal title
 * @param {string} props.message - Modal message content
 * @param {string} props.type - Type of notification: 'success', 'error', 'warning', 'info'
 * @param {string} props.confirmText - Text for confirm button (default: 'OK')
 * @param {string} props.cancelText - Text for cancel button (optional)
 * @param {function} props.onConfirm - Callback for confirm action
 * @param {function} props.onCancel - Callback for cancel action
 */
export function NotificationModal({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  confirmText = 'OK',
  cancelText,
  onConfirm,
  onCancel
}) {
  const { Icon, color } = iconMap[type] || iconMap.info;

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose();
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={onClose}
      isDismissable
      className={({ isEntering, isExiting }) => `
        fixed inset-0 z-50 bg-black/25 backdrop-blur isolate
        ${isEntering ? 'animate-in fade-in duration-300 ease-out' : ''}
        ${isExiting ? 'animate-out fade-out duration-200 ease-in' : ''}
      `}
    >
      <Modal
        className={({ isEntering, isExiting }) => `
          fixed inset-0 flex items-center justify-center p-4 text-center
          ${isEntering ? 'animate-in zoom-in-95 ease-out duration-300' : ''}
          ${isExiting ? 'animate-out zoom-out-95 ease-in duration-200' : ''}
        `}
      >
        <Dialog
          className="max-w-lg w-full max-h-[90vh] overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left shadow-xl outline-none relative"
        >
          {({ close }) => (
            <>
              <Heading
                slot="title"
                className="text-xl font-semibold leading-6 my-0 text-gray-900 dark:text-white pr-8"
              >
                {title}
              </Heading>
              <div className={`w-6 h-6 ${color} absolute right-6 top-6 stroke-2`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="mt-3 text-gray-600 dark:text-gray-300 max-h-96 overflow-y-auto">
                {typeof message === 'string' && message.includes('\n') ? (
                  <div className="space-y-3">
                    {message.split('\n\n').map((section, idx) => (
                      <div key={idx}>
                        {section.split('\n').map((line, lineIdx) => {
                          if (line.startsWith('•')) {
                            return (
                              <div key={lineIdx} className="flex items-start gap-2 ml-2 mb-1">
                                <span className="text-green-500 mt-0.5">✓</span>
                                <span className="text-sm">{line.substring(1).trim()}</span>
                              </div>
                            );
                          }
                          return <p key={lineIdx} className={line ? 'mb-2' : 'mb-1'}>{line}</p>;
                        })}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>{message}</p>
                )}
              </div>
              <div className="mt-6 flex justify-end gap-2">
                {cancelText && (
                  <DialogButton
                    className="bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                    onClick={() => {
                      handleCancel();
                      close();
                    }}
                  >
                    {cancelText}
                  </DialogButton>
                )}
                <DialogButton
                  className={getConfirmButtonClass(type)}
                  onClick={() => {
                    handleConfirm();
                    close();
                  }}
                >
                  {confirmText}
                </DialogButton>
              </div>
            </>
          )}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}

/**
 * DialogButton - Styled button for modal actions
 */
function DialogButton({ className, ...props }) {
  return (
    <Button
      {...props}
      className={`inline-flex justify-center rounded-md border border-solid border-transparent px-5 py-2 font-semibold text-base transition-colors cursor-pointer outline-none focus-visible:ring-2 ring-blue-500 ring-offset-2 ${className}`}
    />
  );
}

/**
 * Get button styling based on notification type
 */
function getConfirmButtonClass(type) {
  const classes = {
    success: 'bg-green-500 text-white hover:bg-green-600',
    error: 'bg-red-500 text-white hover:bg-red-600',
    warning: 'bg-yellow-500 text-white hover:bg-yellow-600',
    info: 'bg-blue-500 text-white hover:bg-blue-600'
  };
  return classes[type] || classes.info;
}

/**
 * Hook for managing notification modal state
 * 
 * @returns {Object} { showNotification, NotificationComponent }
 * 
 * @example
 * const { showNotification, NotificationComponent } = useNotification();
 * 
 * // Show success message
 * showNotification({
 *   title: 'Success!',
 *   message: 'Your account has been created.',
 *   type: 'success'
 * });
 * 
 * // In JSX
 * return (
 *   <>
 *     {NotificationComponent}
 *     <button onClick={() => showNotification({...})}>Show</button>
 *   </>
 * );
 */
export function useNotification() {
  const [notification, setNotification] = React.useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    confirmText: 'OK',
    cancelText: null,
    onConfirm: null,
    onCancel: null
  });

  const showNotification = (config) => {
    setNotification({
      isOpen: true,
      title: config.title || 'Notification',
      message: config.message || '',
      type: config.type || 'info',
      confirmText: config.confirmText || 'OK',
      cancelText: config.cancelText || null,
      onConfirm: config.onConfirm || null,
      onCancel: config.onCancel || null
    });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, isOpen: false }));
  };

  const NotificationComponent = (
    <NotificationModal
      {...notification}
      onClose={hideNotification}
    />
  );

  return { showNotification, hideNotification, NotificationComponent };
}

/**
 * Trigger-based NotificationModal - For use with DialogTrigger
 * 
 * @example
 * <NotificationModalTrigger
 *   title="Delete Account"
 *   message="Are you sure you want to delete your account?"
 *   type="error"
 *   confirmText="Delete"
 *   cancelText="Cancel"
 *   onConfirm={() => console.log('Deleted')}
 * >
 *   <Button>Delete Account</Button>
 * </NotificationModalTrigger>
 */
export function NotificationModalTrigger({
  children,
  title,
  message,
  type = 'info',
  confirmText = 'OK',
  cancelText,
  onConfirm,
  onCancel
}) {
  const { Icon, color } = iconMap[type] || iconMap.info;

  return (
    <DialogTrigger>
      {children}
      <ModalOverlay
        className={({ isEntering, isExiting }) => `
          fixed inset-0 z-50 bg-black/25 backdrop-blur isolate
          ${isEntering ? 'animate-in fade-in duration-300 ease-out' : ''}
          ${isExiting ? 'animate-out fade-out duration-200 ease-in' : ''}
        `}
      >
        <Modal
          className={({ isEntering, isExiting }) => `
            fixed inset-0 flex items-center justify-center p-4 text-center
            ${isEntering ? 'animate-in zoom-in-95 ease-out duration-300' : ''}
            ${isExiting ? 'animate-out zoom-out-95 ease-in duration-200' : ''}
          `}
        >
          <Dialog
            className="max-w-md w-full max-h-full overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left shadow-xl outline-none relative"
          >
            {({ close }) => (
              <>
                <Heading
                  slot="title"
                  className="text-xl font-semibold leading-6 my-0 text-gray-900 dark:text-white pr-8"
                >
                  {title}
                </Heading>
                <div className={`w-6 h-6 ${color} absolute right-6 top-6 stroke-2`}>
                  <Icon className="w-6 h-6" />
                </div>
                <p className="mt-3 text-gray-600 dark:text-gray-300">
                  {message}
                </p>
                <div className="mt-6 flex justify-end gap-2">
                  {cancelText && (
                    <DialogButton
                      className="bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                      onClick={() => {
                        if (onCancel) onCancel();
                        close();
                      }}
                    >
                      {cancelText}
                    </DialogButton>
                  )}
                  <DialogButton
                    className={getConfirmButtonClass(type)}
                    onClick={() => {
                      if (onConfirm) onConfirm();
                      close();
                    }}
                  >
                    {confirmText}
                  </DialogButton>
                </div>
              </>
            )}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}
