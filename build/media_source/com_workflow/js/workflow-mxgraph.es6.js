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
    const container = document.getElementById('container');
    const model = new mxGraphModel();
    const graph = new mxGraph(container, model);
    const layout = new mxFastOrganicLayout(graph);
    const parent = graph.getDefaultParent();
    const cssVars = window.getComputedStyle(container);
    const publishedColor = `fillColor=${cssVars.getPropertyValue('--green')};`;
    const unpublishedColor = `fillColor=${cssVars.getPropertyValue('--blue')};`;
    const archivedColor = `fillColor=${cssVars.getPropertyValue('--yellow')};`;
    const trashedColor = `fillColor=${cssVars.getPropertyValue('--red')};`;
    const allHaveAccess = [];
    const vertices = {};
    const style = graph.getStylesheet().getDefaultVertexStyle();

    style[mxConstants.STYLE_FONTCOLOR] = cssVars.getPropertyValue('--white');
    style[mxConstants.STYLE_FONTSIZE] = '12';
    style[mxConstants.STYLE_ROUNDED] = true;
    graph.getStylesheet().putDefaultVertexStyle(style);

    // Moves stuff wider apart than usual
    layout.forceConstant = 200;

    model.beginUpdate();

    stages.forEach((stage) => {
      const label = Joomla.JText._(stage.title) || stage.title;
      let style = stage.condition === 1 ? publishedColor
          : stage.condition === 2 ? archivedColor
              : stage.condition === -2 ? trashedColor
                  : unpublishedColor;

      vertices[stage.title] = graph.insertVertex(parent, stage.id, label,
          0, 0, 80, 30, style);
    });

    try {
      transitions.forEach((edge) => {
        if (edge.from_id) {
          graph.insertEdge(parent, null, edge.title, vertices[edge.from_title],
              vertices[edge.to_title]);
        } else {
          allHaveAccess.push(edge.to_title);
        }
      });

      allHaveAccess.forEach((stageTo) => {
        stages.forEach((stageFrom) => {
          if (stageFrom.title === stageTo) {
            return;
          }
          graph.insertEdge(parent, null, '', vertices[stageFrom.title],
              vertices[stageTo]);
        });
      });

      layout.execute(parent);
    } finally {
      // Updates the display
      model.endUpdate();
    }
  });
})(Joomla);
