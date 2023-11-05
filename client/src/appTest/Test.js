import axios from "axios";
import { API_URL } from "../index";
import React from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  MarkerType,
  Position,
} from 'reactflow';
import CustomNode from './CustomNode';

import 'reactflow/dist/style.css';
import './overview.css';

const nodeTypes = {
  custom: CustomNode,
};

const minimapStyle = {
  height: 120,
};


/*

const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: {
      label: 'Input Node',
    },
    position: { x: 250, y: 0 },
  },
  {
    id: '2',
    data: {
      label: 'Default Node',
    },
    position: { x: 100, y: 100 },
  },
  {
    id: '3',
    type: 'output',
    data: {
      label: 'Output Node',
    },
    position: { x: 400, y: 100 },
  },
  {
    id: '4',
    type: 'custom',
    position: { x: 100, y: 200 },
    data: {
      selects: {
        'handle-0': 'smoothstep',
        'handle-1': 'smoothstep',
      },
    },
  },
  {
    id: '5',
    type: 'output',
    data: {
      label: 'custom style',
    },
    className: 'circle',
    style: {
      background: '#2B6CB0',
      color: 'white',
    },
    position: { x: 400, y: 200 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: '6',
    type: 'output',
    style: {
      background: '#63B3ED',
      color: 'white',
      width: 100,
    },
    data: {
      label: 'Node',
    },
    position: { x: 400, y: 325 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: '7',
    type: 'default',
    className: 'annotation',
    data: {
      label: (
        <>
          On the bottom left you see the <strong>Controls</strong> and the bottom right the{' '}
          <strong>MiniMap</strong>. This is also just a node 🥳
        </>
      ),
    },
    draggable: false,
    selectable: false,
    position: { x: 150, y: 400 },
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', label: 'this is an edge label' },
  { id: 'e1-3', source: '1', target: '3', animated: true },
  {
    id: 'e4-5',
    source: '4',
    target: '5',
    type: 'smoothstep',
    sourceHandle: 'handle-0',
    data: {
      selectIndex: 0,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    id: 'e4-6',
    source: '4',
    target: '6',
    type: 'smoothstep',
    sourceHandle: 'handle-1',
    data: {
      selectIndex: 1,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
];
*/


export default class Test extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      nodes: null,
      edges: null
    }
  }

  componentDidMount() {
    axios.get(API_URL + "test")
      .then((response) => {
        let data = JSON.parse(response.data);
        let nodes = data["nodes"].map((node) => {
          let new_node = node.map((el) => {
            if ((typeof el[1]) === (typeof [])) {
              return [el[0], Object.fromEntries(el[1])];
            }
            else return el;
          });
          return Object.fromEntries(new_node);
        })
        let edges = data["links"].map((edge) => {
          let new_edge = edge.map((el) => {
            if ((typeof el[1]) === (typeof [])) {
              return [el[0], Object.fromEntries(el[1])];
            }
            else return el;
          });
          return Object.fromEntries(new_edge);
        })

        console.log({
          nodes: nodes,
          edges: edges
        });

        this.setState({
          nodes: nodes,
          edges: edges
        });
      });

  }

  render() {
    if (this.state.nodes != null && this.state.edges != null)
      return (

        <ReactFlow
          nodes={this.state.nodes}
          edges={this.state.edges}
          fitView
          attributionPosition="top-right"
          nodeTypes={nodeTypes}
        >
          <MiniMap style={minimapStyle} zoomable pannable />
          <Controls />
          <Background color="#aaa" gap={16} />
        </ReactFlow>

      );
    else
      return (
        <div>
          Getting data from server...
        </div>

      );
  }




}