import { createContext } from 'react';

type accountContextType = {
  account: string;
};

const accountContextDefaultValues: accountContextType = {
  account: '',
};

export const AccountContext = createContext<accountContextType>(
  accountContextDefaultValues
);
