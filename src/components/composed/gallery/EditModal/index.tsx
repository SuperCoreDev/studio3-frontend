import React, { ChangeEvent, FC, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import bs58 from 'bs58';
import { useWallet } from '@solana/wallet-adapter-react';

import styles from './index.module.scss';

import Dialog from '@/components/based/Dialog';
import TextField from '@/components/based/TextField';
import Button from '@/components/based/Button';
import {
  usePreviewSelectedAsset,
  useUpdateDisplayedAssets,
} from '@/state/gallery/hooks';
import { splitFileName } from '@/global/utils';
import useFetchAPI from '@/hooks/useFetchAPI';
import { APP_API_URL } from '@/global/constants';

interface IEditModal {
  open: boolean;
  onClose: () => void;
}

const EditModal: FC<IEditModal> = ({ open, onClose }) => {
  const { signMessage } = useWallet();
  const fetchAPI = useFetchAPI();
  const selectedAsset = usePreviewSelectedAsset();
  const updateDisplayedAssets = useUpdateDisplayedAssets();
  const fileNameInfo = useMemo(
    () => selectedAsset && splitFileName(selectedAsset.file_name),
    [selectedAsset]
  );
  const [fileName, setFileName] = useState(fileNameInfo && fileNameInfo[0]);

  const handleInputChange = (ev: ChangeEvent<HTMLInputElement>) => {
    setFileName(ev.target.value);
  };

  useEffect(() => {
    if (fileNameInfo) setFileName(fileNameInfo[0]);
  }, [fileNameInfo]);

  const handleSubmit = async () => {
    if (!selectedAsset) return;
    if (!signMessage) return;

    const signature = await signMessage(
      new TextEncoder().encode(new Date().getTime().toString())
    );

    fetchAPI(`${APP_API_URL}/update_asset_metadata`, 'POST', {
      asset_uid: selectedAsset.uid,
      file_name: fileName?.concat(fileNameInfo ? fileNameInfo[1] : ''),
      transaction_signature: bs58.encode(signature),
      purchase_price: '0',
      purchase_type: '',
      confirmed: true,
    }).then((res) => {
      if (res.success) {
        toast.success('Updated successfully!');
        updateDisplayedAssets();
        onClose();
      }
    });
  };

  return (
    <Dialog
      className={styles.modal}
      open={open}
      onClose={onClose}
      title="Edit Info"
    >
      <div className={styles.filename}>
        File Name:
        <div className={styles.controls}>
          <TextField
            className={styles.input}
            defaultValue={fileName}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div className={styles.actions}>
        <Button size="medium" className={styles.button} onClick={onClose}>
          Cancel
        </Button>
        <Button size="medium" className={styles.submit} onClick={handleSubmit}>
          Save
        </Button>
      </div>
    </Dialog>
  );
};

export default EditModal;
