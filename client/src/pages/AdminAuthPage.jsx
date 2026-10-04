// client/src/pages/AdminAuthPage.jsx
import React from 'react';
import { AuthPage } from './AuthPage.jsx';

export const AdminAuthPage = ({ onSwitchToUserAuth }) => {
  return (
    <AuthPage
      initialRole="admin"
      onRoleChange={(newRole) => {
        if (newRole === 'user' && onSwitchToUserAuth) {
          onSwitchToUserAuth();
        }
      }}
    />
  );
};
