<?php
/**
 * Transitions View for a Workflow Component.
 *
 * @package     Joomla.Administrator
 * @subpackage  com_workflow
 *
 * @copyright   Copyright (C) 2005 - 2018 Open Source Matters, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 * @since       4.0.0
 */
defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\Session\Session;

// TODO: HTMLHelper::_('webcomponent', 'system/webcomponents/workflow-graph.js', ['version' => 'auto', 'relative' => true]);

Factory::getDocument()->addScriptOptions('workflow_graph', ['workflow' => $this->workflow]);

// $saveUrl = 'index.php?option=com_workflow&task=workflow.saveAjax&workflow_id=' . (int) $this->workflowID .
// '&extension=' . $this->escape($this->extension) . '&' . Session::getFormToken() . '=1';
?>

<!-- workflow-graph></workflow-graph -->

<div id="paper"></div>