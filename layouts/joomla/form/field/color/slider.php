<?php
/**
 * @package     Joomla.Site
 * @subpackage  Layout
 *
 * @copyright   Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

use Joomla\CMS\Factory;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Language;
use Joomla\CMS\Language\Text;

/**
 * @var array $displayData Data for this field collected by ColorField
 */
extract($displayData);

/**
 * Layout variables
 * -----------------
 * @var   boolean $autofocus  Is autofocus enabled?
 * @var   string  $class      Classes for the input.
 * @var   boolean $disabled   Is this field disabled?
 * @var   string  $default    Default value for this field
 * @var   string  $format     Format of color value
 * @var   string  $hint       Hint for placeholder
 * @var   number  $light      Value for v of hsv (here called light)
 * @var   string  $name       Name of the input field.
 * @var   string  $onchange   Onchange attribute for the field.
 * @var   string  $onclick    Onclick attribute for the field.
 * @var   boolean $preview    Should the selected value be displayed separately?
 * @var   boolean $readonly   Is this field read only?
 * @var   number  $saturation Saturation value for s of hsv
 * @var   integer $size       Size attribute of the input.
 * @var   string  $target     Kind of slider to use.
 * @var   string  $value      Value attribute of the field.
 */

if (in_array($format, ['rgb', 'rgba'], true))
{
	$placeholder = $format === 'rgba' ? 'rgba(0, 0, 0, 0.5)' : 'rgb(0, 0, 0)';
}
else
{
	$placeholder = '#rrggbb';
}

$autofocus  = $autofocus ? ' autofocus' : '';
$class      = ' class="form-control color-slider ' . $class . '"';
$default    = $default ? ' data-default="' . $default . '"' : '';
$disabled   = $disabled ? ' disabled' : '';
$format     = $format ? ' data-format="' . $format . '"' : '';
$hint       = strlen($hint) ? ' placeholder="' . $this->escape($hint) . '"' : ' placeholder="' . $placeholder . '"';
$light      = $light ? ' data-light="' . $light . '"' : '';
$onchange   = $onchange ? ' onchange="' . $onchange . '"' : '';
$onclick    = $onclick ? ' onclick="' . $onclick . '"' : '';
$preview    = $preview ? ' data-preview="true"' : ' data-preview="false"';
$readonly   = $readonly ? ' readonly' : '';
$saturation = $saturation ? ' data-saturation="' . $saturation . '"' : '';
$size       = $size ? ' size="' . $size . '"' : '';
$target     = $target ? $target : 'hue';
$dataTarget = ' data-target="' . $target . '"';
$value      = $value ? ' value="' . $value . '"' : '';

if ($target === 'hue')
{
	$min = 0;
	$max = 360;
}

HTMLHelper::_('stylesheet', 'system/fields/joomla-field-color-slider.min.css', ['version' => 'auto', 'relative' => true]);
HTMLHelper::_('script', 'system/fields/joomla-field-color-slider.min.js', ['version' => 'auto', 'relative' => true]);
?>

<div class="color-slider-wrapper"
	<?php echo
	$default,
	$format,
	$light,
	$preview,
	$saturation,
	$size;
	?>
>
    <input type="text" class="form-control color-input" id="<?php echo $id; ?>" name="<?php echo $name; ?>" disabled/>

    <input type="range" min="<?php echo $min; ?>" max="<?php echo $max; ?>"
		<?php echo
		$autofocus,
		$class,
		$default,
		$disabled,
		$hint,
		$onchange,
		$onclick,
		$placeholder,
		$readonly,
		$required,
		$value;
		?>
    />
</div>
