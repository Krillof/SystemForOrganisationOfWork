import axios from "axios";
import { API_URL } from "../index";
import { useState } from 'react';
import MindMap from "../mindMap/MindMap";
import mindMapDataParse from "../mindMap/MindMapDataParser";

export default function Test() {

  const [mindMapData, setMindMapData] = useState(null);
  const [isTimerSetted, setIsTimerSetted] = useState(false);

  if (!isTimerSetted) {
    axios.get(API_URL + "test")
        .then((response) => {
          let data = JSON.parse(response.data);
          let parsed_data = mindMapDataParse(data);
          console.log(parsed_data);
          setMindMapData(parsed_data);
        });
    setInterval(() =>
      axios.get(API_URL + "test")
        .then((response) => {
          let data = JSON.parse(response.data);
          let parsed_data = mindMapDataParse(data);
          console.log(parsed_data);
          setMindMapData(parsed_data);
        }),
      15000
    );
    setIsTimerSetted(true);
  }

  return (
    <>
      {mindMapData && (
        <MindMap nodes={mindMapData.nodes} edges={mindMapData.edges} />
      )}
    </>

  );

}