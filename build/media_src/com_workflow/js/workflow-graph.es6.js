/**
 * @copyright   Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

((Joomla) => {
  'use strict';

  const data = Joomla.getOptions('workflow_graph');

  document.addEventListener('DOMContentLoaded', () => {
    const graphDiv = document.getElementById('paper');

    if (typeof Dracula === "undefined") {
      console.error("Dracula NOT loaded");
    } else {
      console.log("Dracula there!");
      const graph = new Dracula.Graph();

      graph.addEdge("strawberry", "cherry");
      graph.addEdge("strawberry", "apple");
      graph.addEdge("strawberry", "tomato");

      graph.addEdge("tomato", "apple");
      graph.addEdge("tomato", "kiwi");

      graph.addEdge("cherry", "apple");
      graph.addEdge("cherry", "kiwi");

      const layouter = new Dracula.Layout.Spring(g);
      layouter.layout();

      const renderer = new Dracula.Renderer.Raphael('canvas', g, 400, 300);
      renderer.draw();
    }
  });
})(Joomla);