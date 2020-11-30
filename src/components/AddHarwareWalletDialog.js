import React, {useEffect, useState} from 'react';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogForm from './DialogForm';
import {LedgerWalletProvider} from "../utils/walletProvider/ledger";
import CircularProgress from "@material-ui/core/CircularProgress";

export default function AddHardwareWalletDialog({ open, onAdd, onClose }) {
  const [pubKey, setPubKey] = useState();

  useEffect(() => {( async () => {
    if (open) {
      try {
        const provider = new LedgerWalletProvider();
        await provider.init();
        setPubKey(provider.publicKey);
      } catch (err) {
        console.log(`received error when attempting to connect ledger: ${err}`);
        setPubKey(undefined)
        onClose();
      }
    }
  })();}, [open, onClose])

  return (
    <DialogForm
      open={open}
      onEnter={() => {}}
      onClose={() => {
        setPubKey(undefined);
        onClose();
      }}
      onSubmit={() => onAdd()}
      fullWidth
    >
      <DialogTitle>Add hardware wallet</DialogTitle>
      <DialogContent style={{ paddingTop: 16 }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {pubKey
            ? (
              <>
                <b>Hardware wallet detected:</b>
                <div>{pubKey.toString()}</div>
              </>
            )
            : (
              <>
                <b>Connect your ledger and open the Solana application</b>
                <CircularProgress />
              </>
            )
          }
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => {
          setPubKey(undefined);
          onClose();
        }}>Close</Button>
        <Button type="submit" color="primary" disabled={!pubKey}>
          Add
        </Button>
      </DialogActions>
    </DialogForm>
  );
}