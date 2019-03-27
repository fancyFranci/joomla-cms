/**
 * @copyright   Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */
((document) => {
  'use strict';

  /**
   * Creates a slider for color values like hue, saturation, light and alpha.
   *
   * @since 4.0
   */
  class JoomlaFieldColorSlider {
    /**
     * @param {HTMLElement} element
     */
    constructor(element) {
      // Elements
      this.input = element.querySelector('.color-input');
      this.slider = element.querySelector('.color-slider');

      // Attributes
      this.default = element.dataset.default || '';
      this.format = element.dataset.format || 'hex';
      this.light = element.dataset.light || 1;
      this.preview = element.dataset.preview === 'true';
      this.saturation = element.dataset.saturation || 1;
      this.target = element.dataset.target || 'hue';

      // Make light and saturation to percent
      if (this.light > 1) {
        this.light = `0.${this.light}`;
      }

      if (this.saturation > 1) {
        this.saturation = `0.${this.saturation}`;
      }

      if (!this.input.value && this.default) {
        this.input.value = this.default;
      }

      this.setStyle();

      this.slider.addEventListener('change', () => {
        if (this.format === 'hex') {
          this.setHex();
        } else {
          this.setRgb();
        }
      });
    }

    /**
     * Sets the correct styling for slider background.
     */
    setStyle() {
      if (this.target === 'hue') {
        const steps = Math.floor(360 / 25);
        const rgbs = [];

        for (let i = 1; i < 360; i += steps) {
          rgbs.push(this.getRgbString(this.getRgb(i)));
        }

        const gradientString = rgbs.join(',');
        this.slider.style.background = `linear-gradient(to right, ${gradientString}`;
      }

      if (!this.preview) {
        this.input.style.display = 'none';
      }
    }

    /**
     * Calculates RGB value from color slider value
     * @params int [hueValue]
     * @returns array
     */
    getRgb(hueValue) {
      let rgb;

      if (this.target === 'hue') {
        const hue = hueValue || this.slider.valueAsNumber;
        const h = hue / 60;
        const hi = Math.floor(h);
        const f = h - hi;
        const s = this.saturation;
        const v = this.light;
        const p = v * (1 - s);
        const q = v * (1 - s * f);
        const t = v * (1 - s * (1 - f));

        switch (hi) {
          case 0:
          case 6:
            rgb = [v, t, p];
            break;
          case 1:
            rgb = [q, v, p];
            break;
          case 2:
            rgb = [p, v, t];
            break;
          case 3:
            rgb = [p, q, v];
            break;
          case 4:
            rgb = [t, p, v];
            break;
          case 5:
            rgb = [v, p, q];
            break;
          default:
            throw new Error('Incorrect hsv values');
        }

        rgb = rgb.map(value => Math.round(value * 255));
      }

      return rgb;
    }

    /**
     * Set RGB value to slider input field
     * @params {int} [hueValue]
     */
    setRgb(hueValue) {
      this.input.value = this.getRgbString(this.getRgb(hueValue));
    }

    /**
     * Set RGB value to slider input field
     * @params {array} [rgb]
     */
    getRgbString(rgb) {
      return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    }

    /**
     * Set hex value into input field, calculated from slider value.
     */
    setHex() {
      const rgb = this.getRgb();
      let r = rgb[0].toString(16).toUpperCase();
      r = r === '0' ? `${r}0` : r;
      let g = rgb[1].toString(16).toUpperCase();
      g = g === '0' ? `${g}0` : g;
      let b = rgb[2].toString(16).toUpperCase();
      b = b === '0' ? `${b}0` : b;
      this.input.value = `#${r}${g}${b}`;
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const sliders = document.querySelectorAll('.color-slider-wrapper');

    if (sliders) {
      Array.prototype.forEach.call(sliders, (slider) => {
        // eslint-disable-next-line no-new
        new JoomlaFieldColorSlider(slider);
      });
    }
  });
})(document);
