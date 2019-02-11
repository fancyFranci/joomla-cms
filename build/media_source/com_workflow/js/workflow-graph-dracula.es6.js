/**
 * @copyright   Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

((Joomla) => {
  'use strict';

  const data = Joomla.getOptions('workflow_graph').workflow.transitions;

  document.addEventListener('DOMContentLoaded', () => {
    const graphDiv = document.getElementById('paper');
    const graph = new Dracula.Graph();
    const transFromEveryStage = [];
    const allStages = [];

    Object.keys(data)
      .forEach((key) => {
        const transition = data[key];
        if (transition.from_id) {
          graph.addEdge(transition.from_title, transition.to_title, { directed: true });
        } else {
          transFromEveryStage.push(transition.to_title);
        }
        allStages.push(transition.to_title);
      });

    transFromEveryStage.forEach((stageTo) => {
      allStages.forEach((stageFrom) => {
        graph.addEdge(stageFrom, stageTo, { directed: true });
      });
    });

    const layouter = new Dracula.Layout.Spring(graph);
    layouter.layout();

    const renderer = new Dracula.Renderer.Raphael('#paper', graph, 600, 500);
    renderer.draw();
  });
})(Joomla);
