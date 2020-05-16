<template>
  <div class="w-full">
    <div class="card">
      <div class="flex flex-row mobile:flex-col w-full text-left">
        <div
          class="flex-1 font-semibold text-lg"
          style="max-width:300px">
          Wallet Info
        </div>
        <div class="flex-1">
          <div v-if="Account.publicKey">
            <div class="tracking-wide text-sm  text-gray-700">
              Public Key
            </div>
            <div class="font-semibold mt-1 truncate flex flex-row">
              {{ Account.publicKey }}
              <span
                v-clipboard:copy="`${Account.publicKey}`"
                v-clipboard:success="onCopyPublicKey"
                v-clipboard:error="onError">
                <div
                  v-if="copiedItem=='publicKey'"
                  class="circle-button text-green-700">
                  <i
                    class="eva eva-checkmark-circle-2-outline" />
                  Copied
                </div>
                <div
                  v-else
                  class="circle-button">
                  <i class="eva eva-copy-outline" />
                  Copy
                </div>
              </span>
            </div>
          </div>
          <div
            class="mt-4">
            <div class="tracking-wide text-sm text-gray-700">
              Base 16 Address
            </div>
            <div class="font-semibold mt-1 truncate flex flex-row">
              {{ Account.checksummedAddress }}
              <span
                v-clipboard:copy="`${Account.checksummedAddress}`"
                v-clipboard:success="onCopyAddress"
                v-clipboard:error="onError">
                <div
                  v-if="copiedItem=='checksummedAddress'"
                  class="circle-button text-green-700">
                  <i
                    class="eva eva-checkmark-circle-2-outline" />
                  Copied
                </div>
                <div
                  v-else
                  class="circle-button">
                  <i class="eva eva-copy-outline" />
                  Copy
                </div>
              </span>
            </div>
            <div
              type="danger"
              class="text-red-700 text-xs italic font-semibold">
              * Do not send ERC-20 ZIL funds to above address. 
            </div>
          </div>
          <div
            v-if="Account.privateKey"
            class="mt-4">
            <div class="tracking-wide text-sm text-gray-700">
              Private Key
            </div>
            <div class="font-semibold mt-1 mb-2">
              <div
                v-if="showPk"
                class="mb-2 truncate flex flex-row">
                {{ Account.privateKey }}
                <span
                  v-clipboard:copy="`${Account.privateKey}`"
                  v-clipboard:success="onCopyPk"
                  v-clipboard:error="onError">
                  <div
                    v-if="copiedItem=='privateKey'"
                    class="circle-button text-green-700">
                    <i
                      class="eva eva-checkmark-circle-2-outline" />
                    Copied
                  </div>
                  <div
                    v-else
                    class="circle-button">
                    <i class="eva eva-copy-outline" />
                    Copy
                  </div>
                </span>
              </div>
              <z-button
                size="small"
                class="w-full rounded"
                type="default"
                @click="showPk=!showPk">
                {{ showPk ? 'Hide': 'Reveal' }} Private Key
              </z-button>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-row mobile:flex-col w-full text-left mt-4 border-t pt-4">
        <div
          class="flex-1 font-semibold text-lg"
          style="max-width:300px">
          Help and Support
        </div>
        <div class="flex flex-col justify-center">
          <a
            href="https://twitter.com/zilletio"
            target="_blank"
            class="my-2 flex items-center hover:text-primary"
            rel="noopener noreferrer">
            <i class="eva eva-twitter mr-1 text-lg" />
            Twitter
          </a>
          <a
            href="mailto:support@zillet.io"
            target="_blank"
            class="my-2 flex items-center hover:text-primary"
            rel="noopener noreferrer">
            <i class="eva eva-email-outline mr-1 text-lg" />
            Email Support
          </a>
          <a
            href="//support.zillet.io"
            target="_blank"
            class="my-2 flex items-center hover:text-primary"
            rel="noopener noreferrer">
            <i
              class="eva eva-book-outline mr-1 text-lg" />
            Knowledge Base
          </a>
          <a
            href="https://github.com/zillet/zillet"
            target="_blank"
            class="my-2 flex items-center hover:text-primary"

            rel="noopener noreferrer">
            <i class="eva eva-github mr-1" />
            Github
          </a>
        </div>
      </div>
      <div class="flex flex-row mobile:flex-col w-full text-left mt-4 border-t pt-4">
        <div
          class="flex-1 font-semibold text-lg"
          style="max-width:300px">
          Data
        </div>
        <div class="flex-1">
          <z-button
            size="small"
            type="default"
            class="w-full rounded"
            @click="clearLs">
            Clear Local Storage and Cache
          </z-button>
          <div class="italic text-sm mt-2">
            * This option is useful when there are stuck transactions in UI.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  name: 'WalletInfo',
  middleware: 'ifKeyExists',
  data() {
    return {
      showPk: false,
      copiedItem: ''
    };
  },
  computed: {
    ...mapGetters(['Account'])
  },
  methods: {
    onCopyPublicKey() {
      const t = this;
      if (t.copiedItem == '' || t.copiedItem != 'publicKey') {
        t.copiedItem = 'publicKey';
        setTimeout(() => {
          t.copiedItem = '';
        }, 5000);
      }
    },
    onCopyAddress() {
      const t = this;
      if (t.copiedItem == '' || t.copiedItem != 'checksummedAddress') {
        t.copiedItem = 'checksummedAddress';
        setTimeout(() => {
          t.copiedItem = '';
        }, 5000);
      }
    },
    onCopyPk() {
      const t = this;
      if (t.copiedItem == '' || t.copiedItem != 'privateKey') {
        t.copiedItem = 'privateKey';
        setTimeout(() => {
          t.copiedItem = '';
        }, 5000);
      }
    },
    onError: function(e) {
      this.$notify({
        icon: 'eva eva-close-circle-outline',
        message: `Failed to copy address`,
        type: 'danger'
      });
    },
    clearLs() {
      localStorage.clear();
      location.reload();
    }
  }
};
</script>
<style lang="scss" scoped>
.qr-code-btn i.eva-grid-outline {
  position: relative;
  top: 2px;
}
.circle-button {
  @apply ml-2 text-gray-800 p-1 text-xs font-semibold border rounded-full cursor-pointer;
  @apply flex items-center justify-center px-2 border-gray-400;
  line-height: 1rem;
  @include no-select;
  @include transition;
  &:hover {
    @apply shadow-md;
    @include transition;
  }
  i {
    @apply text-sm mr-1;
  }
}
</style>
