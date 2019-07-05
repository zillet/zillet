/*
 * printWallet
 *
 * print paper wallet
 *
 * @param {string, string}
 * @returns {HTMLDom}
 */
export const printKeystore = (address, pk) => {
  return `<html id="print-wallet">
    <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro" rel="stylesheet">
    <div class="print-container" style="margin-bottom: 50px;" id="print-container" onload="myFunction()">
        <div class="print-address">
            <div id="addresscanvas">
            </div>
            <pre>Address</pre>
        </div>
        <div class="print-text">
            <p>
                <strong>Your Address:</strong>
                <br>
                <span id="paperwalletadd">${address}</span>
            </p>
            <p>
                <strong>Your Private Key:</strong>
                <br>
                <span id="paperwalletpriv">${pk}</span>
            </p>
        </div>
        <div class="print-pk">
            <div id="pkcanvas">
            </div>
            <pre>Private Key</pre>
        </div>
    </div>
    <style>
    /* Print Etherwallet Page */
    pre{
        margin: 0 auto 0;
        text-align:center;
    }
    .print-container {
        font-family: 'Source Sans Pro', sans-serif;
        width: 900px;
        border: 1px solid gray;
        display: flex;
        margin-bottom: 50px;
        position: relative;
    }
    .hidden{
        visiblity:hidden;
        height: 0;
        width:0;
        margin:0;
    }
    .print-address, .print-pk{
        width: 150;
        padding: 16px;
    }
    .print-text{
        width: calc(100% - 300px);
        margin: auto;
        position: relative;
        top: -20px;
        overflow: hidden;
    }
    p{
        word-break: break-all;
    }
    img{
        max-width: 150px;
    }
    </style>
<html>`;
};

export const printMnemonic = phrase => {
  return `<html id="print-wallet">
  <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,600,700" rel="stylesheet">
  <div class="print-container" style="margin-bottom: 50px;" id="print-container" onload="myFunction()">

      <div class="print-text">

          <p>
          We <strong>CAN NOT</strong> change your password. Please
          <strong>DO NOT FORGET</strong> to save your password, and it is your
          private key. You will need your
          <strong>Password + Mnemonic Phrase</strong> to access your wallet.
          </p>
          <h3 style="letter-spacing: 0.02rem;"> Your Mnemonic seed</h3>
          <div class="phrase">
            ${phrase}
          </div>
          <p>
              <b>Do not lose it!</b> It cannot be recovered if you lose it.
          </p>
          <p>
            <b>Do not share it!</b> Your funds will be stolen if you use this file on a phishing site.
          </p>
          <p>
            <b>Make a backup!</b> Secure it like the millions of dollars it may one day be worth.
          </p>
          <div class="footer">
            <a href="https://zillet.io">https://zillet.io</a href="">
          </div>
      </div>
  </div>
  <style>
  pre{
      margin: 0 auto 0;
      text-align:center;
  }
  .print-container {
    text-align: center;
      font-family: 'Source Sans Pro', sans-serif;
      -webkit-font-smoothing: antialiased;
      width: 900px;
      border: 1px solid gray;
      display: flex;
      margin-bottom: 50px;
      position: relative;
      color: #2d3748;

  }
  .hidden{
      visiblity:hidden;
      height: 0;
      width:0;
      margin:0;
  }
  .print-text{
      width: 100%;
      margin: auto;
      position: relative;
      padding: 20px;
      overflow: hidden;
  }
  p, strong{
      word-break: break-word;
  }
  img{
      max-width: 150px;
  }
  .phrase{
    font-family: Menlo,Monaco,Consolas,Courier New,monospace!important;
    font-weight: 500!important;
    flex: 1 1 0%;
    max-width: 500px;
    margin: auto;
    position: relative;
    padding: .75rem 1rem;
    margin-bottom: 2rem;
    border-radius: .25rem;
    border:  1px solid gray;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    line-height: 1.5;
  }
  a{
    color: rgba(#2d3748, 0.3);
    font-size: 0.8rem;
    text-decoration: none;
    text-align: center;
  }
  </style>
<html>
`;
};
