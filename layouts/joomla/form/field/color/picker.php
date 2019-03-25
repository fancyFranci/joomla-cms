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
 * @var   boolean  $autofocus Is autofocus enabled?
 * @var   string   $class     Classes for the input.
 * @var   boolean  $disabled  Is this field disabled?
 * @var   boolean  $default   Default color value for wrong inputs
 * @var   boolean  $hue       Display separate hue selection
 * @var   Language $lang      The loaded Language class
 * @var   string   $name      Name of the input field.
 * @var   string   $onchange  Onchange attribute for the field.
 * @var   string   $onclick   Onclick attribute for the field.
 * @var   boolean  $readonly  Is this field read only?
 * @var   integer  $size      Size attribute of the input.
 * @var   array    $swatches  Separate selections inside the colorpicker
 * @var   string   $value     Value attribute of the field.
 */

if (in_array($format, ['rgb', 'rgba'], true))
{
	$placeholder = $format === 'rgba' ? 'rgba(0, 0, 0, 0.5)' : 'rgb(0, 0, 0)';
}
else
{
	$placeholder = '#rrggbb';
}

$autofocus = $autofocus ? ' autofocus' : '';
$class     = ' class="form-control colorpicker-input ' . $class . '"';
$clear     = ' data-label-clear="' . Text::_('JCLEAR') . '"';
$default   = $default ? ' data-default="' . $default . '"' : '';
$disabled  = $disabled ? ' disabled' : '';
$format    = $format ? ' data-format="' . $format . '"' : '';
$hint      = strlen($hint) ? ' placeholder="' . $this->escape($hint) . '"' : ' placeholder="' . $placeholder . '"';
$hue       = $hue ? ' data-hue=' . $hue : '';
$onchange  = $onchange ? ' onchange="' . $onchange . '"' : '';
$onclick   = $onclick ? ' onclick="' . $onclick . '"' : '';
$readonly  = $readonly ? ' readonly' : '';
$save      = ' data-label-save="' . Text::_('JSAVE') . '"';
$size      = $size ? ' size="' . $size . '"' : '';
$swatches  = " data-swatches='" . json_encode($swatches) . "'";
$value     = $value ? ' value="' . $value . '"' : '';

if (empty($lang))
{
	$lang = Factory::getApplication()->getLanguage();
}

// Force LTR input value in RTL, due to display issues with rgba/hex colors
$direction = $lang->isRtl() ? ' dir="ltr" style="text-align:right"' : '';

HTMLHelper::_('stylesheet', 'vendor/pickr/pickr.min.css', ['version' => 'auto', 'relative' => true]);
HTMLHelper::_('script', 'vendor/pickr/pickr.min.js', ['version' => 'auto', 'relative' => true]);
HTMLHelper::_('stylesheet', 'system/fields/joomla-field-colorpicker.min.css', ['version' => 'auto', 'relative' => true]);
HTMLHelper::_('script', 'system/fields/joomla-field-colorpicker.min.js', ['version' => 'auto', 'relative' => true]);
?>

<div class="colorpicker-wrapper"
	<?php echo
	$clear,
	$default,
	$format,
	$hue,
	$save,
	$size,
	$swatches;
	?>
>
    <!-- The value is written in this input field -->
    <input type="text" id="<?php echo $id; ?>" name="<?php echo $name; ?>"
		<?php echo
		$autofocus,
		$class,
		$direction,
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

    <div class="colorpicker-btn-wrapper">
        <!-- This button is used to open the library picker -->
        <button type="button" class="colorpicker-btn">Colorpicker</button>
    </div>
</div>
