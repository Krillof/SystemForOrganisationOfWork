import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TextField, Button, Divider,Chip } from '@mui/material';
import { closeModalForCreatingVerticies, tryCreateGlobalThemeVertex } from '../../store/scienceGroupDataSlice';

export default function GlobalThemeModalContent() {
  const dispatch = useDispatch();
  const nameRef = useRef("");
  return (
    <>
      <TextField
        label="Название"
        variant="outlined"
        inputRef={nameRef}
      />
      <Divider />

      <Button
        variant="contained"
        onClick={() => {
          dispatch(closeModalForCreatingVerticies())
        }}
      >
        Назад
      </Button>
      <Chip></Chip>
      <Button
        variant="contained"
        onClick={() => {
          dispatch(tryCreateGlobalThemeVertex({
            name: nameRef.current.value,
          }))
        }}
      >
        Создать
      </Button>
    </>
  );

}