import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useReactFlow } from 'reactflow';
import { modalContentTypes, showModalForCreatingArticle, showModalForCreatingTask, tryDeleteVertex } from '../store/scienceGroupDataSlice';


export default function ContextMenu({
  id,
  top,
  left,
  right,
  bottom,
  ...props
}) {
  const dispatch = useDispatch();
  const { getNode } = useReactFlow();
  const current_node = getNode(id);



  return (
    <div
      style={{ top, left, right, bottom }}
      className="context-menu"
      {...props}
    >
      <p style={{ margin: '0.5em' }}>
        <small>node: {current_node.data.label}</small>
      </p>
      <p style={{ margin: '0.5em' }}>
        <small>type: {current_node.workspace_type}</small>
      </p>
      {
        current_node.workspace_type != modalContentTypes.Article
          ?
          (
            <button onClick={() => {
              if (current_node.workspace_type == modalContentTypes.GlobalTheme){
                dispatch(showModalForCreatingTask({
                  parentId: id,
                }));
              } else if (current_node.workspace_type == modalContentTypes.Task){
                dispatch(showModalForCreatingArticle({
                  parentId: id,
                }));
              }
            }}>
              создать потомка {current_node.workspace_type == modalContentTypes.GlobalTheme ? "(задачу)" : "(ссылку на статью)"}
            </button>
          )
          :
          (<></>)
      }
      <button onClick={() => {
        dispatch(tryDeleteVertex({
          workspace_type: current_node.workspace_type,
          id: id
        }));
      }}>удалить</button>
    </div>
  );
}