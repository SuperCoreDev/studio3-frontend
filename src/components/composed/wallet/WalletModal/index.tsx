import React, { FC, SyntheticEvent, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import type { WalletName } from '@solana/wallet-adapter-base';

import styles from './index.module.scss';

import Dialog from '@/components/based/Dialog';
import WalletListItem from '@/components/composed/wallet/WalletListItem';
import {
  useUpdateAuthToken,
  useUpdateAuthWallet,
} from '@/state/application/hooks';

interface IWalletModal {
  open: boolean;
  onClose: () => void;
}

const WalletModal: FC<IWalletModal> = ({ open, onClose }) => {
  const { wallets, select, wallet } = useWallet();
  const updateAuthToken = useUpdateAuthToken();
  const updateAuthWallet = useUpdateAuthWallet();

  const handleWalletClick = useCallback(
    (_: SyntheticEvent, walletName: WalletName) => {
      if (wallet && wallet.adapter.name !== walletName) {
        updateAuthToken(null);
        updateAuthWallet(null);
      }
      select(walletName);
      onClose();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [select, onClose]
  );

  return (
    <Dialog title="Connect a wallet" open={open} onClose={onClose}>
      <div className={styles.wallets}>
        {wallets.map((wallet) => (
          <WalletListItem
            key={wallet.adapter.name}
            onClick={(event) => handleWalletClick(event, wallet.adapter.name)}
            wallet={wallet}
          />
        ))}
      </div>
    </Dialog>
  );
};

export default WalletModal;
