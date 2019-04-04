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
 * @var   boolean $autofocus Is autofocus enabled?
 * @var   string  $class     Classes for the input.
 * @var   boolean $disabled  Is this field disabled?
 * @var   string  $display   Which kind of slider should be displayed?
 * @var   string  $default   Default value for this field
 * @var   string  $format    Format of color value
 * @var   string  $name      Name of the input field.
 * @var   string  $onchange  Onchange attribute for the field.
 * @var   string  $onclick   Onclick attribute for the field.
 * @var   boolean $preview   Should the selected value be displayed separately?
 * @var   boolean $readonly  Is this field read only?
 * @var   integer $size      Size attribute of the input.
 */

if ($display === 'hue')
{
	$min = 0;
	$max = 360;
}
else
{
	// Light, saturation and alpha are percentage
	$min = 0;
	$max = 100;
}

$autofocus = $autofocus ? ' autofocus' : '';
$color     = $color ? ' data-color="' . $color . '"' : '';
$class     = ' class="form-control color-slider ' . $class . '"';
$default   = $default ? ' data-default="' . $default . '"' : '';
$disabled  = $disabled ? ' disabled' : '';
$format    = $format ? ' data-format="' . $format . '"' : '';
$onchange  = $onchange ? ' onchange="' . $onchange . '"' : '';
$onclick   = $onclick ? ' onclick="' . $onclick . '"' : '';
$preview   = $preview ? ' data-preview="' . $preview . '"' : '';
$readonly  = $readonly ? ' readonly' : '';
$size      = $size ? ' size="' . $size . '"' : '';

HTMLHelper::_('stylesheet', 'system/fields/joomla-field-color-slider.min.css', ['version' => 'auto', 'relative' => true]);
HTMLHelper::_('script', 'system/fields/joomla-field-color-slider.min.js', ['version' => 'auto', 'relative' => true]);
?>

<div class="color-slider-wrapper"
	<?php echo
	$default,
	$format,
	$preview,
	$size;
	?>
>
    <input type="text" class="form-control color-input" id="<?php echo $id; ?>" name="<?php echo $name; ?>" disabled
		<?php echo
		$hint,
		$onchange,
		$onclick,
		$readonly,
		$required;
		?>
    />
    <input type="range" min="<?php echo $min; ?>" max="<?php echo $max; ?>"
		<?php echo
		$autofocus,
		$disabled,
		$class; ?>
    />
</div>
