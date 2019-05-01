/*
 * printWallet
 *
 * print paper wallet
 *
 * @param {string, string}
 * @returns {HTMLDom}
 */
export function printWallet(address, pk) {
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
                <span id="paperwalletadd">0x${address}</span>
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
}
