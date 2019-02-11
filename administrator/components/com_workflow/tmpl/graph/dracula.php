<?php
/**
 * Graph View for a Workflow Component made with Dracula.js.
 *
 * @package     Joomla.Administrator
 * @subpackage  com_workflow
 *
 * @copyright   Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 * @since       4.0.0
 */
defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\HTML\HTMLHelper;

Factory::getDocument()->addScriptOptions('workflow_graph', ['workflow' => $this->workflow]);

HTMLHelper::_('script', 'media/vendor/raphael/js/raphael.min.js', array('version' => 'auto', 'relative' => false));
HTMLHelper::_('script', 'media/vendor/graphdracula/js/dracula.min.js', array('version' => 'auto', 'relative' => false));
HTMLHelper::_('script', 'com_workflow/workflow-graph-dracula.js', ['version' => 'auto', 'relative' => true]);

?>

<!-- workflow-graph></workflow-graph -->
<div id="paper"></div>
