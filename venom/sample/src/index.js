import { Address, ProviderRpcClient } from "everscale-inpage-provider";
import { EverscaleStandaloneClient } from "everscale-standalone-client";
import { VenomConnect } from "venom-connect";

const standaloneFallback = () =>
    EverscaleStandaloneClient.create({
        connection: {
            id: 1,
            group: "venom_testnet",
            type: "graphql",
            data: {
                endpoints: ['localhost']
            },
        },
    });

const venomButton = document.createElement('button');
venomButton.innerHTML = 'Enable Venom';

venomButton.addEventListener('click', async () => {
    console.log('EE boay');

    const venomConnect = await init();

    venomConnect?.connect();
});

document.body.appendChild(venomButton);

async function init() {
    const initTheme = "dark";

    return new VenomConnect({
        theme: initTheme,
        checkNetworkId: 1,
        providersOptions: {
            venomwallet: {
                links: {
                    extension: [
                        {
                            browser: "chrome", // "chrome" | "firefox"
                            link: "https://chrome.google.com/webstore/detail/venom-wallet/ojggmchlghnjlapmfbnjholfjkiidbch",
                        },
                    ]
                },
                walletWaysToConnect: [
                    {
                        // NPM package
                        package: ProviderRpcClient,
                        packageOptions: {
                            fallback:
                                VenomConnect.getPromise("venomwallet", "extension") ||
                                (() => Promise.reject()),
                            forceUseFallback: true,
                        },
                        packageOptionsStandalone: {
                            fallback: standaloneFallback,
                            forceUseFallback: true,
                        },

                        // Setup
                        id: "extension",
                        type: "extension",

                        // name: "Custom Name",
                        // logo: "",

                        // High-level setup
                        // options: ,
                        // connector: ,
                        // authConnector: ,
                    },
                ],
                defaultWalletWaysToConnect: [
                    // List of enabled options
                    "mobile",
                    "ios",
                    "android",
                ],
            },
        },
    });

}