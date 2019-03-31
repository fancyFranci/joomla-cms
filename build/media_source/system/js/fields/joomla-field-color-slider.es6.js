/**
 * @copyright   Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */
((document) => {
  'use strict';

  /**
   * Regex to test for hex values
   * @type {RegExp}
   */
  const hexRegex = new RegExp(/^#[a-zA-Z0-9]{6}$/);

  /**
   * Regex to test for rgb values rgb(255,0,24);
   * @type {RegExp}
   */
  const rgbRegex = new RegExp(/^rgb\(([0-9]+,\s*){2}([0-9]+)\)$/);

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
      this.color = element.dataset.color || '';
      this.default = element.dataset.default || '';
      this.format = element.dataset.format || 'hex';
      this.hue = element.dataset.hue || '';
      this.light = element.dataset.light || 1;
      this.preview = element.dataset.preview === 'true';
      this.saturation = element.dataset.saturation || 1;
      this.target = element.dataset.target || 'hue';

      // Convert color value to use it as hue
      if (hexRegex.test(this.color)) {
        [this.hue] = JoomlaFieldColorSlider.convertHexToHsv(this.color);
      } else if (rgbRegex.test(this.color)) {
        [this.hue] = JoomlaFieldColorSlider.convertRgbToHsv(this.color);
      } else {
        throw new Error('Incorrect color format.');
      }

      if (!this.input.value && this.default) {
        this.input.value = this.default;
        this.setValueToSlider(this.default);
      }

      this.setStyle();

      this.slider.addEventListener('change', () => this.changeValue());
    }

    /**
     * Set selected value into input field and set it as its background-color.
     */
    changeValue() {
      const rgb = this.inputToRgb();
      const rgbString = JoomlaFieldColorSlider.getRgbString(rgb);

      if (this.format === 'hex') {
        this.input.value = JoomlaFieldColorSlider.convertRgbToHex(rgb);
      } else {
        this.input.value = rgbString;
      }

      this.input.style.background = rgbString;
    }

    /**
     * Set styling/linear gradient for slider background
     */
    setStyle() {
      const colors = [];

      if (this.target === 'hue') {
        const steps = Math.floor(360 / 25);
        // Longer start color so slider selection matches displayed colors
        colors.push(JoomlaFieldColorSlider.getRgbString(this.inputToRgb(1)));

        for (let i = 0; i <= 360; i += steps) {
          colors.push(JoomlaFieldColorSlider.getRgbString(this.inputToRgb(i)));
        }

        // Longer end color so slider selection matches displayed colors
        colors.push(JoomlaFieldColorSlider.getRgbString(this.inputToRgb(360)));
      }

      if (this.target === 'saturation') {
        // Longer start color so slider selection matches displayed colors
        colors.push(JoomlaFieldColorSlider.getRgbString(this.inputToRgb(0)));

        for (let i = 0; i <= 100; i += 10) {
          colors.push(JoomlaFieldColorSlider.getRgbString(this.inputToRgb(i)));
        }

        // Longer end color so slider selection matches displayed colors
        colors.push(JoomlaFieldColorSlider.getRgbString(this.inputToRgb(100)));
      }

      this.slider.style.background = `linear-gradient(to right, ${colors.join(',')}`;

      // Hide input field to see the selected hex/rgb value
      if (!this.preview) {
        this.input.style.display = 'none';
      }
    }

    /**
     * Convert value to correct format and set needed hsv part into slider
     * @param {string} value
     */
    setValueToSlider(value) {
      let hsv;

      if (hexRegex.test(value)) {
        hsv = JoomlaFieldColorSlider.convertHexToHsv(value);
      } else if (rgbRegex.test(value)) {
        hsv = JoomlaFieldColorSlider.convertRgbToHsv(value);
      }

      switch (this.target) {
        case 'saturation':
          this.slider.value = hsv[1];
          break;
        case 'light':
          this.slider.value = hsv[2];
          break;
        case 'hue':
        default:
          this.slider.value = hsv[0];
          break;
      }
    }

    /**
     * Calculates RGB value from color slider value
     * @params {int} [value]
     * @returns array
     */
    inputToRgb(value) {
      let h = this.hue;
      let s = this.saturation;
      let v = this.light;
      const input = value === undefined ? this.slider.valueAsNumber : value;

      if (this.target === 'hue') {
        h = input;
      }
      if (this.target === 'saturation') {
        s = input;
      }
      if (this.target === 'light') {
        v = input;
      }

      // Percentage light and saturation
      if (v > 1) {
        v /= 100;
      }
      if (s > 1) {
        s /= 100;
      }

      return JoomlaFieldColorSlider.convertHsvToRgb(h, s, v);
    }

    /**
     * Set RGB value to slider input field
     * @params {array} rgb
     */
    static getRgbString(rgb) {
      return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    }

    /**
     * Returns hsv values out of hex
     * @param {array} rgb
     * @return {string}
     */
    static convertRgbToHex(rgb) {
      let r = rgb[0].toString(16).toUpperCase();
      let g = rgb[1].toString(16).toUpperCase();
      let b = rgb[2].toString(16).toUpperCase();

      // Add zero for '#' + 6 chars
      r = r.length === 1 ? `0${r}` : r;
      g = g.length === 1 ? `0${g}` : g;
      b = b.length === 1 ? `0${b}` : b;

      return `#${r}${g}${b}`;
    }

    /**
     * Returns hsv values out of rgb
     * @param {string|array} values
     * @return {array}
     */
    static convertRgbToHsv(values) {
      let rgb = values;

      if (typeof values === 'string') {
        const parts = values.match(/^rgb([0-9]+),\s*([0-9]+),\s*([0-9]+)$/);
        rgb = [parts[0], parts[1], parts[2]];
      }

      const corrected = rgb.map(value => (value > 1 ? value / 255 : value));
      const r = corrected[0];
      const g = corrected[1];
      const b = corrected[2];
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0;
      let s = 0;
      const v = max;

      if (max === min) {
        h = 0;
      } else if (r === max) {
        h = 60 * ((g - b) / (max - min));
      } else if (g === max) {
        h = 60 * (2 + ((b - r) / (max - min)));
      } else if (b === max) {
        h = 60 * (4 + ((r - g) / (max - min)));
      }

      if (h < 0) {
        h += 360;
      }

      if (max === 0) {
        s = 0;
      } else {
        s = (max - min) / max;
      }

      return [h, s, v];
    }

    /**
     * Returns hsv values out of hex
     * @param {string} hex
     * @return {array}
     */
    static convertHexToHsv(hex) {
      const parts = hex.match(/^#([a-zA-Z0-9]{2})([a-zA-Z0-9]{2})([a-zA-Z0-9]{2})$/);
      const r = parts[1];
      const g = parts[2];
      const b = parts[3];

      const rgb = [parseInt(r, 16), parseInt(g, 16), parseInt(b, 16)];

      return JoomlaFieldColorSlider.convertRgbToHsv(rgb);
    }

    /**
     * Convert HSV values into RGB
     * @param {number} h
     * @param {int} s
     * @param {int} v
     * @returns {number[]}
     */
    static convertHsvToRgb(h, s, v) {
      let rgb;
      const i = h / 60;
      const hi = Math.floor(i);
      const f = i - hi;
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

      return rgb.map(value => Math.round(value * 255));
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
