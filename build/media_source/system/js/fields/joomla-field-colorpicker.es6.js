/**
 * @copyright   Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */
((doc, Pickr) => {
  'use strict';

  /**
   * Creates an interactive color picker with optional bars for
   * hue, saturation, light and alpha values
   *
   * @since 4.0
   */
  class JoomlaFieldColorPicker {
    /**
     * @param {HTMLInputElement} root
     */
    constructor(root) {
      // Check necessary library Pickr
      if (!Pickr) {
        throw new Error('The colorpicker needs library @simonwep/Pickr.');
      }

      // Elements
      this.btn = root.querySelector('.colorpicker-btn');
      this.btnWrapper = root.querySelector('.colorpicker-btn-wrapper');
      this.input = root.querySelector('.colorpicker-input');
      this.wrapper = root;

      // Attributes
      this.clear = root.dataset.labelClear || 'Clear';
      this.default = root.dataset.default;
      this.format = root.dataset.format || 'hex';
      this.hue = root.dataset.hue || true;
      this.opacity = root.dataset.opacity || true;
      this.save = root.dataset.labelSave || 'Save';
      this.swatches = JSON.parse(root.dataset.swatches) || [];

      if (!this.input.value) {
        let defaultFormatValue = '';

        if (this.format === 'hex') {
          defaultFormatValue = '#000000';
        } else if (this.format === 'rgba') {
          defaultFormatValue = 'rgba(0, 0, 0, 0)';
        } else {
          defaultFormatValue = 'rgb(0, 0, 0)';
        }

        this.input.value = root.dataset.value || this.default || defaultFormatValue;
      }

      this.initPickr();

      const success = this.pickr.setColor(this.input.value);
      if (!success) {
        throw new Error(`Incorrect color format ${this.input.value}.`);
      }
    }

    initPickr() {
      this.pickr = Pickr.create({
        defaultRepresentation: this.format,
        el: this.btn,
        parent: this.btnWrapper,
        swatches: this.swatches,
        components: {
          hue: this.hue,
          opacity: this.opacity,
          preview: true,
          interaction: {
            hex: false,
            rgba: false,
            hsla: false,
            hsva: false,
            cmyk: false,
            input: true,
            clear: true,
            save: true,
          },
          strings: {
            save: this.save,
            clear: this.clear,
          },
        },
      }).on('change', () => {
        const hsva = this.pickr.getColor();
        if (this.format === 'hex') {
          this.input.value = hsva.toHEX().toString();
        } else {
          this.input.value = hsva.toRGBA().toString();
        }
      });
    }
  }

  doc.addEventListener('DOMContentLoaded', () => {
    const pickers = doc.querySelectorAll('.colorpicker-wrapper');

    if (pickers) {
      Array.prototype.forEach.call(pickers, (picker) => {
        // eslint-disable-next-line no-new
        new JoomlaFieldColorPicker(picker);
      });
    }
  });
})(document, Pickr);
