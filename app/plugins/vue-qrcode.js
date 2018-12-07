import Vue from 'vue';
import QRCode from 'qrcode';
export default ({}, inject) => {
  inject('qr', QRCode);
};
