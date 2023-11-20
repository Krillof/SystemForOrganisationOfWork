
export default function mindMapDataParse(data){
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

  return {nodes:nodes, edges:edges};
}