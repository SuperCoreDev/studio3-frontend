import React, { FC, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { Card } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { grey } from '@mui/material/colors';
// import { filesize } from 'filesize';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useWallet } from '@solana/wallet-adapter-react';
import { useNavigate } from 'react-router-dom';
// import AccountCircleSharpIcon from '@mui/icons-material/AccountCircleSharp';

import CheckSVG from '../../../../Icons/check.svg';
import CheckedSVG from '../../../../Icons/checked.svg';
import OptionSVG from '../../../../Icons/option.svg';
import OpenedSVG from '../../../../Icons/opened.svg';
import ArrowSVG from '../../../../Icons/context-arrow.svg';
import CopySVG from '../../../../Icons/context-copy.svg';
import EditSVG from '../../../../Icons/context-edit.svg';
import ExportSVG from '../../../../Icons/context-export.svg';
import MintSVG from '../../../../Icons/context-mint.svg';
import DeleteSVG from '../../../../Icons/context-delete.svg';
import BackSVG from '../../../../Icons/context-arrow_back.svg';

import styles from './index.module.scss';

import { AssetInfoType } from '@/global/types';
import { splitFileName } from '@/global/utils';
import CircularProgress from '@/components/based/CircularProgress';
import useProcessThumbnail from '@/hooks/useProcessThumbnail';
import {
  useAppendOpenedAsset,
  useRemoveOpenedAsset,
} from '@/state/application/hooks';

interface IItemWidget {
  title?: string;
  type: boolean;
  asset: AssetInfoType;
  selected?: boolean;
  onClick?: () => void;
  onDoubleClick?: () => void;
}

const ItemWidget: FC<IItemWidget> = ({
  type,
  selected,
  asset,
  onClick,
  onDoubleClick,
}) => {
  const navigate = useNavigate();
  const { publicKey } = useWallet();
  const { url: processedImg } = useProcessThumbnail(asset);
  const appendOpenedAsset = useAppendOpenedAsset();

  const [visible, setVisible] = useState(false);
  const [menuType, setMenuType] = useState(0);
  const [value, setValue] = useState('with');

  const nameRef = useRef<HTMLInputElement>(null);
  const symbolRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const royaltyRef = useRef<HTMLInputElement>(null);
  const creatorRef = useRef<HTMLInputElement>(null);
  const contextRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, []);
  const handleClick = (event: any) => {
    const contextMenu = document.getElementById(`contextmenu-${asset.uid}`);
    const showMenu = document.getElementById(`showmenu-${asset.uid}`);
    console.log(event.target, event.target?.id);
    if (
      !contextRef.current?.contains(event.target as Node) &&
      !showMenu?.contains(event.target as Node) &&
      asset.uid != event.target?.id
    ) {
      console.log('-----------false');
      setVisible(false);
      setMenuType(0);
    }
  };
  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const setMenu = async (ind: any) => {
    console.log(asset.uid);
    setMenuType(ind);
    setVisible(true);
    console.log('ffff');
  };

  const handleShowClick = (event: any) => {
    const contextMenu = document.getElementById(`contextmenu-${asset.uid}`);
    console.log('showmenu clicked', event.target);
    setVisible(true);
    if (event.target.getBoundingClientRect().left + 260 > window.innerWidth) {
      const cls = contextMenu?.getAttribute('style');
      contextMenu?.setAttribute('style', cls + ' left:10px !important;');
    } else {
      contextMenu?.setAttribute('style', 'display: block;');
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  const handleEdit = () => {
    navigate('/editor');
    appendOpenedAsset(asset.uid);
  };
  return (
    <div className={styles.card}>
      {type == true ? (
        selected == true ? (
          <img className={styles.checked} src={CheckedSVG} />
        ) : (
          <>
            <img className={styles.check} src={CheckSVG} />
            <img
              className={visible ? styles.option1 : styles.option}
              src={visible ? OpenedSVG : OptionSVG}
              id={`showmenu-${asset.uid}`}
              onClick={(event) => handleShowClick(event)}
            />
            <div
              className={styles.contextmenu}
              style={{
                display: visible == true ? 'block' : 'none',
              }}
              id={`contextmenu-${asset.uid}`}
              ref={contextRef}
            >
              {menuType == 0 ? (
                <>
                  <div
                    style={{
                      display: 'flex',
                      gap: '5px',
                      flexDirection: 'column',
                      padding: '15px',
                    }}
                  >
                    <div
                      style={{
                        paddingTop: '10px',
                        fontSize: '24px',
                        fontStyle: 'bold',
                      }}
                    >
                      {asset.file_name.split('.')[0]}
                    </div>
                    <div className={styles.info}>
                      Date Created:{' '}
                      {new Date(
                        asset.creation_timestamp * 1000
                      ).toLocaleDateString()}
                    </div>
                    <div className={styles.info}>
                      File Size: {Math.floor(asset.file_size_bytes / 1024)}
                      KB
                    </div>
                    <div className={styles.info} style={{}}>
                      File Type: {asset.file_type}
                    </div>
                  </div>
                  <div className={styles.border}></div>
                  <div
                    style={{
                      display: 'flex',
                      gap: '15px',
                      flexDirection: 'column',
                      padding: '15px',
                    }}
                  >
                    <div className={styles.buttons} onClick={handleEdit}>
                      <img src={EditSVG} style={{ marginRight: '10px' }} />
                      <span>Edit</span>
                    </div>
                    <div
                      id={`${asset.uid}`}
                      className={styles.buttons}
                      onClick={() => setMenu(1)}
                    >
                      <img src={ExportSVG} style={{ marginRight: '10px' }} />
                      Export
                      <img
                        src={ArrowSVG}
                        style={{ position: 'absolute', right: '20px' }}
                      />
                    </div>
                    <div
                      className={styles.buttons}
                      onClick={() => setMenu(2)}
                      id={`${asset.uid}`}
                    >
                      <img src={MintSVG} style={{ marginRight: '10px' }} />
                      Mint to NFT
                      <img
                        src={ArrowSVG}
                        style={{ position: 'absolute', right: '20px' }}
                      />
                    </div>
                    <div className={styles.buttons}>
                      <img src={CopySVG} style={{ marginRight: '10px' }} />
                      <span>Make a copy</span>
                    </div>
                    <div className={styles.buttons}>
                      <img src={DeleteSVG} style={{ marginRight: '10px' }} />
                      <span>Delete</span>
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}
              {menuType == 1 ? (
                <div
                  style={{
                    padding: '15px',
                    paddingRight: '10px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      gap: '20px',
                      marginBottom: '10px',
                    }}
                  >
                    <img
                      src={BackSVG}
                      style={{ cursor: 'pointer' }}
                      id={`${asset.uid}`}
                      onClick={() => setMenu(0)}
                    />
                    <span style={{ fontSize: '20px' }}>Download</span>
                  </div>
                  <div className={styles.border}></div>
                  <RadioGroup value={value} onChange={handleChange}>
                    <FormControlLabel
                      value="with"
                      control={
                        <Radio
                          sx={{
                            color: grey[100],
                            '&.Mui-checked': {
                              color: grey[100],
                            },
                          }}
                        />
                      }
                      label="Download with watermark"
                    />
                    <FormControlLabel
                      value="without"
                      control={
                        <Radio
                          sx={{
                            color: grey[100],
                            '&.Mui-checked': {
                              color: grey[100],
                            },
                          }}
                        />
                      }
                      label="Download without watermark"
                      style={{ width: '300px' }}
                    />
                  </RadioGroup>
                  <div className={styles.download}>
                    {value == 'without'
                      ? 'Download'
                      : 'Pay 0.25 SOL to Download'}
                  </div>
                </div>
              ) : (
                <></>
              )}
              {menuType == 2 ? (
                <div className={styles.mint}>
                  <div
                    style={{
                      display: 'flex',
                      gap: '20px',
                      marginBottom: '10px',
                      cursor: 'pointer',
                    }}
                    onClick={() => setMenu(0)}
                    id={`${asset.uid}`}
                  >
                    <img
                      src={BackSVG}
                      style={{ cursor: 'pointer' }}
                      id={`${asset.uid}`}
                      onClick={() => setMenu(0)}
                    />
                    <span style={{ fontSize: '20px' }}>Mint to NFT</span>
                  </div>
                  <div className={styles.border}></div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      marginTop: '10px',
                    }}
                  >
                    <div className={styles.list}>
                      <div>Name</div>
                      <input
                        className={styles.input}
                        ref={nameRef}
                        defaultValue=""
                      />
                    </div>
                    <div className={styles.list}>
                      <div>Symbol</div>
                      <input
                        className={styles.input}
                        ref={symbolRef}
                        defaultValue=""
                      />
                    </div>
                    <div className={styles.list}>
                      <div>Description</div>
                      <textarea
                        className={styles.input}
                        ref={descriptionRef}
                        defaultValue=""
                      />
                    </div>
                    <div className={styles.list}>
                      <div>Royalty (%)</div>
                      <input
                        className={styles.input}
                        ref={royaltyRef}
                        defaultValue=""
                      />
                    </div>
                    <div className={styles.list}>
                      <div>Creator</div>
                      <input
                        className={styles.input}
                        ref={creatorRef}
                        defaultValue={publicKey?.toString()}
                      />
                    </div>
                  </div>
                  <br />
                  <div className={styles.download}>Pay 0.5 SOL to Mint NFT</div>
                </div>
              ) : (
                <></>
              )}
            </div>
          </>
        )
      ) : (
        <></>
      )}

      <Card
        className={clsx(styles.widget, { [styles.selected]: selected })}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
      >
        <div className={styles.imageWrapper}>
          {processedImg ? (
            <LazyLoadImage src={processedImg} effect="blur" />
          ) : (
            <CircularProgress />
          )}
        </div>
        <div className={styles.infoContainer}>
          <div className={styles.title}>
            {splitFileName(asset.file_name)[0] || asset.file_name}
          </div>
          {/* <div className={styles.info}>
          <div className={styles.meta}>
            <div className={styles.row}>
              <b>Date modified:</b>
              {` ${new Date(asset.creation_timestamp * 1000).toLocaleString()}`}
            </div>
          </div>
          <AccountCircleSharpIcon className={styles.avatar} />
        </div> */}
        </div>
      </Card>
    </div>
  );
};

export default ItemWidget;
