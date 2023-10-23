import { Toast } from 'flowbite-react';
import { useEffect, useState } from 'react';

type CustomToastProps = {
  children: React.ReactNode;
  durationMilliseconds?: number;
};
export const CustomToast = ({
  children,
  durationMilliseconds = 3000,
}: CustomToastProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(false);
    }, durationMilliseconds);

    return () => {
      clearTimeout(timeout);
    };
  }, [durationMilliseconds]);

  return visible ? <Toast>{children}</Toast> : null;
};
