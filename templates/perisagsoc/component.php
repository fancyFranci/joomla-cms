<?php
/**
 * @author     Franciska <your@email.com>
 * @copyright  A copyright
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 * @link       http://your.url.com
 */

defined('_JEXEC') or die;

require_once JPATH_THEMES . '/' . $this->template . '/helper.php';

// Output as HTML5
$doc->setHtml5(true);

tplGsocHelper::loadCss();

?>
<!DOCTYPE html>
<html lang="<?php echo $this->language; ?>" dir="<?php echo $this->direction; ?>">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
    <jdoc:include type="head"/>
</head>
<body class="contentpane modal">
<jdoc:include type="message"/>
<jdoc:include type="component"/>
</body>
</html>
