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

Factory::getApplication()->getDocument()->addScriptOptions('workflow_graph', ['workflow' => $this->workflow]);
?>

<div id="paper">
	<p>Welcome to the default layout.</p>
</div>
