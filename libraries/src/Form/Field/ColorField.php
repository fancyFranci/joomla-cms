<?php
/**
 * Joomla! Content Management System
 *
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

namespace Joomla\CMS\Form\Field;

defined('JPATH_PLATFORM') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\Form\FormField;
use Joomla\CMS\Language\Language;

/**
 * Color Form Field class for the Joomla Platform.
 * This implementation is designed to be compatible with HTML5's `<input type="color">`
 *
 * @link   http://www.w3.org/TR/html-markup/input.color.html
 * @since  1.7.3
 */
class ColorField extends FormField
{
	/**
	 * The form field type.
	 *
	 * @var    string
	 * @since  1.7.3
	 */
	protected $type = 'Color';

	/**
	 * The colors.
	 *
	 * @var    mixed
	 * @since  3.2
	 */
	protected $colors;

	/**
	 * The control.
	 *
	 * @var    mixed
	 * @since  3.2
	 */
	protected $control = 'hue';

	/**
	 * Default color when there is no value.
	 *
	 * @var    string
	 * @since  4.0
	 */
	protected $default;

	/**
	 * The type of value the slider should display: 'hue', 'saturation' or 'light'.
	 *
	 * @var    string
	 * @since  4.0
	 */
	protected $display = 'hue';

	/**
	 * The format.
	 *
	 * @var    string
	 * @since  3.6.0
	 */
	protected $format = 'hex';

	/**
	 * The keywords (transparent,initial,inherit).
	 *
	 * @var    string
	 * @since  3.6.0
	 */
	protected $keywords = '';

	/**
	 * Name of the layout being used to render the field
	 *
	 * @var    string
	 * @since  3.5
	 */
	protected $layout = 'joomla.form.field.color';

	/**
	 * The position.
	 *
	 * @var    mixed
	 * @since  3.2
	 */
	protected $position = 'default';

	/**
	 * Shows preview of the selected color
	 *
	 * @var    boolean
	 * @since  4.0
	 */
	protected $preview = false;

	/**
	 * The split.
	 *
	 * @var    integer
	 * @since  3.2
	 */
	protected $split = 3;

	/**
	 * Method to get certain otherwise inaccessible properties from the form field object.
	 *
	 * @param   string $name The property name for which to get the value.
	 *
	 * @return  mixed  The property value or null.
	 *
	 * @since   3.2
	 */
	public function __get($name)
	{
		switch ($name)
		{
			case 'colors':
			case 'control':
			case 'default':
			case 'display':
			case 'exclude':
			case 'format':
			case 'keywords':
			case 'preview':
			case 'split':
				return $this->$name;
		}

		return parent::__get($name);
	}

	/**
	 * Method to set certain otherwise inaccessible properties of the form field object.
	 *
	 * @param   string $name  The property name for which to set the value.
	 * @param   mixed  $value The value of the property.
	 *
	 * @return  void
	 *
	 * @since   3.2
	 */
	public function __set($name, $value)
	{
		switch ($name)
		{
			case 'colors':
			case 'control':
			case 'default':
			case 'display':
			case 'exclude':
			case 'format':
			case 'keywords':
				$this->$name = (string) $value;
				break;
			case 'split':
				$this->$name = (int) $value;
				break;
			case 'preview':
				$this->$name = (boolean) $value;
				break;
			default:
				parent::__set($name, $value);
		}
	}

	/**
	 * Method to attach a Form object to the field.
	 *
	 * @param   \SimpleXMLElement $element  The SimpleXMLElement object representing the `<field>` tag for the form field object.
	 * @param   mixed             $value    The form field value to validate.
	 * @param   string            $group    The field name group control value. This acts as an array container for the field.
	 *                                      For example if the field has name="foo" and the group value is set to "bar" then the
	 *                                      full field name would end up being "bar[foo]".
	 *
	 * @return  boolean  True on success.
	 *
	 * @see     FormField::setup()
	 * @since   3.2
	 */
	public function setup(\SimpleXMLElement $element, $value, $group = null)
	{
		$return = parent::setup($element, $value, $group);

		if ($return)
		{
			$this->colors     = (string) $this->element['colors'];
			$this->control    = isset($this->element['control']) ? (string) $this->element['control'] : 'hue';
			$this->default    = (string) $this->element['default'];
			$this->display    = isset($this->element['display']) ? (string) $this->element['display'] : '';
			$this->format     = isset($this->element['format']) ? (string) $this->element['format'] : 'hex';
			$this->keywords   = (string) $this->element['keywords'];
			$this->position   = isset($this->element['position']) ? (string) $this->element['position'] : 'default';
			$this->preview    = isset($this->element['preview']) ? (string) $this->element['preview'] : false;
			$this->split      = isset($this->element['split']) ? (int) $this->element['split'] : 3;
			$this->value      = (string) $this->element['value'];
		}

		return $return;
	}

	/**
	 * Method to get the field input markup.
	 *
	 * @return  string  The field input markup.
	 *
	 * @since   1.7.3
	 * @throws \Exception
	 */
	protected function getInput()
	{
		if (!empty($this->control))
		{
			$this->layout .= '.' . $this->control;
		}

		// Trim the trailing line in the layout file
		return rtrim($this->getRenderer($this->layout)->render($this->getLayoutData()), PHP_EOL);
	}

	/**
	 * Method to get the data to be passed to the layout for rendering.
	 *
	 * @return  array
	 *
	 * @since 3.5
	 * @throws \Exception
	 */
	protected function getLayoutData()
	{
		/* @var Language $lang */
		$lang  = Factory::getApplication()->getLanguage();
		$data  = parent::getLayoutData();
		$color = strtolower($this->value);
		$color = !$color ? '' : $color;

		// Position of the panel can be: right (default), left, top or bottom (default RTL is left)
		$position = ' data-position="' . (($lang->isRTL() && $this->position == 'default') ? 'left' : $this->position) . '"';

		if (!$color || in_array($color, array('none', 'transparent')))
		{
			$color = 'none';
		}
		elseif ($color[0] != '#' && $this->format == 'hex')
		{
			$color = '#' . $color;
		}

		switch ($this->control)
		{
			case 'simple':
				$controlModeData = $this->getSimpleModeLayoutData();
				break;
			case 'advanced':
				$controlModeData = $this->getAdvancedModeLayoutData($lang);
				break;
			case 'picker':
			default:
				$controlModeData = $this->getPickerModeLayoutData($lang);
				break;
		}

		$extraData = array(
			'color'    => $color,
			'format'   => $this->format,
			'keywords' => $this->keywords,
			'position' => $position,
			'validate' => $this->validate,
		);

		return array_merge($data, $extraData, $controlModeData);
	}

	/**
	 * Method to get the data for the simple mode to be passed to the layout for rendering.
	 *
	 * @return  array
	 *
	 * @since 3.5
	 */
	protected function getSimpleModeLayoutData()
	{
		$colors = strtolower($this->colors);

		if (empty($colors))
		{
			$colors = array(
				'none',
				'#049cdb',
				'#46a546',
				'#9d261d',
				'#ffc40d',
				'#f89406',
				'#c3325f',
				'#7a43b6',
				'#ffffff',
				'#999999',
				'#555555',
				'#000000',
			);
		}
		else
		{
			$colors = explode(',', $colors);
		}

		if (!$this->split)
		{
			$count = count($colors);

			if ($count % 5 == 0)
			{
				$this->split = 5;
			}
			else
			{
				if ($count % 4 == 0)
				{
					$this->split = 4;
				}
			}
		}

		return array(
			'colors' => $colors,
			'split'  => $this->split,
		);
	}

	/**
	 * Method to get the data for the advanced mode to be passed to the layout for rendering.
	 *
	 * @param   object $lang The language object
	 *
	 * @return  array
	 *
	 * @since   3.5
	 */
	protected function getAdvancedModeLayoutData($lang)
	{
		return array(
			'colors'  => $this->colors,
			'control' => $this->control,
			'lang'    => $lang,
		);
	}

	/**
	 * Method to get the data for the colorpicker to be passed to the layout for rendering.
	 *
	 * @param   object $lang The language object
	 *
	 * @return  array
	 *
	 * @since   4.0
	 */
	protected function getPickerModeLayoutData($lang)
	{
		return array(
			'colors'     => explode(',', $this->colors),
			'default'    => $this->default,
			'lang'       => $lang,
			'display'    => $this->display,
			'preview'    => $this->preview,
		);
	}
}
