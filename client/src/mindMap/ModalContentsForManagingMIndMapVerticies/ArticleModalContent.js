import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TextField, Button, Divider,Chip } from '@mui/material';
import { closeModalForCreatingVerticies, tryCreateArticleVertex } from '../../store/scienceGroupDataSlice';

export default function ArticleModalContent() {
  const dispatch = useDispatch();
  const current_modal_parent_id = useSelector((state) => state.scienceGroupData.current_modal_parent_id);
  const doiRef = useRef("");
  const nameRef = useRef("");
  return (
    <>
      <TextField
        label="Название"
        variant="outlined"
        inputRef={nameRef}
      />
      <Divider />
      <TextField
        label="DOI"
        variant="outlined"
        inputRef={doiRef}
      />
      <Divider />

      <Button
        variant="contained"
        onClick={() => {
          dispatch(closeModalForCreatingVerticies());
        }}
      >
        Назад
      </Button>
      <Chip></Chip>
      <Button
        variant="contained"
        onClick={() => {
          dispatch(tryCreateArticleVertex({
            doi: doiRef.current.valueOf,
            name: nameRef.current.value,
            parentId: current_modal_parent_id,
          }))
        }}
      >
        Создать
      </Button>
    </>
  );

}