/**
 * @copyright   Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */
((document) => {
  'use strict';

  /**
   * Regex for hex values e.g. #FF3929
   * @type {RegExp}
   */
  const hexRegex = new RegExp(/^#([a-z0-9]{2})([a-z0-9]{2})([a-z0-9]{2})$/i);

  /**
   * Regex for rgb values e.g. rgb(255,0,24);
   * @type {RegExp}
   */
  const rgbRegex = new RegExp(/^rgb\(([0-9]+)[\D]+([0-9]+)[\D]+([0-9]+)\)$/i);

  /**
   * Regex for hsl values e.g. hsl(255,0,24);
   * @type {RegExp}
   */
  const hslRegex = new RegExp(/^hsl\(([0-9]+)[\D]+([0-9]+)[\D]+([0-9]+)\)$/i);

  /**
   * Creates a slider for the color values hue, saturation and light.
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
      this.display = element.dataset.display || 'hue';
      this.format = element.dataset.format || 'hex';
      this.preview = element.dataset.preview === 'true';

      this.hue = 360;
      this.saturation = 1;
      this.light = 1;

      this.setInitValue();
      this.setBackground();

      // Hide input field, when selected value should not be visible
      if (!this.preview) {
        this.input.style.display = 'none';
      }

      this.slider.addEventListener('change', () => this.changeValue());
    }

    /**
     * Set selected value into input field and set it as its background-color.
     */
    changeValue() {
      const rgb = this.valueToRgb();
      const rgbString = this.getRgbString(rgb);
      let value;

      switch (this.format) {
        case 'hex':
          value = this.convertRgbToHex(rgb);
          break;
        case 'rgb':
          value = rgbString;
          break;
        case 'saturation':
          value = this.display === 'saturation' ? this.slider.value
            : this.convertRgbToHsl(rgb)[1] * 100;
          break;
        case 'light':
          value = this.display === 'light' ? this.slider.value
            : this.convertRgbToHsl(rgb)[2] * 100;
          break;
        case 'hue':
        default:
          value = this.display === 'hue' ? this.slider.value
            : this.convertRgbToHsl(rgb)[0];
          break;
      }

      this.input.value = value;
      this.input.style.background = rgbString;
    }

    /**
     * Set linear gradient for slider background
     */
    setBackground() {
      const colors = [];
      let endValue = 100;

      // Longer start color so slider selection matches displayed colors
      colors.push(this.getRgbString(this.valueToRgb(0)));

      if (this.display === 'hue') {
        const steps = Math.floor(360 / 20);
        for (let i = 0; i <= 360; i += steps) {
          colors.push(this.getRgbString(this.valueToRgb(i)));
        }

        endValue = 360;
      } else {
        for (let i = 0; i <= 100; i += 10) {
          colors.push(this.getRgbString(this.valueToRgb(i)));
        }
      }

      // Longer end color so slider selection matches displayed colors
      colors.push(this.getRgbString(this.valueToRgb(endValue)));

      this.slider.style.background = `linear-gradient(to right, ${colors.join(
        ',')}`;
    }

    /**
     * Convert given color into hue, saturation and light
     */
    setInitValue() {
      const value = this.color || this.default || '';

      if (!value) {
        return;
      }

      if (typeof value === 'number') {
        if (this.display === 'hue') {
          this.hue = value;
        }
        if (this.display === 'saturation') {
          this.saturation = value <= 1 ? value * 100 : value;
        }
        if (this.display === 'light') {
          this.light = value <= 1 ? value * 100 : value;
        }
      } else if (hexRegex.test(value)) {
        [
          this.hue,
          this.saturation,
          this.light,
        ] = this.convertHexToHsl(value);
      } else if (rgbRegex.test(value)) {
        [
          this.hue,
          this.saturation,
          this.light,
        ] = this.convertRgbToHsl(value);
      } else if (hslRegex.test(value)) {
        const matches = value.match(hslRegex);
        this.hue = matches[1];
        this.saturation = matches[2];
        this.light = matches[3];
      } else {
        throw new Error(`Incorrect value ${value}.`);
      }

      switch (this.display) {
        case 'saturation':
          this.slider.value = this.saturation * 100;
          break;
        case 'light':
          this.slider.value = this.light * 100;
          break;
        case 'hue':
        default:
          console.log('this.hue', this.hue);
          this.slider.value = this.hue;
          break;
      }

      if (typeof value !== 'number') {
        this.input.style.background = value;
      }
    }

    /**
     * Calculates RGB value from color slider value
     * @params {int} [value]
     * @returns array
     */
    valueToRgb(value) {
      const input = value === undefined ? this.slider.value : value;
      let h = this.hue;
      let s = this.saturation;
      let l = this.light;

      if (this.display === 'hue') {
        h = input;
      }
      if (this.display === 'saturation') {
        s = input;
      }
      if (this.display === 'light') {
        l = input;
      }

      // Percentage light and saturation
      if (l > 1) {
        l /= 100;
      }
      if (s > 1) {
        s /= 100;
      }

      return this.convertHslToRgb(h, s, l);
    }

    /**
     * Set RGB value to slider input field
     * @params {array} rgb
     */
    getRgbString(rgb) {
      return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    }

    /**
     * Returns hsl values out of hex
     * @param {array} rgb
     * @return {string}
     */
    convertRgbToHex(rgb) {
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
     * Returns hsl values out of rgb
     * @param {string|array} values
     * @return {array}
     */
    convertRgbToHsl(values) {
      let rgb = values;

      if (typeof values === 'string') {
        const parts = values.match(rgbRegex);
        rgb = [parts[1], parts[2], parts[3]];
      }

      const [r, g, b] = rgb.map(value => (value > 1 ? value / 255 : value));
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const l = (max + min) / 2;
      const d = max - min;
      let h = 0;
      let s = 0;

      if (max !== min) {
        if (max === 0) {
          s = max;
        } else if (min === 1) {
          s = min;
        } else {
          s = (max - l) / (Math.min(l, 1 - l));
        }
        // s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
          case r:
            h = 60 * (g - b) / d; // + (g < b ? 6 : 0);
            break;
          case g:
            h = 60 * (2 + (b - r) / d);
            break;
          case b:
          default:
            h = 60 * (4 + (r - g) / d);
            break;
        }

        // h /= 6;
      }

      h = h < 0 ? h + 360 : h;

      return [h, s, l];
    }

    /**
     * Returns hsl values out of hex
     * @param {string} hex
     * @return {array}
     */
    convertHexToHsl(hex) {
      const parts = hex.match(hexRegex);
      const r = parts[1];
      const g = parts[2];
      const b = parts[3];

      const rgb = [parseInt(r, 16), parseInt(g, 16), parseInt(b, 16)];

      return this.convertRgbToHsl(rgb);
    }

    /**
     * Convert HSL values into RGB
     * @param {number} h
     * @param {number} s
     * @param {number} l
     * @returns {number[]}
     */
    convertHslToRgb(h, s, l) {
      let r = 1;
      let g = 1;
      let b = 1;

      if (h < 0 || h > 360 || s < 0 || s > 1 || l < 0 || l > 1) {
        throw new Error(`Incorrect value of hsl(${h}, ${s}, ${l}).`);
      }

      const c = (1 - Math.abs(2 * l - 1)) * s;
      const hi = h / 60;
      const x = c * (1 - Math.abs((hi % 2) - 1));
      const m = l - c / 2;

      if (h >= 0 && h < 60) {
        [r, g, b] = [c, x, 0];
      } else if (h >= 60 && h < 120) {
        [r, g, b] = [x, c, 0];
      } else if (h >= 120 && h < 180) {
        [r, g, b] = [0, c, x];
      } else if (h >= 180 && h < 240) {
        [r, g, b] = [0, x, c];
      } else if (h >= 240 && h < 300) {
        [r, g, b] = [x, 0, c];
      } else if (h >= 300 && h <= 360) {
        [r, g, b] = [c, 0, x];
      }

      return [r, g, b].map(value => Math.round((value + m) * 255));
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
