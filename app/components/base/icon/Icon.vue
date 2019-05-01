<template>
  <div class="pb-8 z-icon">
    <div
      v-if="type==='success'"
      class="modal-icon modal-success animate">
      <span class="modal-line modal-tip animateSuccessTip" />
      <span class="modal-line modal-long animateSuccessLong" />
      <div class="modal-placeholder" />
      <div class="modal-fix" />
    </div>
    <div
      v-else-if="type==='error'"
      class="modal-icon modal-error animate">
      <span class="modal-x-mark">
        <span class="modal-line modal-left animateXLeft" />
        <span class="modal-line modal-right animateXRight" />
      </span>
      <div class="modal-placeholder" />
      <div class="modal-fix" />
    </div>
    <div
      v-else
      class="modal-icon modal-warning scaleWarning">
      <span class="modal-body pulseWarningIns" />
      <span class="modal-dot pulseWarningIns" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'ZIcon',
  props: {
    type: {
      type: String,
      default: 'info'
    }
  }
};
</script>
<style lang="scss">
.z-icon {
  padding-bottom: 20px;
}
.modal-icon {
  border-radius: 50%;
  border: 4px solid gray;
  box-sizing: content-box;
  height: 80px;
  margin: 20px auto;
  padding: 0;
  position: relative;
  width: 80px;
  // Success icon
  &.modal-success,
  &.modal-error {
    border-color: #a5dc86;
    &:after,
    &:before {
      background: #fff;
      content: '';
      height: 120px;
      position: absolute;
      transform: rotate(45deg);
      width: 60px;
    }

    &:before {
      border-radius: 120px 0 0 120px;
      left: -33px;
      top: -7px;
      transform-origin: 60px 60px;
      transform: rotate(-45deg);
    }

    &:after {
      border-radius: 0 120px 120px 0;
      left: 30px;
      top: -11px;
      transform-origin: 0 60px;
      transform: rotate(-45deg);
    }

    .modal-placeholder {
      border-radius: 50%;
      border: 4px solid rgba(165, 220, 134, 0.2);
      box-sizing: content-box;
      height: 80px;
      left: -4px;
      position: absolute;
      top: -4px;
      width: 80px;
      z-index: 2;
    }

    .modal-fix {
      background-color: #fff;
      height: 90px;
      left: 28px;
      position: absolute;
      top: 8px;
      transform: rotate(-45deg);
      width: 5px;
      z-index: 1;
    }

    .modal-line {
      background-color: #a5dc86;
      border-radius: 2px;
      display: block;
      height: 5px;
      position: absolute;
      z-index: 2;

      &.modal-tip {
        left: 14px;
        top: 46px;
        transform: rotate(45deg);
        width: 25px;
      }

      &.modal-long {
        right: 8px;
        top: 38px;
        transform: rotate(-45deg);
        width: 47px;
      }
    }
  }

  // Error icon
  &.modal-error {
    border-color: #f27474;

    .modal-x-mark {
      display: block;
      position: relative;
      z-index: 2;
    }

    .modal-placeholder {
      border: 4px solid rgba(200, 0, 0, 0.2);
    }

    .modal-line {
      background-color: #f27474;
      top: 37px;
      width: 47px;

      &.modal-left {
        left: 17px;
        transform: rotate(45deg);
      }

      &.modal-right {
        right: 16px;
        transform: rotate(-45deg);
      }
    }
  }

  // Warning icon

  &.modal-warning {
    border-color: #f8bb86;

    &:before {
      animation: pulseWarning 2s linear infinite;
      background-color: #fff;
      border-radius: 50%;
      content: '';
      display: inline-block;
      height: 100%;
      opacity: 0;
      position: absolute;
      width: 100%;
    }

    &:after {
      background-color: #fff;
      border-radius: 50%;
      content: '';
      display: block;
      height: 100%;
      position: absolute;
      width: 100%;
      z-index: 1;
    }
  }

  &.modal-warning .modal-body {
    background-color: #f8bb86;
    border-radius: 2px;
    height: 47px;
    left: 50%;
    margin-left: -2px;
    position: absolute;
    top: 10px;
    width: 5px;
    z-index: 2;
  }

  &.modal-warning .modal-dot {
    background-color: #f8bb86;
    border-radius: 50%;
    bottom: 10px;
    height: 7px;
    left: 50%;
    margin-left: -3px;
    position: absolute;
    width: 7px;
    z-index: 2;
  }

  + .modal-icon {
    margin-top: 50px;
  }
}

.animateSuccessTip {
  animation: animateSuccessTip 0.75s;
}

.animateSuccessLong {
  animation: animateSuccessLong 0.75s;
}

.modal-icon.modal-success.animate:after {
  animation: rotatePlaceholder 4.25s ease-in;
}

.modal-icon.modal-error.animate:after {
  animation: rotatePlaceholder 4.25s ease-in;
}

.animateErrorIcon {
  animation: animateErrorIcon 0.5s;
}

.animateXLeft {
  animation: animateXLeft 0.75s;
}

.animateXRight {
  animation: animateXRight 0.75s;
}

.scaleWarning {
  animation: scaleWarning 0.75s infinite alternate;
}

.pulseWarningIns {
  animation: pulseWarningIns 0.75s infinite alternate;
}

@keyframes animateSuccessTip {
  0%,
  54% {
    width: 0;
    left: 1px;
    top: 19px;
  }

  70% {
    width: 50px;
    left: -8px;
    top: 37px;
  }

  84% {
    width: 17px;
    left: 21px;
    top: 48px;
  }

  100% {
    width: 25px;
    left: 14px;
    top: 45px;
  }
}

@keyframes animateSuccessLong {
  0%,
  65% {
    width: 0;
    right: 46px;
    top: 54px;
  }

  84% {
    width: 55px;
    right: 0;
    top: 35px;
  }

  100% {
    width: 47px;
    right: 8px;
    top: 38px;
  }
}

@keyframes rotatePlaceholder {
  0%,
  5% {
    transform: rotate(-45deg);
  }

  100%,
  12% {
    transform: rotate(-405deg);
  }
}

@keyframes animateErrorIcon {
  0% {
    transform: rotateX(100deg);
    opacity: 0;
  }

  100% {
    transform: rotateX(0deg);
    opacity: 1;
  }
}

@keyframes animateXLeft {
  0%,
  65% {
    left: 82px;
    top: 95px;
    width: 0;
  }

  84% {
    left: 14px;
    top: 33px;
    width: 47px;
  }

  100% {
    left: 17px;
    top: 37px;
    width: 47px;
  }
}

@keyframes animateXRight {
  0%,
  65% {
    right: 82px;
    top: 95px;
    width: 0;
  }

  84% {
    right: 14px;
    top: 33px;
    width: 47px;
  }

  100% {
    right: 16px;
    top: 37px;
    width: 47px;
  }
}

@keyframes scaleWarning {
  0% {
    transform: scale(1);
  }

  30% {
    transform: scale(1.02);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes pulseWarning {
  0% {
    background-color: #fff;
    transform: scale(1);
    opacity: 0.5;
  }

  30% {
    background-color: #fff;
    transform: scale(1);
    opacity: 0.5;
  }

  100% {
    background-color: #f8bb86;
    transform: scale(2);
    opacity: 0;
  }
}

@keyframes pulseWarningIns {
  0% {
    background-color: #f8d486;
  }

  100% {
    background-color: #f8bb86;
  }
}
</style>
