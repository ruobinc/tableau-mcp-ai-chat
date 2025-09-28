import { type FC, type ReactNode } from 'react';

import { tableauUserName } from '../../config/tableau';
import { JWTProvider } from '../../providers/JWTProvider';

interface JWTPageWrapperProps {
  children: ReactNode;
  username?: string;
}

const JWTPageWrapper: FC<JWTPageWrapperProps> = ({ children, username = tableauUserName }) => {
  return (
    <JWTProvider defaultUsername={username || 'default-user'} prefetchDefaultToken>
      {children}
    </JWTProvider>
  );
};

export default JWTPageWrapper;
