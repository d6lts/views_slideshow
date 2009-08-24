<?php
// $Id$

/**
 *  @file
 *  The default options available with Views Slideshow: ThumbnailHover.
 */

function views_slideshow_thumbnailhover_views_slideshow_modes() {
  $options = array(
    'thumbnailhover' => t('ThumbnailHover'),
  );
  return $options;
}

function views_slideshow_thumbnailhover_views_slideshow_option_definition() {
  $options['thumbnailhover'] = array(
    'contains' => array (
      'default' => (module_exists('hoverintent') ? 'hoverIntent' : 'hover'),
      'timeout' => array('default' => 5000),
      'sort' => array('default' => 1),
      'effect' => array('default' => 'fade'),
      'speed' => array('default' => 300),
      'fade_value' => array('default' => 0.25),
      'hover_breakout' => array('default' => 'teaser'),
      'teasers_last' => array('default' => TRUE),
    ),
  );
  return $options;
}

function views_slideshow_thumbnailhover_views_slideshow_options_form(&$form, &$form_state, &$view) {
  $form['thumbnailhover'] = array(
    '#type' => 'fieldset',
    '#title' => t('ThumbnailHover rotator options'),
    '#collapsible' => TRUE,
    '#collapsed' => !($view->options['mode'] == 'thumbnailhover'),
  );
  
  if (module_exists('hoverintent')) {
    $options = array('hover' => t('Hover'));
    $options['hoverIntent'] = t('HoverIntent');
    $form['thumbnailhover']['hover'] = array(
      '#type' => 'radios',
      '#title' => t('Mouse hover'),
      '#options' => $options,
      '#default_value' => $view->options['thumbnailhover']['hover'],
      '#description' => t('The !hoverintent, if installed, adds the %hoverintent option here. Selecting it causes a delay when the mouse hovers, to stop quick flybys from triggering the behavior. Selecting %hoverdefault chooses the default mouse behavior.', array('!hoverintent' => l(t('HoverIntent module'), 'http://drupal.org/project/hoverintent'), '%hoverintent' => t('HoverIntent'), '%hoverdefault' => t('Hover'))),
    );
  }  
  $options = array(
    'teaser' => t('Teaser'),
    'full' => t('Full'),
  );
  $form['thumbnailhover']['hover_breakout'] = array(
    '#type' => 'radios',
    '#title' => t('Hover breakout'),
    '#options' => $options,
    '#default_value' => $view->options['thumbnailhover']['hover_breakout'],
    '#description' => t("Hover breakout determines how to display the breakout element of the %thumbnail mode, either as a teaser or full node. It is ignored in %single mode.", array('%thumbnail' => t('Thumbnail hover'), '%single' => t('Single frame'))),
  );
  $form['thumbnailhover']['teasers_last'] = array(
    '#type' => 'checkbox',
    '#title' => t('Display teasers last'),
    '#default_value' => $view->options['thumbnailhover']['teasers_last'],
    '#description' => t('When the mode is thumbnail hover, this determines whether to print the teasers first or second.'),
  );
  $form['thumbnailhover']['timeout'] = array(
    '#type' => 'textfield',
    '#title' => t('Timer delay'),
    '#default_value' => $view->options['thumbnailhover']['timeout'],
    '#description' => t('Amount of time in milliseconds between transitions.'),
  );
  $form['thumbnailhover']['speed'] = array(
    '#type' => 'textfield',
    '#title' => t('Speed'),
    '#default_value' => $view->options['thumbnailhover']['speed'],
    '#description' => t('Time in milliseconds that each transition lasts. Numeric only!'),  
  );
  $form['thumbnailhover']['random'] = array(
    '#type' => 'radios',
    '#title' => t('Random'),
    '#description' => t('This option controls the order items are displayed. The default setting, False, uses the views ordering. True will cause the images to display in a random order.'),
    '#options' => array(0 => t('False'), 1 => t('True')),
    '#default_value' => isset($view->options['thumbnailhover']['random'])? $view->options['thumbnailhover']['random'] : 0,
  );
  $form['thumbnailhover']['pause'] = array(
    '#type' => 'radios',
    '#title' => t('Pause'),
    '#options' => array(1 => t('Yes'),2 => t('No')),
    '#default_value' => $view->options['thumbnailhover']['pause'],
    '#description' => t('Pause when hovering on the slideshow image.'),
  );
  $options = array('mouseover' => t('Hover'), 'click' => t('Click'));
  if ((module_exists('jq') && jq_add('hoverIntent')) || (module_exists('hoverintent') && hoverintent_add())) {
    $options['hoverIntent'] = 'hoverIntent';
  }
  $form['thumbnailhover']['pager_event'] = array(
    '#type' => 'select',
    '#title' => t('Pager Event'),
    '#options' => $options,
    '#default_value' => (isset($view->options['thumbnailhover']['pager_event']) ? $view->options['thumbnailhover']['pager_event'] : 'hover'),
    '#description' => t('Which event should be used to select an image from the breakout list.'),
  );
  $form['thumbnailhover']['controls'] = array(
    '#type' => 'select',
    '#title' => t('Controls'),
    '#options' => array(0 => t('None'),1 => t('Top'),2 => t('Bottom')),
    '#default_value' => (isset($view->options['thumbnailhover']['controls'])) ? $view->options['thumbnailhover']['controls'] : 0,
    '#description' => t('Determine if controls for the slideshow (start/stop/next/previous) should appear, and if so whether they should appear before or after the slideshow.'),
  );
  $options = array(
    'none' => 'none',
    'blindX' => 'blindX',
    'blindY' => 'blindY',
    'blindZ' => 'blindZ',
    'cover' => 'cover',
    'curtainX' => 'curtainX',
    'curtainY' => 'curtainY',
    'fade' => 'fade',
    'fadeZoom' => 'fadeZoom',
    'growX' => 'growX',
    'growY' => 'growY',
    'scrollUp' => 'scrollUp',
    'scrollDown' => 'scrollDown',
    'scrollLeft' => 'scrollLeft',
    'scrollRight' => 'scrollRight',
    'scrollHorz' => 'scrollHorz',
    'scrollVert' => 'scrollVert',
    'shuffle' => 'shuffle',
    'slideX' => 'slideX',
    'slideY' => 'slideY',
    'toss' => 'toss',
    'turnUp' => 'turnUp',
    'turnDown' => 'turnDown',
    'turnLeft' => 'turnLeft',
    'turnRight' => 'turnRight',
    'uncover' => 'uncover',
    'wipe' => 'wipe',
    'zoom' => 'zoom',
  );
  $form['thumbnailhover']['effect'] = array(
    '#type' => 'select',
    '#title' => t('Effect'),
    '#options' => $options,
    '#default_value' => $view->options['thumbnailhover']['effect'],
    '#description' => t('The transition effect that will be used to change between images. Not all options below may be relevant depending on the effect.'),
  );
  $form['thumbnailhover']['sync'] = array(
    '#type' => 'radios',
    '#title' => t('Sync'),
    '#options' => array(1 => t('Yes'), 2 => t('No')),
    '#default_value' =>$view->options['thumbnailhover']['sync'],
    '#description' => t('The sync option controls whether the slide transitions occur simultaneously. The default is yes which means that the current slide transitions out as the next slide transitions in. By setting the sync option to no you can get some interesting twists on your transitions.'),  
  );
}
function views_slideshow_thumbnailhover_views_slideshow_options_form_validate(&$form, &$form_state, &$view) {
  if (!is_numeric($form_state['values']['style_options']['thumbnailhover']['speed'])) {
    form_error($form['thumbnailhover']['speed'], t('!setting must be numeric!',array('!setting' => 'Speed')));
  }
  if (!is_numeric($form_state['values']['style_options']['thumbnailhover']['timeout'])) {
    form_error($form['thumbnailhover']['timeout'],t('!setting must be numeric!',array('!setting' => 'Timeout')));
  }
}