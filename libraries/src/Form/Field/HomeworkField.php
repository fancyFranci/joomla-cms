<?php
/**
 * @author     Franciska Perisa
 * @copyright  2019
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

namespace Joomla\CMS\Form\Field;

use Joomla\CMS\HTML\HTMLHelper;

defined('JPATH_PLATFORM') or die;

/**
 * Form Field class for the Joomla Platform.
 * Provides project selection for the Google Summer of Code template
 *
 * @since  4.0.0
 */
class HomeworkField extends ListField
{
	/**
	 * The form field type.
	 *
	 * @var    string
	 * @since  4.0.0
	 */
	protected $type = 'Homework';

	/**
	 * Name of the layout being used to render the field
	 *
	 * @var    string
	 * @since  4.0.0
	 */
	protected $layout = 'joomla.form.field.list';

	/**
	 * Method to get the field input markup for a generic list.
	 * Use the multiple attribute to enable multiselect.
	 *
	 * @return  string  The field input markup.
	 *
	 * @since   4.0.0
	 */
	protected function getInput()
	{
		$options = (array) $this->getOptions();

		$listoptions = [];
		$listoptions['option.key'] = 'value';
		$listoptions['option.text'] = 'text';
		$listoptions['list.select'] = $this->value;
		$listoptions['id'] = $this->id;
		$listoptions['list.translate'] = false;
		$listoptions['list.attr'] = ' class="custom-select"';

		return HTMLHelper::_('select.genericlist', $options, $this->name, $listoptions);
	}

	/**
	 * Method to get the data to be passed to the layout for rendering.
	 *
	 * @return  array
	 *
	 * @since   4.0.0
	 */
	protected function getLayoutData()
	{
		$data = parent::getLayoutData();

		$extraData = array(
			'options' => $this->getOptions(),
			'value'   => (string) $this->value
		);

		return array_merge($data, $extraData);
	}

	/**
	 * Provides a list of projects for selection
	 *
	 * @return array
	 *
	 * @since version
	 */
	protected function getOptions()
	{
		return [
			['value' => 'Project I: Webservices in Joomla', 'text' => 'Webservices'],
			['value' => 'Project II: New frontend template: Page-builder', 'text' => 'Page-builder'],
			['value' => 'Project III: Joomla SEO Improvements', 'text' => 'SEO'],
			['value' => 'Project IV: Joomla 4 Feature Enhancements', 'text' => 'Feature Enhancements'],
			['value' => 'Project V: Joomla 4 Accessibility', 'text' => 'Accessibility'],
		];
	}
}
