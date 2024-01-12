import React, { memo } from 'react';
import { Card } from '@mui/material';
import { Handle, useReactFlow, useStoreApi, Position } from 'reactflow';
import { useSelector, useDispatch } from 'react-redux';
import { tryGetArticleData } from '../../store/scienceGroupDataSlice';

export default memo(({ data }) => {
  const dispatch = useDispatch();
  const loaded_articles = useSelector((state) => state.scienceGroupData.loaded_articles);

  if (loaded_articles[data.id] == undefined){
    dispatch(tryGetArticleData({
      id : data.id
    }));
  }

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#555' }}
        isConnectable={false}
      />
      {
        loaded_articles[data.id]== undefined
          ?
          (
            <Card style={{ background: "#AAF", padding: "10px" }}>
              Загрузка...
            </Card>
          )
          :
          (
            loaded_articles[data.id]["is_not_loaded"]
            ?
            (
              <Card style={{ background: "#AAF", padding: "10px" }}>
               Проблема на сервере.
              </Card>
            )
            :
            (
              <Card style={{ background: "#AAF", padding: "10px" }}>
                <h5>Статья</h5>
                <h5><a href={data.doi}>{data.label}</a></h5>
                <h5>Число цитирований: {loaded_articles[data.id].citations}</h5>
                <h5>Число доступов: {loaded_articles[data.id].accesses}</h5>
              </Card>
            )
          )
          
      }

    </>
  );
});