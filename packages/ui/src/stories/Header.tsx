import React from 'react';

import { Button } from '../components/ui/button.js';
import './header.css';
import { BrandIcon } from '@aazucena/icons';

type User = {
  name: string;
};

export interface HeaderProps {
  user?: User;
  onLogin?: () => void;
  onLogout?: () => void;
  onCreateAccount?: () => void;
}

export const Header = ({ user, onLogin, onLogout, onCreateAccount }: HeaderProps) => (
  <header>
    <div className="storybook-header">
      <div>
        <BrandIcon className="h-8 w-8 text-[#555AB9]" />
        <h1>Acme</h1>
      </div>
      <div>
        {user ? (
          <>
            <span className="welcome">
              Welcome, <b>{user.name}</b>!
            </span>
            <Button size="sm" onClick={onLogout}>
              Log out
            </Button>
          </>
        ) : (
          <>
            <Button size="sm" onClick={onLogin}>
              Log in
            </Button>
            <Button size="sm" onClick={onCreateAccount}>
              Sign up
            </Button>
          </>
        )}
      </div>
    </div>
  </header>
);
