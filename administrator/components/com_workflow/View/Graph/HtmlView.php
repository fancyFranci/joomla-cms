<?php
/**
 * @package     Joomla.Administrator
 * @subpackage  com_workflow
 *
 * @copyright   Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

namespace Joomla\Component\Workflow\Administrator\View\Graph;

defined('_JEXEC') or die;

use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\MVC\View\HtmlView as BaseHtmlView;

/**
 * Workflows view class for displaying the workflow.
 *
 * @since  4.0.0
 */
class HtmlView extends BaseHtmlView
{
	/**
	 * The current workflow
	 *
	 * @var     object
	 * @since  4.0.0
	 */
	protected $workflow;

	/**
	 * The ID of current workflow
	 *
	 * @var     integer
	 * @since  4.0.0
	 */
	protected $workflowID;

	/**
	 * The name of current extension
	 *
	 * @var     string
	 * @since  4.0.0
	 */
	protected $extension;

	/**
	 * Display the view
	 *
	 * @param   string $tpl The name of the template file to parse; automatically searches through the template paths.
	 *
	 * @since  4.0.0
	 */
	public function display($tpl = null)
	{
		$this->workflow   = $this->get('Item');
		$this->workflowID = $this->workflow['id'];
		$this->extension  = $this->workflow['extension'];

		HTMLHelper::_('script', 'media/vendor/graphdracula/js/dracula.min.js', array('version' => 'auto', 'relative' => true));
		HTMLHelper::_('script', 'com_workflow/workflow-graph.js', ['version' => 'auto', 'relative' => true]);

		return parent::display($tpl);
	}
}
