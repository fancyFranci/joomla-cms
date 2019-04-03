/**
 * @copyright   Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */
((doc, Pickr) => {
  'use strict';

  /**
   * Regex to test for hex values e.g. #31FE10
   * @type {RegExp}
   */
  const hexRegex = new RegExp(/^#[a-zA-Z0-9]{6}$/);

  /**
   * Regex to match hex values e.g. #31FE10
   * @type {RegExp}
   */
  const hexMatchRegex = new RegExp(
    /^#([a-zA-Z0-9]{2})([a-zA-Z0-9]{2})([a-zA-Z0-9]{2})$/);

  /**
   * Regex to test for rgb values e.g.  rgb(255,0,24);
   * @type {RegExp}
   */
  const rgbRegex = new RegExp(/^rgba?\(([0-9]+,\s*){2}([0-9]+)\)$/);

  /**
   * Regex to match rgb values e.g. rgb(255,0,24);
   * @type {RegExp}
   */
  const rgbMatchRegex = new RegExp(/^rgba?([0-9]+),\s*([0-9]+),\s*([0-9]+)$/);

  /**
   * Regex to test for rgb values e.g.  rgb(255,0,24);
   * @type {RegExp}
   */
  const hslRegex = new RegExp(/(?:hsla?\()?([0-9]+%?,\s*){2}([0-9]+%?)\)?/);

  /**
   * Creates an interactive color picker with optional selections for
   * hue and opacity.
   *
   * @since 4.0
   */
  class JoomlaFieldColorPicker {
    /**
     * @param {HTMLElement} root
     */
    constructor(root) {
      if (!Pickr) {
        throw new Error('The colorpicker needs library @simonwep/Pickr.');
      }

      // Elements
      this.btn = root.querySelector('.colorpicker-btn');
      this.btnWrapper = root.querySelector('.colorpicker-btn-wrapper');
      this.input = root.querySelector('.colorpicker-input');
      this.slider = root.querySelector('.colorpicker-slider');

      // Attributes
      this.clear = root.dataset.labelClear || 'Clear';
      this.color = root.dataset.color || '';
      this.colors = JSON.parse(root.dataset.colors) || [];
      this.default = root.dataset.default;
      this.display = root.dataset.display;
      this.format = root.dataset.format || 'hex';
      this.preview = root.dataset.preview === 'true';
      this.save = root.dataset.labelSave || 'Save';

      this.setInitValues();

      // Display slider or init picker?
      if (this.display) {
        this.setSliderBackground();
        this.slider.addEventListener('change', () => this.updateInputValue());
      } else {
        this.pickr = this.initPickr();

        if (this.input.value && !this.pickr.setColor(this.input.value)) {
          throw new Error(`Incorrect color format ${this.input.value}.`);
        }
      }

      // Hide input field, when selected value should not be visible
      if (!this.preview) {
        this.input.style.display = 'none';
      }
    }

    /**
     * Creates the colorpicker with given options and sets value on input field
     * @return {Pickr}
     */
    initPickr() {
      return Pickr.create({
        defaultRepresentation: this.format,
        default: this.default || 'fff',
        el: this.btn,
        parent: this.btnWrapper,
        swatches: this.colors,
        components: {
          hue: true,
          opacity: true,
          preview: this.preview,
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
        switch (this.format) {
          case 'hex':
            this.input.value = hsva.toHEX().toString();
            break;
          case 'rgb':
            this.input.value = hsva.toRGBA().toString();
            break;
          case 'hsl':
            this.input.value = hsva.toHSLA().toString();
            break;
          case 'saturation':
            this.input.value = hsva.toHSLA()[1];
            break;
          case 'light':
            this.input.value = hsva.toHSLA()[2];
            break;
          case 'hue':
          default:
            this.input.value = hsva.toHSLA()[0];
        }
      });
    }

    /**
     * Makes default value or given value in field to internal HSL values.
     */
    setInitValues() {
      const value = this.color || this.default || '';
      let hsl = [];

      if (!value) {
        return;
      }

      if (hexRegex.test(value)) {
        hsl = JoomlaFieldColorPicker.convertHexToHsl(value);
      } else if (rgbRegex.test(value)) {
        hsl = JoomlaFieldColorPicker.convertRgbToHsl(value);
      } else if (hslRegex.test(value)) {
        hsl = value.replace('%', '').split(',');
      }

      [this.hue, this.saturation, this.light] = hsl;
    }

    /**
     * Set selected value into input field and set it as its background-color.
     */
    updateInputValue() {
      const rgb = this.inputToRgb();
      const rgbString = JoomlaFieldColorPicker.getRgbString(rgb);

      switch (this.format) {
        case 'hex':
          this.input.value = JoomlaFieldColorPicker.convertRgbToHex(rgb);
          break;
        case 'rgb':
          this.input.value = rgbString;
          break;
        case 'hsl':
          this.input.value = `hsl(${this.hue}, ${this.light}% ,${this.saturation}%)`;
          break;
        case 'saturation':
          this.input.value = this.slider.value;
          break;
        case 'light':
          this.input.value = this.slider.value;
          break;
        case 'hue':
        default:
          this.input.value = this.slider.value;
          break;
      }

      this.input.style.background = rgbString;
    }

    /**
     * Set linear gradient for slider background
     */
    setSliderBackground() {
      const colors = [];

      // Longer start color so slider selection matches displayed colors
      colors.push(JoomlaFieldColorPicker.getRgbString(this.inputToRgb(0)));

      if (this.display === 'hue') {
        const steps = Math.floor(360 / 25);

        for (let i = 0; i <= 360; i += steps) {
          colors.push(
            JoomlaFieldColorPicker.getRgbString(this.inputToRgb(i)),
          );
        }

        // Longer end color so slider selection matches displayed colors
        colors.push(
          JoomlaFieldColorPicker.getRgbString(this.inputToRgb(360)),
        );
      } else {
        for (let i = 0; i <= 100; i += 10) {
          colors.push(
            JoomlaFieldColorPicker.getRgbString(this.inputToRgb(i)),
          );
        }

        // Longer end color so slider selection matches displayed colors
        colors.push(
          JoomlaFieldColorPicker.getRgbString(this.inputToRgb(100)),
        );
      }

      this.slider.style.background = `linear-gradient(to right, ${colors.join(
        ',')}`;
    }

    /**
     * Convert value into format and set needed HSL part into slider
     * @param {string} value
     */
    setValueToSlider(value) {
      let H;
      let S;
      let L;

      if (this.format === 'hex' && hexRegex.test(value)) {
        [H, S, L] = JoomlaFieldColorPicker.convertHexToHsl(value);
      } else if (this.format === 'rgb' && rgbRegex.test(value)) {
        [H, S, L] = JoomlaFieldColorPicker.convertRgbToHsl(value);
      } else {
        throw new Error(`Value ${value} should be in ${this.format} format.`);
      }

      switch (this.display) {
        case 'saturation':
          this.slider.value = S * 100;
          break;
        case 'light':
          this.slider.value = L * 100;
          break;
        case 'hue':
        default:
          this.slider.value = H;
          break;
      }

      this.input.value = value;
      this.input.style.background = value;
    }

    /**
     * Calculates RGB value from color slider value
     * @params {int} [value]
     * @returns array
     */
    inputToRgb(value) {
      let H = this.hue;
      let S = this.saturation;
      let V = this.light;
      const input = value === undefined ? this.slider.valueAsNumber : value;

      if (this.display === 'hue') {
        H = input;
      }
      if (this.display === 'saturation') {
        S = input;
      }
      if (this.display === 'light') {
        V = input;
      }

      // Percentage light and saturation
      if (V > 1) {
        V /= 100;
      }
      if (S > 1) {
        S /= 100;
      }

      return JoomlaFieldColorPicker.convertHslToRgb(H, S, V);
    }

    /**
     * Set RGB value to slider input field
     * @params {array} rgb
     */
    static getRgbString(rgb) {
      return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    }

    /**
     * Returns hex values out of RGB
     * @param {array} rgb
     * @return {string}
     */
    static convertRgbToHex(rgb) {
      let R = rgb[0].toString(16).toUpperCase();
      let G = rgb[1].toString(16).toUpperCase();
      let B = rgb[2].toString(16).toUpperCase();

      // Add zero for '#' + 6 chars
      R = R.length === 1 ? `0${R}` : R;
      G = G.length === 1 ? `0${G}` : G;
      B = B.length === 1 ? `0${B}` : B;

      return `#${R}${G}${B}`;
    }

    /**
     * Returns RGB values to HSL
     * @param {string|array} values
     * @return {array}
     */
    static convertRgbToHsl(values) {
      let rgb = values;

      if (typeof values === 'string') {
        const parts = values.match(rgbMatchRegex);
        rgb = [parts[0], parts[1], parts[2]];
      }

      const corrected = rgb.map(value => (value > 1 ? value / 255 : value));
      const R = corrected[0];
      const G = corrected[1];
      const B = corrected[2];
      const max = Math.max(R, G, B);
      const min = Math.min(R, G, B);
      let H = 0;
      let S = 0;
      const L = (max + min) / 2;

      if (max === min) {
        H = 0;
      } else if (R === max) {
        H = 60 * ((G - B) / (max - min));
      } else if (G === max) {
        H = 60 * (2 + ((B - R) / (max - min)));
      } else if (B === max) {
        H = 60 * (4 + ((R - G) / (max - min)));
      }

      if (H < 0) {
        H += 360;
      }

      if (max === 0 || min === 1) {
        S = 0;
      } else {
        S = (max - L / (Math.min(L, 1 - L)));
      }

      return [H, S, L];
    }

    /**
     * Returns HSL values out of hex
     * @param {string} hex
     * @return {array}
     */
    static convertHexToHsl(hex) {
      const parts = hex.match(hexMatchRegex);
      const R = parts[1];
      const G = parts[2];
      const B = parts[3];
      const rgb = [parseInt(R, 16), parseInt(G, 16), parseInt(B, 16)];

      return JoomlaFieldColorPicker.convertRgbToHsl(rgb);
    }

    /**
     * Convert HSL values into RGB
     * @param {number} H
     * @param {number} S
     * @param {number} L
     * @returns {number[]}
     */
    static convertHslToRgb(H, S, L) {
      const a = S * Math.min(L, 1 - L);
      const f = (n, k = (n + H / 30) % 12) => 1 - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      const rgb = [f(0), f(8), f(4)];

      return rgb.map(value => Math.round(value * 255));
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
