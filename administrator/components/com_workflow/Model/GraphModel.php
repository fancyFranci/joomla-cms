<?php
/**
 * @package     Joomla.Administrator
 * @subpackage  com_workflow
 *
 * @copyright   Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 * @since       4.0.0
 */

namespace Joomla\Component\Workflow\Administrator\Model;

defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\MVC\Model\BaseDatabaseModel;

/**
 * Model class for displaying and editing a workflow
 *
 * @since  4.0.0
 */
class GraphModel extends BaseDatabaseModel
{
	/**
	 * Get workflow item including its transitions and stages.
	 *
	 * @return array|boolean
	 *
	 * @since 4.0
	 */
	public function getItem()
	{
		$workflowID = Factory::getApplication()->input->get('id');

		$db    = Factory::getDbo();
		$query = $db->getQuery(true);
		$query->select('*')
			->from($db->qn('#__workflows'))
			->where($db->qn('id') . ' = ' . (int) $workflowID);

		$db->setQuery($query);

		try
		{
			$result = $db->loadAssoc();
		}
		catch (\RuntimeException $e)
		{
			Factory::getApplication()->enqueueMessage($e->getMessage(), 'error');

			return false;
		}

		$result['transitions'] = $this->getTransitions($workflowID) ?: [];

		return $result;
	}

	/**
	 * Collect all transitions of a workflow with the stages they combine.
	 *
	 * @param int $workflowID
	 *
	 * @return array|boolean
	 *
	 * @since 4.0
	 */
	public function getTransitions($workflowID)
	{
		$db    = Factory::getDbo();
		$query = $db->getQuery(true);
		$query->select($db->qn(['t.id', 't.title']))
			->select($db->qn(['from_s.id', 'from_s.title', 'from_s.condition', 'from_s.default'],
				['from_id', 'from_title', 'from_condition', 'from_default']))
			->select($db->qn(['to_s.id', 'to_s.title', 'to_s.condition', 'to_s.default'],
				['to_id', 'to_title', 'to_condition', 'to_default']))
			->from($db->qn('#__workflow_transitions', 't'))
			->leftJoin($db->qn('#__workflow_stages',
					'from_s') . ' ON ' . $db->qn('from_s.id') . ' = ' . $db->qn('t.from_stage_id'))
			->leftJoin($db->qn('#__workflow_stages',
					'to_s') . ' ON ' . $db->qn('to_s.id') . ' = ' . $db->qn('t.to_stage_id'))
			->where($db->qn('t.workflow_id') . ' = ' . (int) $workflowID);

		$db->setQuery($query);

		try
		{
			$result = $db->loadAssocList('id');
		}
		catch (\RuntimeException $e)
		{
			Factory::getApplication()->enqueueMessage($e->getMessage(), 'error');

			return false;
		}

		return $result;
	}
}
