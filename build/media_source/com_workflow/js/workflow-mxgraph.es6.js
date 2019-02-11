/**
 * @copyright   Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

((Joomla) => {
  'use strict';

  const workflow = Joomla.getOptions('workflow_graph').workflow;
  const transitions = workflow.transitions;
  const stages = workflow.stages;

  document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('paper');
    const model = new mxGraphModel();
    const graph = new mxGraph(container, model);
    const parent = graph.getDefaultParent();
    const allHaveAccess = [];
    const vertices = {};

    model.beginUpdate();

    let x = 0;
    let y = 0;
    stages.forEach((stage) => {
      x = Math.floor(Math.random() * Math.floor(500));
      y = Math.floor(Math.random() * Math.floor(500));
      vertices[stage.title] = graph.insertVertex(parent, stage.id, stage.title, x, y, 80, 30);
    });

    try {
      transitions.forEach((edge) => {
        if (edge.from_id) {
          graph.insertEdge(parent, null, edge.title, vertices[edge.from_title], vertices[edge.to_title]);
        } else {
          allHaveAccess.push(edge.to_title);
        }
      });

      allHaveAccess.forEach((stageTo) => {
        stages.forEach((stageFrom) => {
          if (stageFrom.title === stageTo) {
            return;
          }
          graph.insertEdge(parent, null, '', vertices[stageFrom.title], vertices[stageTo]);
        });
      });
    } finally {
      // Updates the display
      model.endUpdate();
    }
  });
})(Joomla);
