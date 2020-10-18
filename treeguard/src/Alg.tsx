import { Node } from "./screens/Home";
import React from "react";

export interface GraphNode {
  edges: GraphNode[];
  data: Node;
  index: number;
}
export interface Graph {
  root: GraphNode;
  n: number;
}

const threshold = 0.1;

function calculateDistance(a: Node, b: Node) {
  let x = Math.abs(a.meta.loc.latitude - b.meta.loc.latitude);
  let y = Math.abs(a.meta.loc.longitude - b.meta.loc.longitude);
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}

export function createGraph(index: number, nodes: Node[]): GraphNode {
  type Visits = {
    [index: string]: boolean;
  };
  let visited: Visits = {};
  let q: GraphNode[] = [];
  visited[nodes[index].meta.name] = true;
  let root: GraphNode = {
    data: nodes[index],
    edges: [],
    index: index,
  };
  q.push(root);

  while (q.length > 0) {
    let a = q.shift();
    let edges: GraphNode[] = [];
    if (a) {
      for (let i = 0; i < nodes.length; i++) {
        let b = nodes[i];
        if (!visited[b.meta.name] && calculateDistance(a.data, b) < threshold) {
          let tmp = {
            data: b,
            edges: [],
            index: i,
          };
          a.edges.push(tmp);
          q.push(tmp);
          visited[b.meta.name] = true;
        }
      }
    }
  }
  return root;
}
