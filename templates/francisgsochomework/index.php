<?php
/**
 * @package    gsoc
 *
 * @author     Franciska <your@email.com>
 * @copyright  A copyright
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 * @link       http://your.url.com
 */

defined('_JEXEC') or die;

require_once JPATH_THEMES . '/' . $this->template . '/helper.php';

tplGsocHelper::loadCss();
tplGsocHelper::loadJs();
tplGsocHelper::setMetadata();

?>
<!DOCTYPE html>
<html lang="<?php echo $this->language; ?>" dir="<?php echo $this->direction; ?>">
<head>
    <jdoc:include type="head"/>
</head>
<body class="<?php echo tplGsocHelper::setBodySuffix(); ?>">

<header>
    <a href="<?php echo $this->baseurl; ?>/">
		<?php if ($this->params->get('sitedescription')) : ?>
            <div class="site-description"><?php echo htmlspecialchars($this->params->get('sitedescription'), ENT_COMPAT, 'UTF-8'); ?></div>
		<?php endif; ?>
    </a>
    <jdoc:include type="modules" name="banner" style="none"/>
</header>

<?php if ($this->countModules('top-a')) : ?>
    <div class="nav">
        <jdoc:include type="modules" name="top-a" style="cardGrey"/>
    </div>
<?php endif; ?>

<div class="container">
	<?php $customParam = htmlspecialchars($this->params->get('homework'), ENT_COMPAT, 'UTF-8'); ?>
	<?php if (!empty($customParam)) : ?>
        <div class="alert alert-info" role="alert">
            <h4 class="alert-heading">Welcome to the GSoC Homework Page!</h4>
            <div><?php echo $customParam; ?></div>
        </div>
	<?php endif; ?>

    <div class="row">
        <aside class="col">
			<?php if ($this->countModules('sidebar-left')) : ?>
                <jdoc:include type="modules" name="sidebar-left" style="none"/>
			<?php endif; ?>
        </aside>

        <main id="main" class="col-6">
            <jdoc:include type="message"/>
            <jdoc:include type="component"/>
        </main>

        <aside class="col">
			<?php if ($this->countModules('sidebar-right')) : ?>
                <jdoc:include type="modules" name="sidebar-right" style="none"/>
			<?php endif; ?>
        </aside>
    </div>
</div>

<gsocter class="container-fluid">
    <jdoc:include type="modules" name="gsocter" style="none"/>
    <p>
        &copy; <?php echo date('Y'); ?> <?php echo tplGsocHelper::getSitename(); ?>
    </p>
</gsocter>
<jdoc:include type="modules" name="debug" style="none"/>
</body>
</html>
